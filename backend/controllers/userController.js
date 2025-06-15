import User from "../models/userModel.js";
import Recipe from "../models/recipeModel.js";
import bcryptjs from "bcryptjs";
import {
  deleteImageFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
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
    res.status(500).json({
      success: false,
      message: "Error fetching user profile",
      error: error.message,
    });
  }
};

// Follow a user
export const followUser = async (req, res) => {
  try {
    const userId = req.userId; // User initiating the follow
    const { targetUserId } = req.body; // User to be followed

    // Validate request data
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    if (!targetUserId) {
      return res
        .status(400)
        .json({ success: false, message: "Target user ID is required" });
    }

    if (userId === targetUserId) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot follow yourself" });
    }

    // Fetch user and target user from the database
    const user = await User.findById(userId);
    const targetUser = await User.findById(targetUserId);

    // Check if both users exist
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Your account not found" });
    }

    if (!targetUser) {
      return res
        .status(404)
        .json({ success: false, message: "Target user not found" });
    }

    // Check if the user is already following the target user
    if (user.following.includes(targetUserId)) {
      return res
        .status(400)
        .json({ success: false, message: "Already following this user" });
    }

    // Update following and followers lists
    user.following.push(targetUserId);
    targetUser.followers.push(userId);

    // Save updated data to the database
    await user.save();
    await targetUser.save();

    return res
      .status(200)
      .json({ success: true, message: "User followed successfully" });
  } catch (error) {
    // Catch any unexpected errors
    return res.status(500).json({
      success: false,
      message: "An error occurred while following the user",
      error: error.message,
    });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const userId = req.userId;
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
    res.status(500).json({
      success: false,
      message: "Error unfollowing user",
      error: error.message,
    });
  }
};

// Get saved recipes for a user
export const getSavedRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("savedRecipes");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, savedRecipes: user.savedRecipes });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching saved recipes",
      error: error.message,
    });
  }
};

// Get liked recipes for a user
export const getLikedRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("likedRecipes");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, likedRecipes: user.likedRecipes });
  } catch (error) {
    res.status(500).json({
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
    res.status(500).json({
      success: false,
      message: "Error fetching created recipes",
      error: error.message,
    });
  }
};

// Create user profile
export const createUserProfile = async (req, res) => {
  let tempFilePath = null;
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    tempFilePath = req.file.path;
    let uploadResult = null;
    let attempts = 3;

    while (attempts > 0) {
      try {
        uploadResult = await uploadOnCloudinary(tempFilePath);
        if (uploadResult?.secure_url) break;
      } catch (error) {
        console.error(`Upload attempt ${4 - attempts} failed:`, error);
        if (attempts === 1) throw error;
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
      attempts--;
    }

    if (!uploadResult?.secure_url) {
      throw new Error("Failed to upload image after multiple attempts");
    }

    // Update user profile
    const user = await User.findById(req.userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.name = req.body.name;
    user.username = req.body.username;
    user.bio = req.body.bio || "";
    user.profileImage = uploadResult.secure_url;
    user.isProfileComplete = true;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile created successfully",
      user: {
        ...user.toObject(),
        password: undefined,
      },
    });
  } catch (error) {
    console.error("Profile creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create profile",
    });
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  let profileImage;
  try {
    const { name, username, bio } = req.body;
    const userId = req.userId;
    profileImage = req.file;

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

// Delete user account
export const deleteUser = async (req, res) => {
  const userId = req.userId;
  const password = req.body.password;
  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify the password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Delete the user from the database
    await User.findByIdAndDelete(userId);
    if (user.profileImage) {
      await deleteImageFromCloudinary(user.profileImage);
    }

    // Clear the cookie and send response
    res
      .clearCookie("token")
      .status(200)
      .json({ success: true, message: "User account deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user account",
      error: error.message,
    });
  }
};