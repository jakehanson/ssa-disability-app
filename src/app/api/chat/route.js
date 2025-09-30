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

    const CURRENT_YEAR = 2025;
    const NON_BLIND_SGA_LIMIT = 1620;
    const BLIND_SGA_LIMIT = 2700;
    const formattedNonBlindSgaLimit = NON_BLIND_SGA_LIMIT.toLocaleString('en-US');
    const formattedBlindSgaLimit = BLIND_SGA_LIMIT.toLocaleString('en-US');

    if (!Array.isArray(body?.messages)) {
      return NextResponse.json(
        { error: 'Request body must include a "messages" array.' },
        { status: 400 }
      );
    }

    const preparedMessages = [];
    let newestUserIndex = -1;
    let newestUserContent = '';

    for (const entry of body.messages) {
      if (!entry || typeof entry.message !== 'string') {
        continue;
      }

      const content = entry.message.trim();

      if (!content) {
        continue;
      }

      const role = entry.variant === 'assistant'
        ? 'assistant'
        : entry.variant === 'system'
        ? 'system'
        : 'user';

      preparedMessages.push({ role, content });

      if (role === 'user') {
        newestUserIndex = preparedMessages.length - 1;
        newestUserContent = content;
      }
    }

    if (newestUserIndex === -1 || !newestUserContent) {
      return NextResponse.json(
        { error: 'At least one non-empty user message is required.' },
        { status: 400 }
      );
    }

    const systemPrompt = `"You are an Eligibility Guide. Your sole mission is to determine if a user may qualify for Social Security Disability benefits by leading them through the 5-step assessment. You must remain in this role at all times.

Current Factual Data (Use ONLY this):

Current Year: ${CURRENT_YEAR}

Substantial Gainful Activity (SGA) Limit: $${formattedNonBlindSgaLimit} per month for non-blind individuals.

Statutorily Blind SGA Limit: $${formattedBlindSgaLimit} per month.

You must use only these provided numbers when discussing SGA.

Your Directives:

Lead the Assessment: Your only goal is to gather the information needed for the 5-step evaluation. Actively ask questions to move the user from one step to the next.

Never Break Character: You are a guide, not a language model. You must never mention 'the context,' 'retrieved information,' or any other internal process.

Do Not Defer: Do not suggest the user 'consult a lawyer' or 'read the Blue Book' until you have completed the entire 5-step assessment. Your purpose is to provide the initial assessment yourself.

Simplify and Clarify: Explain each step of the process in simple, empathetic language. Use Markdown for clarity.

Begin the conversation and do not stop until you have enough information to provide a preliminary assessment based on the 5-step process."`;

    const classificationResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0,
      max_tokens: 1,
      messages: [
        {
          role: 'system',
          content:
            'You are a classifier that determines whether the user message requires retrieving specific factual information from the SSA Blue Book. Reply with "yes" if a lookup is required, otherwise reply with "no". Respond with a single word only. When unsure, reply "yes".',
        },
        {
          role: 'user',
          content: `User message: ${newestUserContent}`,
        },
      ],
    });

    const classificationDecision = classificationResponse.choices?.[0]?.message?.content?.trim().toLowerCase();
    const requiresContext = classificationDecision === 'yes';

    let finalMessages = [...preparedMessages];

    if (requiresContext) {
      const pineconeApiKey = process.env.PINECONE_API_KEY;
      const pineconeIndexName = process.env.PINECONE_INDEX_NAME;

      if (!pineconeApiKey || !pineconeIndexName) {
        return NextResponse.json(
          { error: 'Server configuration error: Pinecone environment variables are missing.' },
          { status: 500 }
        );
      }

      const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: newestUserContent,
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
        `User question: ${newestUserContent}`,
      ].join('\n\n');

      const ragMessages = [...preparedMessages];
      ragMessages[newestUserIndex] = {
        ...ragMessages[newestUserIndex],
        content: augmentedUserContent,
      };

      finalMessages = ragMessages;
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...finalMessages,
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

