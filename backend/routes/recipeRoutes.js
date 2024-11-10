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

const router = express.Router();

// Create a new recipe
router.post('/create', createRecipe);

// Get a recipe by its ID
router.get('/:id', getRecipeById);

// Get all recipes
router.get('/', getAllRecipes);

// Get recipes created by a specific user
router.get('/user/:userId', getRecipesByUser);

// Get recipes by category
router.get('/category/:category', getRecipesByCategory);

// Update a recipe by ID
router.put('/:id', updateRecipe);

// Delete a recipe by ID
router.delete('/:id', deleteRecipe);

// Like a recipe
router.put('/:id/like', likeRecipe);

// Save a recipe
router.put('/:id/save', saveRecipe);

// Search recipes by name or ingredients
router.get('/search', searchRecipes);

router.get('/sort', sortRecipes);

router.get('/filter', filterRecipes);

export default router;
