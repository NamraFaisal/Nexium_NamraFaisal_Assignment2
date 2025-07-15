// src/app/api/summarize-ai/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    console.log("Received request for /api/summarize-ai");
    const { textToSummarize } = await request.json();

    if (!textToSummarize) {
        return NextResponse.json({ message: 'Text to summarize is required' }, { status: 400 });
    }

    try {
        // --- REAL AI SUMMARIZATION using Gemini API ---
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("Gemini API key is not configured.");
        }

        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: `Summarize the following text:\n\n${textToSummarize}` }] });

        const payload = { contents: chatHistory };
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        console.log("Calling Gemini API for summarization...");
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API summarization error response:", errorData);
            throw new Error(errorData.error?.message || 'Failed to get summary from Gemini API.');
        }

        const result = await response.json();
        let aiSummary = "No summary generated.";

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            aiSummary = result.candidates[0].content.parts[0].text;
        } else {
            console.warn("Gemini API response structure unexpected or no content:", result);
            throw new Error("Gemini API returned an unexpected response structure for summarization.");
        }

        console.log("Successfully generated AI summary.");
        return NextResponse.json({ summary: aiSummary }, { status: 200 });

    } catch (error: any) {
        console.error('AI summarization error:', error.message);
        return NextResponse.json({ message: 'Failed to generate AI summary', error: error.message }, { status: 500 });
    }
}
