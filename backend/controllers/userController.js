import User from '../models/userModel.js';
import Recipe from '../models/recipeModel.js';

// Get user profile by ID
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate({
        path: 'followers',
        select: 'username profileImage', // Fetch basic follower details
      })
      .populate({
        path: 'following',
        select: 'username profileImage', // Fetch basic following details
      })
      .populate({
        path: 'savedRecipes',
        populate: {
          path: 'createdBy',
          select: 'username profileImage', // Fetch recipe creator details
        },
      })
      .populate({
        path: 'likedRecipes',
        populate: {
          path: 'createdBy',
          select: 'username profileImage', // Fetch recipe creator details
        },
      });

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
    const { userId } = req.body;
    const followerId = req.user.id;

    if (followerId === userId) {
      return res.status(400).json({ message: 'You cannot follow yourself.' });
    }

    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!userToFollow.followers.includes(followerId)) {
      userToFollow.followers.push(followerId);
      await userToFollow.save();

      const follower = await User.findById(followerId);
      if (!follower.following.includes(userId)) {
        follower.following.push(userId);
        await follower.save();
      }
    }

    res.status(200).json({ message: 'You are now following this user.' });
  } catch (error) {
    res.status(500).json({ message: 'Error following user', error: error.message });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const followerId = req.user.id;

    const userToUnfollow = await User.findById(userId);
    if (!userToUnfollow) {
      return res.status(404).json({ message: 'User not found.' });
    }

    userToUnfollow.followers.pull(followerId);
    await userToUnfollow.save();

    const follower = await User.findById(followerId);
    follower.following.pull(userId);
    await follower.save();

    res.status(200).json({ message: 'You have unfollowed this user.' });
  } catch (error) {
    res.status(500).json({ message: 'Error unfollowing user', error: error.message });
  }
};

// Get saved recipes for the user with full details
export const getSavedRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: 'savedRecipes',
      populate: {
        path: 'createdBy',
        select: 'username profileImage',
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.savedRecipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching saved recipes', error: error.message });
  }
};

// Get liked recipes for the user with full details
export const getLikedRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: 'likedRecipes',
      populate: {
        path: 'createdBy',
        select: 'username profileImage',
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.likedRecipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching liked recipes', error: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
    try {
      const userId = req.params.id;
      const { name, username, email, profileImage, bio } = req.body;
  
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update the fields only if they are provided in the request body
      if (name) user.name = name;
      if (username) user.username = username;
      if (email) user.email = email;
      if (profileImage) user.profileImage = profileImage;
      if (bio) user.bio = bio;
  
      // Save the updated user
      const updatedUser = await user.save();
  
      res.status(200).json({
        message: 'User profile updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error updating user profile', error: error.message });
    }
  };
  
  // Delete a user by ID
export const deleteUser = async (req, res) => {
    try {
      const userId = req.params.id;
  
      // Find the user to delete
      const userToDelete = await User.findById(userId);
      if (!userToDelete) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Remove the user from other users' followers and following lists
      await User.updateMany(
        { following: userId },
        { $pull: { following: userId } }
      );
      await User.updateMany(
        { followers: userId },
        { $pull: { followers: userId } }
      );
  
      // Delete the user’s recipes if necessary (optional step)
      await Recipe.deleteMany({ createdBy: userId });
  
      // Finally, delete the user
      await User.findByIdAndDelete(userId);
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
  };
  