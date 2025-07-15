// src/app/api/scrape/route.ts
import { NextResponse } from 'next/server'; // Used for creating API responses in App Router
import axios from 'axios'; // For making HTTP requests to external websites
import * as cheerio from 'cheerio'; // For parsing HTML and extracting data

// This function handles POST requests to /api/scrape
export async function POST(request: Request) {
    // Parse the request body to get the URL sent from the frontend
    const { url } = await request.json();

    // Basic validation: Check if a URL was provided
    if (!url) {
        // If no URL, return a 400 Bad Request response
        return NextResponse.json({ message: 'URL is required' }, { status: 400 });
    }

    try {
        // Make an HTTP GET request to the provided URL to fetch its content
        const { data } = await axios.get(url, {
            // It's good practice to send a User-Agent header to mimic a real browser.
            // Some websites block requests without a recognized User-Agent.
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        // Load the fetched HTML data into Cheerio for parsing
        const $ = cheerio.load(data);

        // --- HTML Content Extraction Logic ---
        // This is a crucial part. You need to identify the HTML elements
        // that contain the main article text on the blogs you want to scrape.
        // Common selectors include <article>, elements with classes like .post-content, .blog-content.
        // If these don't work for a specific blog, you'll need to inspect its HTML
        // using your browser's developer tools and find the correct selector.
        const articleText = $('article, .post-content, .blog-content, body').text();

        // Clean up the extracted text:
        // - Replace multiple whitespace characters (including newlines) with a single space.
        // - Trim leading/trailing whitespace.
        const cleanedText = articleText.replace(/\s\s+/g, ' ').trim();

        // Return the cleaned original content as a JSON response
        return NextResponse.json({ originalContent: cleanedText }, { status: 200 });

    } catch (error: any) {
        // If any error occurs during scraping (e.g., network error, invalid URL)
        console.error('Scraping error:', error.message);
        // Return a 500 Internal Server Error response with an error message
        return NextResponse.json({ message: 'Failed to scrape blog content', error: error.message }, { status: 500 });
    }
}