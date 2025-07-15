// src/app/api/save-full-text/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose'; // Mongoose is an ODM (Object Data Modeling) library for MongoDB

// Define a Mongoose Schema for your blog content.
// This defines the structure and types of documents in your MongoDB collection.
const blogContentSchema = new mongoose.Schema({
    url: { type: String, required: true }, // The URL of the blog post
    content: { type: String, required: true }, // The full scraped text content
    timestamp: { type: Date, default: Date.now }, // When the content was saved
});

// Create a Mongoose Model from the schema.
// `mongoose.models.BlogContent` checks if the model already exists to prevent recompilation issues
// in Next.js development mode (due to hot reloading).
const BlogContent = mongoose.models.BlogContent || mongoose.model('BlogContent', blogContentSchema);

// Function to connect to MongoDB.
// It checks if a connection already exists to avoid multiple connections.
async function connectMongo() {
    if (mongoose.connection.readyState >= 1) {
        return; // Already connected
    }
    try {
        // Connect to MongoDB using the connection string from environment variables
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("MongoDB connected successfully.");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        // Throw an error to indicate connection failure
        throw new Error("Failed to connect to MongoDB.");
    }
}

// This function handles POST requests to /api/save-full-text
export async function POST(request: Request) {
    const { url, content } = await request.json();

    // Validate incoming data
    if (!url || !content) {
        return NextResponse.json({ message: 'URL and content are required' }, { status: 400 });
    }

    try {
        // Ensure connection to MongoDB before performing database operations
        await connectMongo();

        // Create a new document instance using the Mongoose model
        const newBlogContent = new BlogContent({ url, content });
        // Save the new document to the MongoDB collection
        await newBlogContent.save();

        return NextResponse.json({ message: 'Full text saved successfully' }, { status: 201 }); // 201 Created status
    } catch (error: any) {
        console.error('MongoDB save error:', error.message);
        return NextResponse.json({ message: 'Failed to save full text to MongoDB', error: error.message }, { status: 500 });
    }
}