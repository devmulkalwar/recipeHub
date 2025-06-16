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
  getSavedRecipes,
  unsaveRecipe,
} from '../controllers/recipeController.js';
import verifyToken from '../middlewares/authMiddleware.js';
import checkProfileComplete from '../middlewares/profileMiddleware.js';
import { recipeUpload } from '../middlewares/multerMiddleware.js';

const router = express.Router();

// User specific routes should come before generic routes
router.get('/user/:userId', getRecipesByUser);
router.get('/search', searchRecipes);
router.get('/filter', filterRecipes);
router.get('/get-recipes', getAllRecipes);
router.get('/category/:category', getRecipesByCategory);
router.get('/saved-recipes/:userId', getSavedRecipes);

// Create a new recipe with image upload and token verification
router.post(
  '/create-recipe',
  verifyToken,
  checkProfileComplete,
  recipeUpload.single('recipeImage'),
  createRecipe
);

// These routes should come after the more specific routes
router.get('/:id', getRecipeById);
router.put('/:id/update-recipe', verifyToken, recipeUpload.single('recipeImage'), updateRecipe);
router.delete('/:id', verifyToken, deleteRecipe);
router.put('/:id/like', verifyToken, likeRecipe);
router.put('/:id/unlike', verifyToken, unlikeRecipe);
router.put('/:id/save', verifyToken, saveRecipe);
router.put('/:id/unsave', verifyToken, unsaveRecipe);

// Sort recipes
router.get('/sort', sortRecipes);

export default router;


