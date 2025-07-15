// src/app/api/save-summary/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client using environment variables
// NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are loaded from .env.local
// The service_role key is used here because we are performing write operations
// that might bypass Row Level Security (RLS) if configured, or require elevated permissions.
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    {
        auth: {
            persistSession: false // Prevents session persistence on the server-side
        }
    }
);

/**
 * Handles POST requests to save a blog summary to Supabase.
 * This API route expects a JSON body with 'url', 'summary', and 'urduSummary'.
 * It inserts this data into the 'summaries' table in Supabase.
 *
 * @param request The incoming Next.js Request object.
 * @returns A NextResponse indicating success or failure.
 */
export async function POST(request: Request) {
    console.log("Received request for /api/save-summary"); // Log the start of the request

    // Destructure the expected data from the request body
    const { url, summary, urduSummary } = await request.json();

    // Validate incoming data
    if (!url || !summary || !urduSummary) {
        console.error("Missing required fields: URL, summary, or Urdu summary.");
        return NextResponse.json(
            { message: 'URL, summary, and Urdu summary are required' },
            { status: 400 } // Bad Request status
        );
    }

    try {
        // Insert data into the 'summaries' table in Supabase.
        // IMPORTANT: The column names here (url, summary_text, urdu_summary, created_at)
        // MUST EXACTLY MATCH the column names in your Supabase 'summaries' table.
        // Based on the last screenshot, 'summary_text' is the correct column name for the summary.
        const { data, error } = await supabase
            .from('summaries') // Ensure 'summaries' matches your Supabase table name
            .insert([
                {
                    url: url,                       // Maps to the 'url' column in Supabase
                    summary_text: summary,          // Maps to the 'summary_text' column in Supabase
                    urdu_summary: urduSummary,      // Maps to the 'urdu_summary' column in Supabase
                    created_at: new Date().toISOString() // Automatically sets current timestamp
                }
            ]);

        // If there's an error during the Supabase insert operation, throw it.
        if (error) {
            console.error('Supabase insert error details:', error); // Log full Supabase error object
            throw error;
        }

        console.log("Summary saved to Supabase successfully.", data); // Log success and returned data
        return NextResponse.json(
            { message: 'Summary saved successfully to Supabase', data },
            { status: 201 } // Created status
        );

    } catch (error: any) {
        // Catch any errors that occurred during the process
        console.error('Supabase save error:', error.message); // Log the error message
        // Return a 500 Internal Server Error response
        return NextResponse.json(
            { message: 'Failed to save summary to Supabase', error: error.message },
            { status: 500 }
        );
    }
}
