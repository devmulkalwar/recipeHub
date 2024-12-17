import express from 'express';
import {
    getUserProfile,
    followUser,
    unfollowUser,
    getSavedRecipes,
    getLikedRecipes,
    updateUserProfile,
    createUserProfile,
    deleteUser
} from '../controllers/userController.js';
import verifyToken from '../middlewares/authMiddleware.js';
import {upload} from "../middlewares/multerMiddleware.js";

const router = express.Router();

// Get user profile
router.get('/:id', getUserProfile);

// Follow a user
router.post('/follow', verifyToken, followUser);

// Unfollow a user
router.post('/unfollow', verifyToken, unfollowUser);

// Get saved recipes for a user
router.get('/saved-recipes', verifyToken, getSavedRecipes);

// Get liked recipes for a user
router.get('/liked-recipes', verifyToken, getLikedRecipes);

// Create a new user profile (e.g., bio, profile image, etc.)
router.post('/create-profile',upload.single('profileImage'), verifyToken, createUserProfile);

// Update user profile (e.g., bio, profile image, etc.)
router.put('/update-profile',upload.single('profileImage'),verifyToken, updateUserProfile);

// Delete user account
router.delete('/delete-user', verifyToken, deleteUser);

export default router;
