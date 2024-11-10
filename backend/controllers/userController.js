import User from "../models/userModel.js";
import Recipe from "../models/recipeModel.js";
import { deleteImageFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

// Get user profile by ID
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching user profile",
        error: error.message,
      });
  }
};

// Follow a user
export const followUser = async (req, res) => {
  try {
    const { userId, targetUserId } = req.body;
    if (userId === targetUserId) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot follow yourself" });
    }

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!user.following.includes(targetUserId)) {
      user.following.push(targetUserId);
      targetUser.followers.push(userId);

      await user.save();
      await targetUser.save();

      res
        .status(200)
        .json({ success: true, message: "User followed successfully" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Already following this user" });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error following user",
        error: error.message,
      });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  try {
    const { userId, targetUserId } = req.body;

    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    if (!user || !targetUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.following.includes(targetUserId)) {
      user.following = user.following.filter(
        (id) => id.toString() !== targetUserId
      );
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== userId
      );

      await user.save();
      await targetUser.save();

      res
        .status(200)
        .json({ success: true, message: "User unfollowed successfully" });
    } else {
      res
        .status(400)
        .json({ success: false, message: "You are not following this user" });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error unfollowing user",
        error: error.message,
      });
  }
};

// Get saved recipes for a user
export const getSavedRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("savedRecipes");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, savedRecipes: user.savedRecipes });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching saved recipes",
        error: error.message,
      });
  }
};

// Get liked recipes for a user
export const getLikedRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("likedRecipes");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, likedRecipes: user.likedRecipes });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching liked recipes",
        error: error.message,
      });
  }
};

// Get created recipes for a user
export const getCreatedRecipes = async (req, res) => {
  try {
    const userId = req.params.id;
    const recipes = await Recipe.find({ createdBy: userId });
    if (!recipes) {
      return res
        .status(404)
        .json({ success: false, message: "No recipes found for this user" });
    }
    res.status(200).json({ success: true, recipes });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching created recipes",
        error: error.message,
      });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  let profileImage; // Declare profileImage outside the try block so it's accessible in the catch block
  try {
    const userId = req.params.id;
    const { name, username, bio } = req.body;
    profileImage = req.file; // Set profileImage to req.file

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let profileImageUrl = user.profileImage;

    // Delete the old profile image from Cloudinary if a new one is uploaded
    if (profileImage) {
      const { path } = profileImage;

      // If the user has an old profile image, delete it from Cloudinary
      if (user.profileImage) {
        await deleteImageFromCloudinary(user.profileImage);
      }

      // Upload the new profile image to Cloudinary
      const cloudinaryResult = await uploadOnCloudinary(path);
      profileImageUrl = cloudinaryResult.url;
    }

    // Update fields if they are provided
    if (name) user.name = name;
    if (username) user.username = username;
    if (bio) user.bio = bio;
    user.profileImage = profileImageUrl;

    // Set profileComplete if all required fields are filled
    user.profileComplete = !!(
      user.name &&
      user.username &&
      user.profileImage &&
      user.bio
    );

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: { ...updatedUser._doc, password: undefined },
    });
  } catch (error) {
    // If there was an error and a profile image was uploaded, remove the temporary file
    if (profileImage && profileImage.path) {
      fs.unlinkSync(profileImage.path);
    }
    res.status(500).json({
      success: false,
      message: "Error updating user profile",
      error: error.message,
    });
  }
};

// Create user profile
export const createUserProfile = async (req, res) => {
  const userId = req.params.id;
  const { name, username, bio } = req.body;
  const profileImage = req.file;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.name && user.username) {
      return res
        .status(400)
        .json({ success: false, message: "Profile already completed" });
    }

    let profileImageUrl = user.profileImage;

    // Upload the new profile image to Cloudinary if provided
    if (profileImage) {
      const { path } = profileImage;
      const cloudinaryResult = await uploadOnCloudinary(path);
      profileImageUrl = cloudinaryResult.url;

    }

    // Update user profile with new data
    user.name = name || user.name;
    user.username = username || user.username;
    user.profileImage = profileImageUrl;
    user.bio = bio || user.bio;
    user.isProfileComplete = true;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile completed successfully",
      user: { ...updatedUser._doc, password: undefined },
    });
  } catch (error) {
    // Clean up temporary image file if there was an error during the process
    if (profileImage && profileImage.path) {
      fs.unlinkSync(profileImage.path);
    }
    res.status(500).json({
      success: false,
      message: "Error completing profile",
      error: error.message,
    });
  }
};

// Delete user account
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User account deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error deleting user account",
        error: error.message,
      });
  }
};
