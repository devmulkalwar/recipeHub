import React, { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";
import RecipeCard from "../components/RecipeCard";
import useRecipe from '../contexts/useRecipeContext';

const Recipes = () => {
  const { getAllRecipes, searchRecipes, filterRecipes, loading } = useRecipe();
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    difficulty: "all",
    cookingTime: "all",
  });

  const recipesPerPage = 12;

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const data = await getAllRecipes();
      setRecipes(data);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);

    try {
      if (value.trim()) {
        const results = await searchRecipes(value);
        setRecipes(results);
      } else {
        fetchRecipes();
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleFilterChange = async (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    setCurrentPage(1);

    try {
      const activeFilters = Object.fromEntries(
        Object.entries(newFilters).filter(([_, v]) => v !== 'all')
      );
      
      if (Object.keys(activeFilters).length > 0) {
        const results = await filterRecipes(activeFilters);
        setRecipes(results);
      } else {
        fetchRecipes();
      }
    } catch (error) {
      console.error('Filter error:', error);
    }
  };

  // Calculate pagination
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
  const totalPages = Math.ceil(recipes.length / recipesPerPage);

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
          name="popularity"
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded bg-white focus:ring focus:ring-orange-500 flex-1 md:flex-none"
        >
          <option value="all">All</option>
          <option value="latest">Latest</option>
          <option value="popular">Popular</option>
        </select>

        {/* Cooking Time Filter */}
        <select
          name="cookingTime"
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded bg-white focus:ring focus:ring-orange-500 flex-1 md:flex-none"
        >
          <option value="all">All Cooking Times</option>
          <option value="less_30">Less than 30 min</option>
          <option value="30_60">30-60 min</option>
          <option value="more_60">More than 60 min</option>
        </select>

        {/* Difficulty Filter */}
        <select
          name="difficulty"
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded bg-white focus:ring focus:ring-orange-500 flex-1 md:flex-none"
        >
          <option value="all">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {/* Categories Filter */}
        <select
          name="category"
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded bg-white focus:ring focus:ring-orange-500 flex-1 md:flex-none"
        >
          <option value="all">All Categories</option>
          <option value="Appetizer">Appetizers</option>
          <option value="Main Course">Main Course</option>
          <option value="Dessert">Desserts</option>
          <option value="Snack">Snacks</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          currentRecipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))
        )}
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
