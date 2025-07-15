// src/app/api/summarize-ai/route.ts
import { NextResponse } from 'next/server';

// ... (your simulated dictionary or actual LLM setup) ...

export async function POST(request: Request) { // <-- This 'export' is crucial
    const { textToSummarize } = await request.json();

    if (!textToSummarize) {
        return NextResponse.json({ message: 'Text to summarize is required' }, { status: 400 });
    }

    try {
        // --- SIMULATED AI SUMMARIZATION ---
        const simulatedSummary = `This is a simulated AI summary of the provided blog content. It highlights the main points and gives a brief overview. For a real summary, integrate with a powerful LLM like Gemini.`;

        return NextResponse.json({ summary: simulatedSummary }, { status: 200 });
    } catch (error: any) {
        console.error('AI summarization error:', error.message);
        return NextResponse.json({ message: 'Failed to generate AI summary', error: error.message }, { status: 500 });
    }
}