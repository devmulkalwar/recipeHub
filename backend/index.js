import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import authRoutes from './routes/authRoutes.js'; // Importing authentication routes
import userRoutes from './routes/userRoutes.js'; // Importing user routes
import recipeRoutes from './routes/recipeRoutes.js'; // Importing recipe routes
import { connectDB } from './config/connectDB.js'; // Import database connection function

dotenv.config();
const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true 
}));

app.use(cookieParser());
app.use(express.json()); // For parsing application/json

// Mounting routes
app.use('/api/auth', authRoutes); // Mounting authentication routes
app.use('/api/users', userRoutes); // Mounting user routes
app.use('/api/recipes', recipeRoutes); // Mounting recipe routes

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to RecipeHub API');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
