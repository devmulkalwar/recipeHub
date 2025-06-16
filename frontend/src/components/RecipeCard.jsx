import React, { useEffect, useState } from "react";
import { Typography, Button } from "@material-tailwind/react";
import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineComment,
  AiFillClockCircle,
} from "react-icons/ai";
import { BookmarkIcon as OutlineBookmarkIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as FilledBookmarkIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import {
  DEFAULT_RECIPE_IMAGE,
  DEFAULT_AVATAR_IMAGE,
} from "../constants/placeholderImages";
import useAuth from "../contexts/useAuthContext";
import useRecipe from "../contexts/useRecipeContext";
import { toast } from "react-toastify";
import { FaHeart, FaComment } from "react-icons/fa";

const RecipeCard = ({ recipe, cardType = "normal", onUnsave }) => {
  const { user } = useAuth();
  const { likeRecipe, unlikeRecipe, saveRecipe, unsaveRecipe } = useRecipe();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (user && recipe) {
      // Check if recipe.likes is an array before using includes
      setIsLiked(Array.isArray(recipe.likes) && recipe.likes.includes(user.id));
      setIsSaved(user.savedRecipes?.includes(recipe._id));
    }
  }, [user, recipe]);

  if (!recipe) return null;

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to like recipes");
      return;
    }

    try {
      const response = await (isLiked ? unlikeRecipe(recipe._id) : likeRecipe(recipe._id));
      setIsLiked(!isLiked);
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to save recipes");
      return;
    }

    try {
      if (isSaved) {
        await unsaveRecipe(recipe._id);
        if (onUnsave) onUnsave(); // Call the onUnsave callback if provided
      } else {
        await saveRecipe(recipe._id);
      }
      setIsSaved(!isSaved);
      toast.success(isSaved ? 'Recipe removed from saved' : 'Recipe saved successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDifficultyColor = (level) => {
    switch (level) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Grid Card for Profile Page
  if (cardType === "grid") {
    return (
      <Link to={`/recipe/${recipe._id}`}>
        <div
          className="relative aspect-square bg-gray-100 group cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={recipe.recipeImage || DEFAULT_RECIPE_IMAGE}
            alt={recipe.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = DEFAULT_RECIPE_IMAGE;
            }}
          />
          
          {/* Hover Overlay */}
          <div
            className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200
              ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="flex gap-6 text-white">
              <div className="flex items-center">
                <FaHeart className="w-6 h-6" />
                <span className="ml-2 font-semibold">
                  {recipe.likes?.length || 0}
                </span>
              </div>
              <div className="flex items-center">
                <FaComment className="w-6 h-6" />
                <span className="ml-2 font-semibold">
                  {recipe.comments?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Normal Card View (default)
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden transition-transform hover:scale-105">
      {/* Recipe Header - Profile Picture, Username, and Created Date */}
      <div className="flex justify-between items-center p-4">
        <Link
          to={`/profile/${recipe.createdBy?._id}`}
          className="flex items-center gap-2"
        >
          <img
            src={recipe.createdBy?.profileImage || DEFAULT_AVATAR_IMAGE}
            alt={recipe.createdBy?.username || "User"}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              e.target.src = DEFAULT_AVATAR_IMAGE;
            }}
          />
          <div>
            <h3 className="font-semibold text-gray-800">
              {recipe.createdBy?.username}
            </h3>
            <p className="text-xs text-gray-500">
              {new Date(recipe.createdAt).toLocaleDateString()}
            </p>
          </div>
        </Link>
      </div>

      {/* Recipe Image */}
      <Link to={`/recipe/${recipe._id}`}>
        <div className="relative pt-[75%] overflow-hidden">
          <img
            src={recipe.recipeImage || DEFAULT_RECIPE_IMAGE}
            alt={recipe.title}
            className="absolute top-0 left-0 w-full h-full object-cover"
            onError={(e) => {
              e.target.src = DEFAULT_RECIPE_IMAGE;
            }}
          />
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex gap-4">
          <button onClick={handleLike} className="flex items-center gap-1">
            {isLiked ? (
              <AiFillLike className="w-6 h-6 text-red-500" />
            ) : (
              <AiOutlineLike className="w-6 h-6" />
            )}
            <span>{recipe.likes?.length || 0}</span>
          </button>
          <Link
            to={`/recipe/${recipe._id}`}
            className="flex items-center gap-1"
          >
            <AiOutlineComment className="w-6 h-6" />
            <span>{recipe.comments?.length || 0}</span>
          </Link>
        </div>
        <button onClick={handleSave}>
          {isSaved ? (
            <FilledBookmarkIcon className="w-6 h-6 text-orange-500" />
          ) : (
            <OutlineBookmarkIcon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Recipe Info */}
      <div className="px-4 pb-4">
        <Link to={`/recipe/${recipe._id}`}>
          <h2 className="font-bold text-lg mb-2 hover:text-orange-500">
            {recipe.title}
          </h2>
        </Link>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {recipe.description}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <AiFillClockCircle /> {recipe.cookingTime} min
          </span>
          <span
            className={`px-2 py-1 rounded text-xs ${getDifficultyColor(
              recipe.difficulty
            )}`}
          >
            {recipe.difficulty}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
