import OpenAI from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let pineconeClient;

function getPineconeClient(apiKey) {
  if (!pineconeClient) {
    pineconeClient = new Pinecone({ apiKey });
  }

  return pineconeClient;
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (typeof body?.message !== 'string') {
      return NextResponse.json(
        { error: 'Request body must include a "message" string.' },
        { status: 400 }
      );
    }

    const pineconeApiKey = process.env.PINECONE_API_KEY;
    const pineconeIndexName = process.env.PINECONE_INDEX_NAME;

    if (!pineconeApiKey || !pineconeIndexName) {
      return NextResponse.json(
        { error: 'Server configuration error: Pinecone environment variables are missing.' },
        { status: 500 }
      );
    }

    const userMessage = body.message.trim();

    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: userMessage,
    });

    const queryEmbedding = embeddingResponse.data?.[0]?.embedding;

    if (!Array.isArray(queryEmbedding) || queryEmbedding.length === 0) {
      throw new Error('Failed to generate embedding for the incoming message.');
    }

    const pinecone = getPineconeClient(pineconeApiKey);
    const index = pinecone.index(pineconeIndexName);

    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK: 3,
      includeMetadata: true,
    });

    const contextSections = (queryResponse.matches ?? [])
      .map((match, idx) => {
        const text = match?.metadata?.text;
        if (!text) {
          return null;
        }

        const section = match.metadata?.section_display_name ?? match.metadata?.section;
        const source = match.metadata?.source;
        const score = typeof match.score === 'number' ? `Score: ${match.score.toFixed(3)}` : null;

        const headerParts = [`Context ${idx + 1}`];
        if (section) {
          headerParts.push(`Section: ${section}`);
        }
        if (score) {
          headerParts.push(score);
        }

        const header = headerParts.join(' | ');
        const sourceLine = source ? `Source: ${source}` : null;

        return [header, text, sourceLine].filter(Boolean).join('\n');
      })
      .filter(Boolean);

    const augmentedUserContent = [
      'Use the following SSA Blue Book context to answer the user question. If the context is insufficient, acknowledge that before responding.',
      contextSections.length
        ? contextSections.join('\n\n---\n\n')
        : 'No relevant SSA Blue Book passages were retrieved.',
      `User question: ${userMessage}`,
    ].join('\n\n');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Act as an expert and empathetic assistant who helps people understand complex Social Security Disability rules. Your primary goal is to make technical information easy to understand by following these guiding principles:

Simplify and Explain: Do not just repeat the context. Explain all technical requirements in simple, plain English.

Structure with Markdown: Use Markdown to format your entire response. Prefer to use headings (##) and subheadings (###) to create a clear structure. For example, topics like "Upper Extremities" are great candidates for subheadings. Use bullet points (*) for any lists of requirements or examples.

Be Honest: If the provided context doesn't contain the answer to the user's question, you must state that clearly before offering any general guidance.`,
        },
        { role: 'user', content: augmentedUserContent },
      ],
    });

    const replyContent = response.choices?.[0]?.message?.content?.trim();

    if (!replyContent) {
      throw new Error('No content returned from OpenAI');
    }

    return NextResponse.json({ reply: replyContent });
  } catch (error) {
    console.error('Error handling chat request:', error);

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        {
          error:
            error.message || 'Upstream OpenAI request failed. Please try again.',
        },
        { status: error.status ?? 500 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid JSON payload.' },
      { status: 400 }
    );
  }
}

