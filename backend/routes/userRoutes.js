import express from 'express';
import {
    getUserProfile,
    followUser,
    unfollowUser,
    getSavedRecipes,
    getLikedRecipes,
    updateUserProfile,
    deleteUser
} from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js'; // Protect routes

const router = express.Router();

// Get user profile
router.get('/:id', authMiddleware, getUserProfile);

// Follow a user
router.post('/follow', authMiddleware, followUser);

// Unfollow a user
router.post('/unfollow', authMiddleware, unfollowUser);

// Get saved recipes for a user
router.get('/:id/saved-recipes', authMiddleware, getSavedRecipes);

// Get liked recipes for a user
router.get('/:id/liked-recipes', authMiddleware, getLikedRecipes);

// Update user profile (e.g., bio, profile image, etc.)
router.put('/update', authMiddleware, updateUserProfile);

// Delete user account
router.delete('/delete', authMiddleware, deleteUser);

export default router;
