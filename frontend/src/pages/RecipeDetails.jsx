import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useRecipe from '../contexts/useRecipeContext';
import useAuth from '../contexts/useAuthContext';
import { toast } from 'react-toastify';
import { AiOutlineLike, AiFillLike, AiOutlineComment, AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { BookmarkIcon as OutlineBookmarkIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as FilledBookmarkIcon } from "@heroicons/react/24/solid";
import { DEFAULT_RECIPE_IMAGE } from '../constants/placeholderImages';

const RecipeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    getRecipeById, 
    likeRecipe, 
    unlikeRecipe, 
    saveRecipe, 
    unsaveRecipe, 
    deleteRecipe,
    loading,
  } = useRecipe();
  const [recipe, setRecipe] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeById(id);
        setRecipe(data);
        setLikesCount(data.likes?.length || 0);
        
        if (user) {
          setIsLiked(data.likes?.includes(user.id));
          setIsSaved(user.savedRecipes?.includes(data._id));
        }
      } catch (error) {
        toast.error('Failed to fetch recipe details');
        navigate('/recipes');
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id, user]);

  const handleInteraction = async (action) => {
    if (!user) {
      toast.error('Please login to interact with recipes');
      return;
    }

    try {
      let response;
      switch (action) {
        case 'like':
          response = await (isLiked ? unlikeRecipe : likeRecipe)(id);
          setIsLiked(!isLiked);
          setRecipe(prev => ({
            ...prev,
            likes: isLiked
              ? prev.likes.filter(likeId => likeId !== user.id)
              : [...prev.likes, user.id]
          }));
          break;
        case 'save':
          response = await (isSaved ? unsaveRecipe : saveRecipe)(id);
          setIsSaved(!isSaved);
          break;
        default:
          break;
      }
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = () => {
    navigate(`/edit-recipe/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    try {
      const response = await deleteRecipe(id);
      if (response.success) {
        toast.success('Recipe deleted successfully');
        navigate('/recipes');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Failed to delete recipe');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recipe not found</h2>
        <Link to="/recipes" className="text-orange-600 hover:text-orange-700">
          Browse other recipes
        </Link>
      </div>
    );
  }

  const isOwner = user && recipe.createdBy._id === user.id;

  return (
    <>
      <div className="max-w-4xl mx-auto p-4">
        {/* Recipe Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{recipe.title}</h1>
              {isOwner && (
                <div className="flex gap-2">
                  <button 
                    onClick={handleEdit}
                    className="p-2 text-gray-600 hover:text-orange-500"
                  >
                    <AiOutlineEdit size={24} />
                  </button>
                  <button 
                    onClick={() => setShowDeleteModal(true)}
                    className="p-2 text-gray-600 hover:text-red-500"
                  >
                    <AiOutlineDelete size={24} />
                  </button>
                </div>
              )}
            </div>

            {/* Author Info */}
            <div className="flex items-center gap-4 mb-6">
              <Link to={`/profile/${recipe.createdBy._id}`} className="flex items-center gap-2">
                <img
                  src={recipe.createdBy.profileImage}
                  alt={recipe.createdBy.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="text-gray-700 font-medium">{recipe.createdBy.username}</span>
              </Link>
              <span className="text-gray-500">•</span>
              <span className="text-gray-500">
                {new Date(recipe.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Recipe Image */}
            <div className="aspect-video mb-6">
              <img
                src={recipe.recipeImage || DEFAULT_RECIPE_IMAGE}
                alt={recipe.title}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = DEFAULT_RECIPE_IMAGE;
                }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => handleInteraction('like')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                {isLiked ? <AiFillLike className="text-red-500" /> : <AiOutlineLike />}
                <span>{recipe.likes?.length || 0}</span>
              </button>
              
              <button
                onClick={() => handleInteraction('save')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                {isSaved ? (
                  <FilledBookmarkIcon className="h-5 w-5 text-orange-500" />
                ) : (
                  <OutlineBookmarkIcon className="h-5 w-5" />
                )}
                <span>Save</span>
              </button>
            </div>

            {/* Recipe Info */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <InfoCard title="Cooking Time" value={`${recipe.cookingTime} min`} />
              <InfoCard title="Difficulty" value={recipe.difficulty} />
              <InfoCard title="Category" value={recipe.category} />
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">{recipe.description}</p>
            </div>

            {/* Ingredients */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
              <ul className="list-disc list-inside space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-700">{ingredient}</li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Instructions</h2>
              <ol className="list-decimal list-inside space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="text-gray-700">{instruction}</li>
                ))}
              </ol>
            </div>

            {/* Tags */}
            {recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {recipe.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Delete Recipe?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this recipe? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const InfoCard = ({ title, value }) => (
  <div className="bg-orange-50 p-4 rounded-lg text-center">
    <p className="text-gray-600 text-sm">{title}</p>
    <p className="font-semibold text-gray-900">{value}</p>
  </div>
);

export default RecipeDetails;
