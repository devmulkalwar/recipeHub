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
router.get('/:id', verifyToken, getUserProfile);

// Follow a user
router.post('/follow', verifyToken, followUser);

// Unfollow a user
router.post('/unfollow', verifyToken, unfollowUser);

// Get saved recipes for a user
router.get('/:id/saved-recipes', verifyToken, getSavedRecipes);

// Get liked recipes for a user
router.get('/:id/liked-recipes', verifyToken, getLikedRecipes);

// Update user profile (e.g., bio, profile image, etc.)
router.put('/:id/update-profile', verifyToken, updateUserProfile);

router.post('/:id/create-profile',upload.single('profileImage'), verifyToken, createUserProfile);

// Delete user account
router.delete('/delete', verifyToken, deleteUser);

export default router;
