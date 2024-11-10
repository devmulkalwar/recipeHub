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
} from '../controllers/recipeController.js';
import verifyToken from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create a new recipe
router.post('/create', verifyToken, createRecipe); 

// Get a recipe by its ID
router.get('/:id', getRecipeById);

// Get all recipes
router.get('/', getAllRecipes);

// Get recipes created by a specific user
router.get('/user/:userId', getRecipesByUser);

// Get recipes by category
router.get('/category/:category', getRecipesByCategory);

// Update a recipe by ID
router.put('/:id', verifyToken, updateRecipe);

// Delete a recipe by ID
router.delete('/:id', verifyToken, deleteRecipe);

// Like a recipe
router.put('/:id/like', verifyToken,likeRecipe);

// Save a recipe
router.put('/:id/save', verifyToken, saveRecipe);

// Search recipes by name or ingredients
router.get('/search', searchRecipes);

router.get('/sort', sortRecipes);

router.get('/filter', filterRecipes);

export default router;
