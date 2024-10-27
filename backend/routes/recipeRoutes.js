import express from 'express';
import { createRecipe } from '../controllers/recipeController.js';

const router = express.Router();

router.post('/create', createRecipe);

export default router;
