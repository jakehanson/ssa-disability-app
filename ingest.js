#!/usr/bin/env node

import dotenv from 'dotenv';
import puppeteer from 'puppeteer';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

dotenv.config({ path: '.env.local' });

const ADULT_LISTINGS_URL = 'https://www.ssa.gov/disability/professionals/bluebook/AdultListings.htm';
const UPSERT_BATCH_SIZE = 10;
const PUPPETEER_OPTIONS = {
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
};

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

const {
  OPENAI_API_KEY,
  PINECONE_API_KEY,
  PINECONE_INDEX_NAME,
} = process.env;

invariant(OPENAI_API_KEY, 'OPENAI_API_KEY is required');
invariant(PINECONE_API_KEY, 'PINECONE_API_KEY is required');
invariant(PINECONE_INDEX_NAME, 'PINECONE_INDEX_NAME is required');

function chunkText(text, maxChunkSize = 1200) {
  const paragraphs = text
    .split('\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const chunks = [];
  let currentChunk = '';

  for (const paragraph of paragraphs) {
    const candidate = currentChunk ? `${currentChunk}\n\n${paragraph}` : paragraph;
    if (candidate.length <= maxChunkSize) {
      currentChunk = candidate;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
      }

      if (paragraph.length > maxChunkSize) {
        for (let start = 0; start < paragraph.length; start += maxChunkSize) {
          chunks.push(paragraph.slice(start, start + maxChunkSize));
        }
        currentChunk = '';
      } else {
        currentChunk = paragraph;
      }
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

function parseSectionLink(text, href) {
  const normalizedText = text.replace(/\s+/g, ' ').trim();
  if (!normalizedText || !href) {
    return null;
  }

  const numberMatch = normalizedText.match(/^(\d+\.\d+)/);
  const listingNumber = numberMatch ? numberMatch[1] : undefined;
  const name = numberMatch ? normalizedText.slice(numberMatch[0].length).trim() : normalizedText;
  const slugSeed = listingNumber ? `${listingNumber}-${name || 'section'}` : name || 'section';

  return {
    url: href,
    listingNumber,
    name: name || normalizedText,
    displayName: listingNumber ? `${listingNumber} ${name}` : (name || normalizedText),
    slug: slugify(slugSeed),
  };
}

async function getAdultListingSections(browser) {
  console.log(`Navigating to ${ADULT_LISTINGS_URL}`);
  const page = await browser.newPage();
  await page.goto(ADULT_LISTINGS_URL, {
    waitUntil: 'domcontentloaded',
    timeout: 90_000,
  });

  const linkData = await page.evaluate(() => {
    const main = document.querySelector('main') || document.querySelector('#main-content') || document.body;
    if (!main) {
      return [];
    }

    const anchors = Array.from(main.querySelectorAll('a[href$="-Adult.htm"]'));
    return anchors.map((anchor) => ({
      text: anchor.textContent || '',
      href: new URL(anchor.getAttribute('href') || '', window.location.href).toString(),
    }));
  });

  await page.close();

  const uniqueSections = new Map();
  for (const { text, href } of linkData) {
    const parsed = parseSectionLink(text, href);
    if (parsed && !uniqueSections.has(parsed.slug)) {
      uniqueSections.set(parsed.slug, parsed);
    }
  }

  const sections = Array.from(uniqueSections.values()).sort((sectionA, sectionB) => {
    const aNumber = sectionA.listingNumber ? parseFloat(sectionA.listingNumber) : Number.POSITIVE_INFINITY;
    const bNumber = sectionB.listingNumber ? parseFloat(sectionB.listingNumber) : Number.POSITIVE_INFINITY;
    return aNumber - bNumber;
  });

  invariant(sections.length > 0, 'No adult listing sections were found on the directory page.');
  console.log(`Discovered ${sections.length} adult listing sections.`);

  return sections;
}

async function scrapeSectionPage(browser, section) {
  console.log(`Navigating to ${section.url}`);
  const page = await browser.newPage();
  await page.goto(section.url, {
    waitUntil: 'domcontentloaded',
    timeout: 90_000,
  });

  const mainContent = await page.evaluate(() => {
    const main = document.querySelector('main') || document.querySelector('#main-content') || document.body;
    if (!main) {
      return '';
    }

    const unwantedSelectors = ['script', 'style', 'noscript', 'iframe', 'nav', 'header', 'footer', 'form'];
    unwantedSelectors.forEach((selector) => {
      main.querySelectorAll(selector).forEach((element) => element.remove());
    });

    return main.innerText;
  });

  await page.close();

  invariant(mainContent && mainContent.trim().length > 0, `Failed to scrape content for section: ${section.displayName}`);
  console.log(`Scraping complete for ${section.displayName}.`);

  return mainContent;
}

async function clearPineconeIndex(index) {
  console.log(`Clearing existing vectors from Pinecone index '${PINECONE_INDEX_NAME}'...`);
  await index.deleteAll();
  console.log('Existing vectors removed.');
}

async function embedAndUpsertSection({ index, openai, section, chunks }) {
  console.log(`Preparing to upsert ${chunks.length} chunks for ${section.displayName}.`);

  const recordsBuffer = [];

  for (let i = 0; i < chunks.length; i += 1) {
    const chunk = chunks[i];
    console.log(`Embedding chunk ${i + 1} of ${chunks.length} for ${section.displayName}`);

    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: chunk,
    });

    const vector = embeddingResponse.data[0]?.embedding;
    invariant(Array.isArray(vector) && vector.length > 0, `Failed to generate embedding for chunk ${i + 1} in ${section.displayName}`);

    const recordId = `${section.slug}-${String(i + 1).padStart(4, '0')}`;

    recordsBuffer.push({
      id: recordId,
      values: vector,
      metadata: {
        source: section.url,
        section: section.name,
        section_display_name: section.displayName,
        listing_number: section.listingNumber,
        chunk_index: i + 1,
        text: chunk,
      },
    });

    if (recordsBuffer.length >= UPSERT_BATCH_SIZE || i === chunks.length - 1) {
      await index.upsert(recordsBuffer);
      recordsBuffer.length = 0;
    }
  }

  console.log(`Finished upserting ${chunks.length} chunks for ${section.displayName}.`);
}

async function main() {
  let browser;

  try {
    browser = await puppeteer.launch(PUPPETEER_OPTIONS);

    const sections = await getAdultListingSections(browser);
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
    const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });
    const index = pinecone.index(PINECONE_INDEX_NAME);

    await clearPineconeIndex(index);

    for (let i = 0; i < sections.length; i += 1) {
      const section = sections[i];
      console.log(`\n[${i + 1}/${sections.length}] Processing ${section.displayName}`);

      const pageText = await scrapeSectionPage(browser, section);
      const chunks = chunkText(pageText);
      console.log(`Chunking complete for ${section.displayName}. Produced ${chunks.length} chunks.`);

      await embedAndUpsertSection({ index, openai, section, chunks });
    }

    console.log('\nIngestion complete!');
  } catch (error) {
    console.error('Error during ingestion:', error);
    process.exitCode = 1;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

main();

