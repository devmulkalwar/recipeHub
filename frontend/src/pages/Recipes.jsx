import React, { useState } from "react";
import { FaFilter } from "react-icons/fa"; // Import a filter icon
import fakeData from "../data/generateFakeData";
import RecipeCard from "../components/RecipeCard";

const Recipes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    ingredients: [],
    creators: [],
    popularity: "all",
    cookingTime: "all",
    difficulty: "all",
    categories: "all",
    tags: [],
  });
  
  const [showFilters, setShowFilters] = useState(false); // State to toggle filters
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const recipesPerPage = 8; // Number of recipes per page

  const { recipes } = fakeData;

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const applyFilters = (recipe) => {
    const matchesSearchTerm =
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPopularity =
      filters.popularity === "all" ||
      (filters.popularity === "latest" && new Date(recipe.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) || 
      (filters.popularity === "popular" && recipe.likes > 100); 

    const matchesCookingTime =
      filters.cookingTime === "all" ||
      (filters.cookingTime === "less_30" && recipe.cookingTime === "Less than 30 min") ||
      (filters.cookingTime === "30_60" && recipe.cookingTime === "30-60 min") ||
      (filters.cookingTime === "more_60" && recipe.cookingTime === "More than 60 min");

    const matchesDifficulty =
      filters.difficulty === "all" || recipe.difficulty === filters.difficulty;

    const matchesCategory =
      filters.categories === "all" || recipe.category === filters.categories;

    const matchesIngredients =
      filters.ingredients.length === 0 || filters.ingredients.every(ingredient => recipe.ingredients.includes(ingredient));

    return (
      matchesSearchTerm &&
      matchesPopularity &&
      matchesCookingTime &&
      matchesDifficulty &&
      matchesCategory
    );
  };

  // Get filtered recipes
  const filteredRecipes = recipes.filter(applyFilters);

  // Calculate pagination
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  // Calculate total pages
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-orange-600 mb-4">Explore Recipes</h1>

      <input
        type="text"
        placeholder="Search for recipes..."
        value={searchTerm}
        onChange={handleSearch}
        className="w-full max-w-lg p-2 border border-gray-300 rounded bg-white focus:ring focus:ring-orange-500 mb-4"
      />

      <div className="flex justify-between items-center w-full max-w-5xl mb-4 md:hidden">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center p-2 border border-gray-300 rounded bg-white focus:ring focus:ring-orange-500"
        >
          <FaFilter className="mr-2" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filters Section */}
      <div className={`flex flex-wrap gap-4 mb-4 w-full max-w-5xl ${showFilters ? "block" : "hidden md:flex md:justify-center "}`}>
        {/* Popularity Filter */}
        <select
          onChange={(e) =>
            setFilters({ ...filters, popularity: e.target.value })
          }
          className="p-2 border border-gray-300 rounded bg-white focus:ring focus:ring-orange-500 flex-1 md:flex-none"
        >
          <option value="all">All</option>
          <option value="latest">Latest</option>
          <option value="popular">Popular</option>
        </select>

        {/* Cooking Time Filter */}
        <select
          onChange={(e) =>
            setFilters({ ...filters, cookingTime: e.target.value })
          }
          className="p-2 border border-gray-300 rounded bg-white focus:ring focus:ring-orange-500 flex-1 md:flex-none"
        >
          <option value="all">All Cooking Times</option>
          <option value="less_30">Less than 30 min</option>
          <option value="30_60">30-60 min</option>
          <option value="more_60">More than 60 min</option>
        </select>

        {/* Difficulty Filter */}
        <select
          onChange={(e) =>
            setFilters({ ...filters, difficulty: e.target.value })
          }
          className="p-2 border border-gray-300 rounded bg-white focus:ring focus:ring-orange-500 flex-1 md:flex-none"
        >
          <option value="all">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {/* Categories Filter */}
        <select
          onChange={(e) =>
            setFilters({ ...filters, categories: e.target.value })
          }
          className="p-2 border border-gray-300 rounded bg-white focus:ring focus:ring-orange-500 flex-1 md:flex-none"
        >
          <option value="all">All Categories</option>
          <option value="Appetizer">Appetizers</option>
          <option value="Main Course">Main Course</option>
          <option value="Dessert">Desserts</option>
          <option value="Snack">Snacks</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-5xl">
        {currentRecipes.map((recipe, index) => (
          <RecipeCard key={index} recipe={recipe} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-gray-300 rounded bg-white focus:ring focus:ring-orange-500 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="mx-4">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border border-gray-300 rounded bg-white focus:ring focus:ring-orange-500 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Recipes;
