import React, { useEffect, useState } from 'react';
import { CiCircleChevDown } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import useRecipe from '../contexts/useRecipeContext';

const RecipeCategories = () => {
  const { categories, getAllRecipes } = useRecipe();
  const navigate = useNavigate();

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Fetch recipes to update category counts
    getAllRecipes();
  }, []);

  const displayLimit = windowWidth < 768 ? 6 : windowWidth < 1024 ? 10 : 8;
  const iconSize = windowWidth < 768 ? 'text-3xl' : 'text-5xl';

  const handleIconClick = () => {
    navigate('/recipes');
  };

  const renderCategories = () => {
    if (!categories || categories.length === 0) {
      return (
        <div className="text-center text-gray-500">
          No categories available
        </div>
      );
    }

    return categories.slice(0, displayLimit).map((category, index) => (
      <Link
        key={index}
        to={`/recipes?category=${category.name}`}
        className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-4">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/images/placeholder-category.jpg";
            }}
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
        <span className="text-sm text-gray-500">{category.count} recipes</span>
      </Link>
    ));
  };

  return (
    <div className="py-2 px-4">     
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4">
        {renderCategories()}
        <div className="col-span-3 md:col-span-5 lg:col-span-1 flex justify-center mt-4 md:mt-6">
          <CiCircleChevDown
            onClick={handleIconClick}
            className={`cursor-pointer text-gray-600 ${iconSize}`}
          />
        </div>
      </div>
    </div>
  );
};

export default RecipeCategories;
