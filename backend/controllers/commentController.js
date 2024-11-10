// controllers/commentController.js
import Comment from '../models/commentModel.js';

import Recipe from '../models/recipeModel.js'; 

// Add a new comment
export const addComment = async (req, res) => {
    try {
        const { recipeId, text } = req.body;
        const comment = await Comment.create({
            user: req.user.id, // Assuming req.user contains the authenticated user's ID
            text,
        });

        // Optional: add comment to recipe's comments array
        await Recipe.findByIdAndUpdate(recipeId, { $push: { comments: comment._id } });

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: "Error adding comment", error });
    }
};

// Get all comments for a specific recipe
export const getCommentsByRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const comments = await Comment.find({ recipe: recipeId }).populate('user', 'username profileImage');

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching comments", error });
    }
};

// Update a comment
export const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { text } = req.body;

        const updatedComment = await Comment.findOneAndUpdate(
            { _id: commentId, user: req.user.id }, // Ensures only the owner can update
            { text },
            { new: true }
        );

        if (!updatedComment) return res.status(404).json({ message: "Comment not found" });

        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ message: "Error updating comment", error });
    }
};

// Delete a comment
export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const deletedComment = await Comment.findOneAndDelete({
            _id: commentId,
            user: req.user.id, // Ensures only the owner can delete
        });

        if (!deletedComment) return res.status(404).json({ message: "Comment not found" });

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting comment", error });
    }
};
