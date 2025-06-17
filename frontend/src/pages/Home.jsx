import React, { useState, useEffect } from "react";
import { Carousel, Typography } from "@material-tailwind/react";
import RecipeCategories from "../components/RecipeCategories";
import RecipeCard from "../components/RecipeCard";
import { Link } from "react-router-dom";
import useRecipe from '../contexts/useRecipeContext';

const Home = () => {
  const { getAllRecipes, loading } = useRecipe();
  const [recipes, setRecipes] = useState([]);
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getAllRecipes();
        setRecipes(data);
        // Get first 3 recipes for carousel
        setFeaturedRecipes(data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="flex-grow flex flex-col items-center bg-gray-50 py-4">
      {/* Carousel Section */}
      <div className="w-full max-w-screen-lg">
        <Carousel className="h-96" autoplay loop>
          {featuredRecipes.map((recipe, index) => (
            <div key={recipe._id} className="relative h-full w-full">
              <img
                src={recipe.recipeImage}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-10 left-10 bg-orange-100 p-4 rounded-lg shadow-lg">
                <Typography variant="h3" className="text-gray-800 text-sm md:text-2xl">
                  {recipe.title}
                </Typography>
                <Link to={`/recipe/${recipe._id}`} className="block w-full text-center text-white hover:text-orange-400">
                  <button className="mt-2 px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors text-xs md:text-sm">
                    View Recipe
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* Categories Section */}
      <section className="w-full max-w-screen-lg py-10 bg-orange-100">
        <div className="flex justify-between items-center px-6">
          <Typography variant="h2" className="text-gray-800 text-lg md:text-2xl">
            Categories
          </Typography>
        </div>
        <RecipeCategories />
      </section>

      {/* All Recipes Section */}
      <section className="w-full max-w-screen-lg my-8">
        <Typography variant="h2" className="text-left text-gray-800 mb-8 text-lg md:text-2xl px-4">
          All Recipes
        </Typography>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="min-w-[320px] max-w-screen-lg flex justify-center items-center w-full py-6 px-4">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Call to Action Section */}
      <section className="w-full max-w-screen-lg bg-gray-200 text-center py-10">
        <Typography variant="h4" className="text-gray-800 mb-4 text-lg md:text-2xl">
          Join Our Recipe Community!
        </Typography>
        <Link to="/signup">
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-xs md:text-sm">
            Sign Up Now
          </button>
        </Link>
      </section>
    </div>
  );
};

export default Home;
        
