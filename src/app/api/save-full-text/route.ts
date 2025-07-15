// src/app/api/save-full-text/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const blogContentSchema = new mongoose.Schema({
    url: { type: String, required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const BlogContent = mongoose.models.BlogContent || mongoose.model('BlogContent', blogContentSchema);

async function connectMongo() {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("MongoDB connected successfully.");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw new Error("Failed to connect to MongoDB.");
    }
}

export async function POST(request: Request) {
    console.log("Received request for /api/save-full-text");
    const { url, content } = await request.json();

    if (!url || !content) {
        return NextResponse.json({ message: 'URL and content are required' }, { status: 400 });
    }

    try {
        await connectMongo();
        const newBlogContent = new BlogContent({ url, content });
        await newBlogContent.save();
        console.log("Full text saved to MongoDB successfully.");
        return NextResponse.json({ message: 'Full text saved successfully' }, { status: 201 });

    } catch (error: any) {
        console.error('MongoDB save error:', error.message);
        return NextResponse.json({ message: 'Failed to save full text to MongoDB', error: error.message }, { status: 500 });
    }
}