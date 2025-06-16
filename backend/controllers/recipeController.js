import Recipe from '../models/recipeModel.js';
import User from '../models/userModel.js';
import { deleteImageFromCloudinary, uploadOnCloudinary } from '../utils/cloudinary.js';
import path from 'path';
import fs from 'fs';


export const createRecipe = async (req, res) => {
  let tempFilePath = null;
  try {
    console.log('Create recipe request:', {
      body: req.body,
      file: req.file,
      userId: req.userId
    });

    // Validate request
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Recipe image is required"
      });
    }

    // Save temp file path
    tempFilePath = req.file.path;

    // Upload image with retries
    let recipeImage = null;
    let uploadAttempts = 3;

    while (uploadAttempts > 0) {
      try {
        console.log(`Attempting to upload image (attempt ${4 - uploadAttempts})`);
        const uploadResult = await uploadOnCloudinary(tempFilePath);
        
        if (uploadResult?.secure_url) {
          recipeImage = uploadResult.secure_url;
          console.log('Image uploaded successfully:', recipeImage);
          break;
        }
      } catch (uploadError) {
        console.error(`Upload attempt ${4 - uploadAttempts} failed:`, uploadError);
        if (uploadAttempts === 1) throw uploadError;
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
      }
      uploadAttempts--;
    }

    if (!recipeImage) {
      throw new Error('Failed to upload recipe image after multiple attempts');
    }

    const {
      title,
      description,
      category,
      cookingTime,
      difficulty,
      ingredients,
      instructions,
      tags
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !cookingTime || !difficulty) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // Parse arrays from form data
    const parsedIngredients = Array.isArray(ingredients) 
      ? ingredients 
      : ingredients.split(',').map(item => item.trim());

    const parsedInstructions = Array.isArray(instructions)
      ? instructions
      : instructions.split(',').map(item => item.trim());

    const parsedTags = tags 
      ? Array.isArray(tags) 
        ? tags 
        : tags.split(',').map(item => item.trim())
      : [];

    // Create recipe
    const recipe = await Recipe.create({
      title,
      description,
      category,
      cookingTime,
      difficulty,
      ingredients: parsedIngredients,
      instructions: parsedInstructions,
      tags: parsedTags,
      recipeImage,
      createdBy: req.userId
    });

    await recipe.populate('createdBy', 'name username profileImage');

    res.status(201).json({
      success: true,
      message: "Recipe created successfully",
      recipe
    });

  } catch (error) {
    console.error("Create recipe error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create recipe"
    });
  } finally {
    // Clean up temp file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (err) {
        console.error("Error cleaning up temp file:", err);
      }
    }
  }
};

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
    console.log('Fetching all recipes');
    
    const recipes = await Recipe.find()
      .populate('createdBy', 'username profileImage')
      .sort({ createdAt: -1 });  // Sort by newest first

    console.log(`Found ${recipes.length} recipes`);
    
    res.status(200).json({
      success: true,
      recipes: recipes,
      count: recipes.length
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching recipes', 
      error: error.message 
    });
  }
};

// Get recipes created by a specific user
export const getRecipesByUser = async (req, res) => {
  try {
    const recipes = await Recipe.find({ createdBy: req.params.userId })
      .populate('createdBy', 'username profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      recipes,
      count: recipes.length
    });
  } catch (error) {
    console.error('Error fetching user recipes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching user recipes', 
      error: error.message 
    });
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

export const updateRecipe = async (req, res) => {
  try {
    const { title, description, category, cookingTime, difficulty, ingredients, instructions, tags } = req.body;
    const recipeImage = req.file;
    const recipeId = req.params.id;

    // Ensure the user is authenticated
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized - no user ID found' });
    }

    // Find the user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the recipe
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Ensure the user is the creator of the recipe
    if (recipe.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized - only the creator can update this recipe' });
    }

    // Handle recipe image update
    let recipeImageUrl = recipe.recipeImage;
    if (recipeImage) {
      const { path } = recipeImage;

      // Delete the old recipe image from Cloudinary if it exists
      if (recipe.recipeImage) {
        await deleteImageFromCloudinary(recipe.recipeImage);
      }

      // Upload the new image to Cloudinary
      const cloudinaryResult = await uploadOnCloudinary(path);
      recipeImageUrl = cloudinaryResult.url;
    }

    // Update the recipe fields
    if (title) recipe.title = title;
    if (description) recipe.description = description;
    if (category) recipe.category = category;
    if (cookingTime) recipe.cookingTime = cookingTime;
    if (difficulty) recipe.difficulty = difficulty;
    if (ingredients) recipe.ingredients = ingredients;
    if (instructions) recipe.instructions = instructions;
    if (tags) recipe.tags = tags;
    recipe.recipeImage = recipeImageUrl;

    // Save the updated recipe
    await recipe.save();

    res.status(200).json({ message: 'Recipe updated successfully', recipe });
  } catch (error) {
    console.error('Error updating recipe:', error);
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
    const userId = req.userId; // User ID from authenticated request

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if the user has already liked the recipe
    if (recipe.likes.includes(userId)) {
      return res.status(400).json({ message: 'You have already liked this recipe' });
    }

    // Add user to the likes array
    recipe.likes.push(userId);
    await recipe.save();

    res.status(200).json({ message: 'Recipe liked successfully', likes: recipe.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Error liking recipe', error: error.message });
  }
};


// unlike a recipe
export const unlikeRecipe = async (req, res) => {
  try {
    const userId = req.userId; // User ID from authenticated request

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if the user has liked the recipe
    if (!recipe.likes.includes(userId)) {
      return res.status(400).json({ message: 'You have not liked this recipe' });
    }

    // Remove user from the likes array
    recipe.likes = recipe.likes.filter((like) => like.toString() !== userId);
    await recipe.save();

    res.status(200).json({ message: 'Recipe unliked successfully', likes: recipe.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Error unliking recipe', error: error.message });
  }
};

// Save a recipe
export const saveRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const user = await User.findById(req.userId); // Assuming the user is authenticated

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


export const searchRecipes = async (req, res) => {
  const { query } = req.query; 

  try {
    const recipes = await Recipe.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },  
        { ingredients: { $regex: query, $options: 'i' } }, 
      ]
    }).populate('createdBy', 'username profileImage');

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error searching recipes', error: error.message });
  }
};


export const sortRecipes = async (req, res) => {
  const { field, order } = req.query; 

  try {
    const sortOptions = {};
    if (field && order) {
      sortOptions[field] = order === 'desc' ? -1 : 1; 
    }

    const recipes = await Recipe.find().sort(sortOptions).populate('createdBy', 'username profileImage');

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error sorting recipes', error: error.message });
  }
};

export const filterRecipes = async (req, res) => {
  const { category, difficulty, cookingTime } = req.query;

  const filters = {};

  if (category) filters.category = category;
  if (difficulty) filters.difficulty = difficulty;
  if (cookingTime) filters.cookingTime = { $lte: cookingTime }; 

  try {
    const recipes = await Recipe.find(filters).populate('createdBy', 'username profileImage');

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error filtering recipes', error: error.message });
  }
};

export const getSavedRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate({
        path: 'savedRecipes',
        populate: {
          path: 'createdBy',
          select: 'username profileImage'
        }
      });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.status(200).json({
      success: true,
      savedRecipes: user.savedRecipes || []
    });
  } catch (error) {
    console.error('Error fetching saved recipes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching saved recipes', 
      error: error.message 
    });
  }
};

// Unsave a recipe
export const unsaveRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the recipe from savedRecipes
    user.savedRecipes = user.savedRecipes.filter(
      savedId => savedId.toString() !== recipe._id.toString()
    );
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: 'Recipe removed from saved' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error unsaving recipe', 
      error: error.message 
    });
  }
};


