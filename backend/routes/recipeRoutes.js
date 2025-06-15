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
import { recipeUpload } from '../middlewares/multerMiddleware.js';

const router = express.Router();

// Create a new recipe with image upload and token verification
router.post(
  '/create-recipe',
  verifyToken,
  checkProfileComplete,
  recipeUpload.single('recipeImage'),
  createRecipe
);

// Fix the route ordering and paths
// Get all recipes - Move this route before the :id route to prevent conflicts
router.get('/get-recipes', getAllRecipes);

// Get filtered recipes
router.get('/filter', filterRecipes);

// Search recipes
router.get('/search', searchRecipes);

// Get recipes by category
router.get('/category/:category', getRecipesByCategory);

// Get recipes by user
router.get('/user/:userId', getRecipesByUser);

// These routes should come after the more specific routes
router.get('/:id', getRecipeById);
router.put('/:id/update-recipe', verifyToken, recipeUpload.single('recipeImage'), updateRecipe);
router.delete('/:id', verifyToken, deleteRecipe);
router.put('/:id/like', verifyToken, likeRecipe);
router.put('/:id/unlike', verifyToken, unlikeRecipe);
router.put('/:id/save', verifyToken, saveRecipe);

// Sort recipes
router.get('/sort', sortRecipes);

export default router;

