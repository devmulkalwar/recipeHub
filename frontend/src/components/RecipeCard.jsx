import React, { useEffect, useState } from "react";
import { Typography, Button } from "@material-tailwind/react";
import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineComment,
  AiFillClockCircle,
  AiOutlineDelete,
  AiOutlineEdit,
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

const RecipeCard = ({ recipe, cardType = "normal", onDelete }) => {
  const { user } = useAuth();
  const { likeRecipe, unlikeRecipe, saveRecipe, unsaveRecipe, deleteRecipe } =
    useRecipe();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(recipe?.likes?.length || 0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Add isOwner check
  const isOwner = user && recipe?.createdBy?._id === user.id;

  useEffect(() => {
    if (user && recipe) {
      setIsLiked(recipe.likes?.includes(user.id));
      setIsSaved(user.savedRecipes?.includes(recipe._id));
      setLikesCount(recipe.likes?.length || 0);
    }
  }, [user, recipe]);

  const handleInteraction = async (action, e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to interact with recipes");
      return;
    }

    try {
      let response;
      switch (action) {
        case "like":
          response = await (isLiked ? unlikeRecipe : likeRecipe)(recipe._id);
          setIsLiked(!isLiked);
          setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
          break;
        case "save":
          response = await (isSaved ? unsaveRecipe : saveRecipe)(recipe._id);
          setIsSaved(!isSaved);
          if (onUnsave && isSaved) {
            onUnsave(recipe._id);
          }
          break;
      }
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await deleteRecipe(recipe._id);
      toast.success("Recipe deleted successfully");
      if (onDelete) onDelete(recipe._id);
    } catch (error) {
      toast.error(error.message || "Failed to delete recipe");
    }
    setShowDeleteModal(false);
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
              ${isHovered ? "opacity-100" : "opacity-0"}`}
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
          <button
            onClick={(e) => handleInteraction("like", e)}
            className="flex items-center gap-1"
          >
            {isLiked ? (
              <AiFillLike className="w-6 h-6 text-red-500" />
            ) : (
              <AiOutlineLike className="w-6 h-6" />
            )}
            <span>{likesCount}</span>
          </button>
          <Link
            to={`/recipe/${recipe._id}`}
            className="flex items-center gap-1"
          >
            <AiOutlineComment className="w-6 h-6" />
            <span>{recipe.comments?.length || 0}</span>
          </Link>
        </div>
        <button onClick={(e) => handleInteraction("save", e)}>
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

      {/* Update delete button to show modal */}
      {isOwner && (
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          <Link
            to={`/edit-recipe/${recipe._id}`}
            className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
          >
            <AiOutlineEdit className="w-5 h-5 text-gray-600" />
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowDeleteModal(true);
            }}
            className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
          >
            <AiOutlineDelete className="w-5 h-5 text-red-500" />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-xl font-semibold mb-4">Delete Recipe?</h3>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeCard;
