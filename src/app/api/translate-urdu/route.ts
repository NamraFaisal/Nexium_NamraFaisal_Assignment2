// src/app/api/translate-urdu/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    console.log("Received request for /api/translate-urdu");
    const { textToTranslate } = await request.json();

    if (!textToTranslate) {
        return NextResponse.json({ message: 'Text to translate is required' }, { status: 400 });
    }

    try {
        // --- REAL AI TRANSLATION using Gemini API ---
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("Gemini API key is not configured.");
        }

        // Changed 'let' to 'const' as chatHistory is not reassigned
        const chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: `Translate the following English text to Urdu:\n\n${textToTranslate}` }] });

        const payload = { contents: chatHistory };
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        console.log("Calling Gemini API for translation...");
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini API translation error response:", errorData);
            throw new Error(errorData.error?.message || 'Failed to get translation from Gemini API.');
        }

        const result = await response.json();
        let translatedText = "No translation generated.";

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            translatedText = result.candidates[0].content.parts[0].text;
        } else {
            console.warn("Gemini API response structure unexpected or no content:", result);
            throw new Error("Gemini API returned an unexpected response structure for translation.");
        }

        console.log("Successfully translated text to Urdu.");
        return NextResponse.json({ translatedText: translatedText }, { status: 200 });

    } catch (error: unknown) { // Changed 'any' to 'unknown'
        // Type guard to handle 'unknown' error type
        let errorMessage = 'An unknown error occurred during translation.';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }

        console.error('Translation error:', errorMessage);
        return NextResponse.json({ message: 'Failed to translate text', error: errorMessage }, { status: 500 });
    }
}
