// controllers/userController.js
import User from '../models/userModel.js';
import Recipe from '../models/recipeModel.js';

// Get user profile by ID
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('followers', 'username') // Populate followers' usernames
            .populate('following', 'username') // Populate following usernames
            .populate('savedRecipes') // Populate saved recipes
            .populate('likedRecipes'); // Populate liked recipes

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
};

// Follow a user
export const followUser = async (req, res) => {
    try {
        const { userId } = req.body; // User to follow
        const followerId = req.user.id; // Assuming req.user is set by auth middleware

        // Ensure the user is not trying to follow themselves
        if (followerId === userId) {
            return res.status(400).json({ message: "You cannot follow yourself." });
        }

        const userToFollow = await User.findById(userId);
        if (!userToFollow) {
            return res.status(404).json({ message: "User not found." });
        }

        // Add follower
        userToFollow.followers.push(followerId);
        await userToFollow.save();

        // Add following
        const follower = await User.findById(followerId);
        follower.following.push(userId);
        await follower.save();

        res.status(200).json({ message: "You are now following this user." });
    } catch (error) {
        res.status(500).json({ message: 'Error following user', error: error.message });
    }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
    try {
        const { userId } = req.body; // User to unfollow
        const followerId = req.user.id; // Assuming req.user is set by auth middleware

        const userToUnfollow = await User.findById(userId);
        if (!userToUnfollow) {
            return res.status(404).json({ message: "User not found." });
        }

        // Remove follower
        userToUnfollow.followers.pull(followerId);
        await userToUnfollow.save();

        // Remove following
        const follower = await User.findById(followerId);
        follower.following.pull(userId);
        await follower.save();

        res.status(200).json({ message: "You have unfollowed this user." });
    } catch (error) {
        res.status(500).json({ message: 'Error unfollowing user', error: error.message });
    }
};

// Get saved recipes for the user
export const getSavedRecipes = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('savedRecipes'); // Populate saved recipes

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.savedRecipes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching saved recipes', error: error.message });
    }
};

// Get liked recipes for the user
export const getLikedRecipes = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate('likedRecipes'); // Populate liked recipes

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.likedRecipes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching liked recipes', error: error.message });
    }
};
