import React, { createContext, useState } from 'react';
import axios from 'axios';

export const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createRecipe = async (recipeData) => {
    try {
      setLoading(true);
      setError(null);

      // Log form data for debugging
      console.log('Creating recipe with data:');
      for (let [key, value] of recipeData.entries()) {
        console.log(`${key}:`, value);
      }

      const config = {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          const percentCompleted = Math.round((event.loaded * 100) / event.total);
          console.log('Upload progress:', percentCompleted);
        },
        timeout: 120000 // Increase timeout to 2 minutes
      };

      const response = await axios.post('/api/recipes/create-recipe', recipeData, config);
      console.log('Recipe creation response:', response.data);

      if (response.data.success) {
        setRecipes(prev => [...prev, response.data.recipe]);
        return response.data.recipe;
      }

      throw new Error(response.data.message || 'Failed to create recipe');
    } catch (error) {
      console.error('Recipe creation error details:', error.response?.data || error);
      if (error.response?.status === 403 && error.response?.data?.redirect) {
        window.location.href = error.response.data.redirect;
        throw new Error('Please complete your profile first');
      }
      throw new Error(error.response?.data?.message || 'Failed to create recipe');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    recipes,
    loading,
    error,
    createRecipe
  };

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
};

export default RecipeProvider;
