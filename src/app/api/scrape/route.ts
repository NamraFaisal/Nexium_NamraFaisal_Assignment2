// src/app/api/scrape/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export async function POST(request: Request) {
    console.log("Received request for /api/scrape");
    let url = '';

    try {
        const body = await request.json();
        url = body.url;
        console.log("Scraping URL:", url);

        if (!url) {
            console.log("URL is missing in request body.");
            return NextResponse.json({ message: 'URL is required' }, { status: 400 });
        }

        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        console.log("Successfully fetched data from URL.");

        const $ = cheerio.load(data);
        const articleText = $('article, .post-content, .blog-content, body').text();
        const cleanedText = articleText.replace(/\s\s+/g, ' ').trim();
        console.log("Successfully extracted and cleaned text.");

        return NextResponse.json({ originalContent: cleanedText }, { status: 200 });

    } catch (error: any) {
        console.error('Detailed Scraping error in /api/scrape:', error.message);
        if (error.response) {
            console.error('Error response status:', error.response.status);
            console.error('Error response data:', error.response.data);
        } else if (error.request) {
            console.error('Error request:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
        return NextResponse.json({ message: 'Failed to scrape blog content', error: error.message }, { status: 500 });
    }
}