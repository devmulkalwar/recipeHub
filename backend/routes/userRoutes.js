import express from 'express';
import {
    getUserProfile,
    followUser,
    unfollowUser,
    getSavedRecipes,
    getLikedRecipes
} from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js'; // Protect routes

const router = express.Router();

// Get user profile
router.get('/:id', authMiddleware, getUserProfile); // Protect this route

// Follow user
router.post('/follow', authMiddleware, followUser);

// Unfollow user
router.post('/unfollow', authMiddleware, unfollowUser);

// Get saved recipes
router.get('/:id/saved-recipes', authMiddleware, getSavedRecipes);

// Get liked recipes
router.get('/:id/liked-recipes', authMiddleware, getLikedRecipes);

export default router;
