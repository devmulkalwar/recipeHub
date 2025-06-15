import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import authRoutes from './routes/authRoutes.js'; // Importing authentication routes
import userRoutes from './routes/userRoutes.js'; // Importing user routes
import recipeRoutes from './routes/recipeRoutes.js'; // Importing recipe routes
import commentRoutes from './routes/commentRoutes.js'; // Import comments
import { connectDB } from './config/connectDB.js'; // Import database connection function
import path from 'path';

dotenv.config();
const app = express();

// Connect to the database
connectDB();

// CORS configuration with credentials
app.use(cors({
  origin: 'http://localhost:5173', // Vite's default port
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
}));

// Middleware order is important
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
app.use('/uploads', express.static(path.join(process.cwd(), 'backend/public/uploads')));

// Mounting routes
app.use('/api/auth', authRoutes); // Mounting authentication routes
app.use('/api/users', userRoutes); // Mounting user routes
app.use('/api/recipes', recipeRoutes); // Mounting recipe routes
app.use('/api/comments', commentRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to RecipeHub API');
});

// Start the server
const PORT = process.env.PORT || 3000;

// More descriptive server startup
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}`);
  console.log('CORS enabled for origin:', 'http://localhost:5173');
});
