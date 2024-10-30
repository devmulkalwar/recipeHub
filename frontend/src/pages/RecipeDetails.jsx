import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import fakeData from '../data/generateFakeData'; // Adjust the import to your fake data file path

const RecipeDetails = () => {
  const { id } = useParams(); // Get the recipe ID from the URL parameters
  const [recipe, setRecipe] = useState(null); // State to store the recipe data
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    const fetchRecipeDetails = () => {
      const foundRecipe = fakeData.recipes.find(recipe => recipe.id === id); // Adjust the property to match your data structure
      if (foundRecipe) {
        setRecipe(foundRecipe);
      } else {
        console.error("Recipe not found");
      }
      setLoading(false);
    };

    fetchRecipeDetails();
  }, [id]); 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!recipe) {
    return <div>No recipe found.</div>; 
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow-md mt-8">
      <h1 className="text-4xl font-bold text-orange-600 mb-2">{recipe.title}</h1>
      <img
        src={recipe.image} // Recipe image URL
        alt={recipe.title}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <h2 className="text-2xl text-gray-800 mb-2">Description</h2>
      <p className="text-gray-700 mb-4">{recipe.description}</p>
      
      <div className="flex items-center mb-4">
        <img
          src={recipe.createdByDetails.profileImage}
          alt={recipe.createdByDetails.username}
          className="w-10 h-10 rounded-full mr-2"
        />
        <span className="text-gray-800 font-semibold">{recipe.createdByDetails.username}</span>
      </div>

      <div className="flex mb-4">
        <span className="text-gray-500">Category: {recipe.category}</span>
        <span className="ml-4 text-gray-500">Cooking Time: {recipe.cookingTime}</span>
        <span className="ml-4 text-gray-500">Difficulty: {recipe.difficulty}</span>
        <span className="ml-4 text-gray-500">Likes: {recipe.likes}</span>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">Ingredients</h2>
      <ul className="list-disc list-inside mb-4">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index} className="text-gray-700">{ingredient}</li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">Instructions</h2>
      <ol className="list-decimal list-inside mb-4">
        {recipe.instructions.map((step, index) => (
          <li key={index} className="text-gray-700">{step}</li>
        ))}
      </ol>

      {/* Optional Tags Section */}
      {recipe.tags && recipe.tags.length > 0 && (
        <div className="flex flex-wrap mt-4">
          {recipe.tags.map((tag, index) => (
            <span key={index} className="bg-orange-200 text-orange-600 px-2 py-1 rounded-full text-sm mr-2 mb-2">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Optional Comments Section */}
      {recipe.comments && recipe.comments.length > 0 && (
        <div className="mt-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Comments</h2>
          <ul className="list-disc list-inside">
            {recipe.comments.map((comment, index) => (
              <li key={index} className="text-gray-700">{comment}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;
