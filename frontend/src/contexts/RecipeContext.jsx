import React, { createContext, useState } from 'react';
import axios from 'axios';

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.withCredentials = true;

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

  const getAllRecipes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/recipes/get-recipes', {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        return response.data.recipes;
      }
      throw new Error(response.data.message || 'Failed to fetch recipes');
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError(error.response?.data?.message || 'Failed to fetch recipes');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const searchRecipes = async (query) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/recipes/search?query=${query}`);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Search failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const filterRecipes = async (filters) => {
    try {
      setLoading(true);
      const queryString = new URLSearchParams(filters).toString();
      const response = await axios.get(`/api/recipes/filter?${queryString}`);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Filter failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const likeRecipe = async (recipeId) => {
    try {
      const response = await axios.put(`/api/recipes/${recipeId}/like`, null, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to like recipe');
    }
  };

  const unlikeRecipe = async (recipeId) => {
    try {
      const response = await axios.put(`/api/recipes/${recipeId}/unlike`, null, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to unlike recipe');
    }
  };

  const saveRecipe = async (recipeId) => {
    try {
      const response = await axios.put(`/api/recipes/${recipeId}/save`, null, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to save recipe');
    }
  };

  const value = {
    recipes,
    loading,
    error,
    createRecipe,
    getAllRecipes,
    searchRecipes,
    filterRecipes,
    likeRecipe,
    unlikeRecipe,
    saveRecipe
  };

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>;
};

export default RecipeProvider;
