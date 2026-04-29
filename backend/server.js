import app from './app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v2 as cloudinary } from "cloudinary";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
})
