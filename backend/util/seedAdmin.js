import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../model/user.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        const adminExists = await User.findOne({ role: 'admin' });
        if (adminExists) {
            process.exit(0);
        }

        await User.create({
            firstName: 'System',
            lastName: 'Admin',
            email: process.env.INITIAL_ADMIN_EMAIL,
            password: process.env.INITIAL_ADMIN_PASSWORD,
            role: 'admin'
        });
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();