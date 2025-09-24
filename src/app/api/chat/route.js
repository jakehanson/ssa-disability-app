import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();

    if (typeof body?.message !== 'string') {
      return NextResponse.json(
        { error: 'Request body must include a "message" string.' },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that answers questions about Social Security Disability assessments.',
        },
        { role: 'user', content: body.message },
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

