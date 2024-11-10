// routes/commentRoutes.js
import express from "express";
import {
  addComment,
  getCommentsByRecipe,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";
import verifyToken from "../middlewares/authMiddleware.js";

const router = express.Router();

// Add a new comment to a recipe
router.post("/:recipeId", verifyToken, addComment);

// Get all comments for a specific recipe
router.get("/:recipeId", getCommentsByRecipe);

// Update a specific comment
router.put("/:commentId", verifyToken, updateComment);

// Delete a specific comment
router.delete("/:commentId", verifyToken, deleteComment);

export default router;
