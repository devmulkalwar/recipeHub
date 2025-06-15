import express from 'express';
import {
  createRecipe,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  getAllRecipes,
  getRecipesByUser,
  getRecipesByCategory,
  likeRecipe,
  saveRecipe,
  searchRecipes,
  sortRecipes,
  filterRecipes,
  unlikeRecipe,
} from '../controllers/recipeController.js';
import verifyToken from '../middlewares/authMiddleware.js';
import checkProfileComplete from '../middlewares/profileMiddleware.js';
import { upload } from '../middlewares/multerMiddleware.js';

const router = express.Router();

// Create a new recipe with image upload and token verification
router.post('/create-recipe', verifyToken, checkProfileComplete, upload.single('recipeImage'), createRecipe);

// Get a recipe by its ID
router.get('/:id', getRecipeById);

// Get all recipes
router.get('/get-recipes', getAllRecipes);

// Get recipes created by a specific user
router.get('/user/:userId', getRecipesByUser);

// Get recipes by category
router.get('/category/:category', getRecipesByCategory);

// Update a recipe by ID
router.put('/:id/update-recipe', verifyToken, upload.single('recipeImage'), updateRecipe);

// Delete a recipe by ID
router.delete('/:id', verifyToken, deleteRecipe);

// Like a recipe
router.put('/:id/like', verifyToken, likeRecipe);

// unike a recipe
router.put('/:id/unlike', verifyToken, unlikeRecipe);

// Save a recipe
router.put('/:id/save', verifyToken, saveRecipe);

// Search recipes by name or ingredients
router.get('/search', searchRecipes);

// Sort recipes
router.get('/sort', sortRecipes);

// Filter recipes
router.get('/filter', filterRecipes);

export default router;
