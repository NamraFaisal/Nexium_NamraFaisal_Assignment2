// test-mongo-connection.js
const mongoose = require('mongoose');
require('dotenv').config(); // To load your .env.local variables

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error("MONGODB_URI is not set in .env.local!");
    process.exit(1);
}

console.log("Attempting to connect to MongoDB...");
console.log("Using URI (password hidden):", uri.replace(/:([^:]+)@/, ':****@')); // Hide password for logging

mongoose.connect(uri)
    .then(() => {
        console.log('MongoDB connection successful!');
        mongoose.connection.close(); // Close connection after successful test
    })
    .catch(err => {
        console.error('MongoDB connection failed:', err);
    });