import Recipe from '../models/recipeModel.js';
import User from '../models/userModel.js';

// Create a new recipe
export const createRecipe = async (req, res) => {
  try {
    const { title, description, category, cookingTime, difficulty, ingredients, instructions, image, tags } = req.body;
    const newRecipe = new Recipe({
      title,
      description,
      category,
      cookingTime,
      difficulty,
      ingredients,
      instructions,
      image,
      tags,
      createdBy: req.user.id
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(500).json({ message: 'Error creating recipe', error: error.message });
  }
};

// Get a recipe by its ID
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('createdBy', 'username profileImage')
      .populate('comments');

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipe', error: error.message });
  }
};

// Get all recipes
export const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('createdBy', 'username profileImage');
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
};

// Get recipes created by a specific user
export const getRecipesByUser = async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.params.userId }).populate('createdBy', 'username profileImage');
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user recipes', error: error.message });
  }
};

// Get recipes by category
export const getRecipesByCategory = async (req, res) => {
  try {
    const recipes = await Recipe.find({ category: req.params.category }).populate('createdBy', 'username profileImage');
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes by category', error: error.message });
  }
};

// Update a recipe by ID
export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error updating recipe', error: error.message });
  }
};

// Delete a recipe by ID
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recipe', error: error.message });
  }
};

// Like a recipe
export const likeRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    recipe.likes += 1; // Increment the likes count
    await recipe.save();

    res.status(200).json({ message: 'Recipe liked successfully', likes: recipe.likes });
  } catch (error) {
    res.status(500).json({ message: 'Error liking recipe', error: error.message });
  }
};

// Save a recipe
export const saveRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const user = await User.findById(req.user.id); // Assuming the user is authenticated

    // Add the recipe to savedRecipes if not already saved
    if (!user.savedRecipes.includes(recipe._id)) {
      user.savedRecipes.push(recipe._id);
      await user.save();
    }

    res.status(200).json({ message: 'Recipe saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving recipe', error: error.message });
  }
};

// Add a comment to a recipe
export const addCommentToRecipe = async (req, res) => {
  try {
    const { commentText } = req.body;

    if (!commentText) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Add the comment
    recipe.comments.push({ text: commentText, createdBy: req.user.id });
    await recipe.save();

    res.status(200).json({ message: 'Comment added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment to recipe', error: error.message });
  }
};

// Search recipes by name or ingredients
export const searchRecipes = async (req, res) => {
  const { query } = req.query; // Search query string from the request

  try {
    const recipes = await Recipe.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },  // Case-insensitive search by title
        { ingredients: { $regex: query, $options: 'i' } }, // Case-insensitive search by ingredients
      ]
    }).populate('createdBy', 'username profileImage');

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error searching recipes', error: error.message });
  }
};

// Sort recipes by various fields (e.g., date, popularity, cooking time)
export const sortRecipes = async (req, res) => {
  const { field, order } = req.query; // e.g., 'createdAt', 'popularity', etc.

  try {
    const sortOptions = {};
    if (field && order) {
      sortOptions[field] = order === 'desc' ? -1 : 1; // Sorting in descending or ascending order
    }

    const recipes = await Recipe.find().sort(sortOptions).populate('createdBy', 'username profileImage');

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error sorting recipes', error: error.message });
  }
};

// Filter recipes by attributes like difficulty, cooking time, etc.
export const filterRecipes = async (req, res) => {
  const { category, difficulty, cookingTime } = req.query;

  const filters = {};

  if (category) filters.category = category;
  if (difficulty) filters.difficulty = difficulty;
  if (cookingTime) filters.cookingTime = { $lte: cookingTime }; // Assuming 'cookingTime' is in minutes

  try {
    const recipes = await Recipe.find(filters).populate('createdBy', 'username profileImage');

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering recipes', error: error.message });
  }
};
