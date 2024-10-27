import Recipe from '../models/recipeModel.js';

// Example function to create a new recipe
export const createRecipe = async (req, res) => {
    try {
        const newRecipe = new Recipe(req.body);
        await newRecipe.save();
        res.status(201).json({ message: 'Recipe created successfully', recipe: newRecipe });
    } catch (error) {
        res.status(400).json({ message: 'Error creating recipe', error });
    }
};
