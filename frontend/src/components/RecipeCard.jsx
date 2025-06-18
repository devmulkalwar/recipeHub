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
import { Link, useNavigate } from "react-router-dom";
import {
  DEFAULT_RECIPE_IMAGE,
  DEFAULT_AVATAR_IMAGE,
} from "../constants/placeholderImages";
import useAuth from "../contexts/useAuthContext";
import useRecipe from "../contexts/useRecipeContext";
import { toast } from "react-toastify";

const RecipeCard = ({ recipe, cardType = "normal", onDelete, onSaveToggle }) => {
  const { user } = useAuth();
  const { likeRecipe, unlikeRecipe, saveRecipe, unsaveRecipe, deleteRecipe } =
    useRecipe();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(recipe?.likes?.length || 0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const isOwner = user && recipe?.createdBy?._id === user.id;

  useEffect(() => {
    if (user && recipe) {
      setIsLiked(recipe.likes?.includes(user.id));
      setIsSaved(user.savedRecipes?.includes(recipe._id));
      setLikesCount(recipe.likes?.length || 0);
    }
  }, [user, recipe]);

  const handleInteraction = async (action, e) => {
    e?.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      switch (action) {
        case "like":
          if (isLiked) {
            await unlikeRecipe(recipe._id);
            setIsLiked(false);
            setLikesCount(prev => prev - 1);
          } else {
            await likeRecipe(recipe._id);
            setIsLiked(true);
            setLikesCount(prev => prev + 1);
          }
          break;
        case "save":
          if (isSaved) {
            await unsaveRecipe(recipe._id);
            setIsSaved(false);
            toast.success("Recipe removed from your saves");
          } else {
            await saveRecipe(recipe._id);
            setIsSaved(true);
            toast.success("Recipe saved to your collection");
          }
          
          if (onSaveToggle) {
            onSaveToggle(recipe._id, !isSaved);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      toast.error(error.message || "Action failed");
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

  // Grid Card for Profile Page (Created/Saved Recipes)
  if (cardType === "grid") {
    return (
      <Link to={`/recipe/${recipe._id}`}>
        <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-200">
          <img
            src={recipe.recipeImage}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
                {recipe.category}
              </span>
              {isOwner && (
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link
                    to={`/edit-recipe/${recipe._id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 bg-white rounded-full shadow hover:bg-gray-50"
                  >
                    <AiOutlineEdit className="w-4 h-4 text-gray-700" />
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowDeleteModal(true);
                    }}
                    className="p-2 bg-white rounded-full shadow hover:bg-gray-50"
                  >
                    <AiOutlineDelete className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              )}
            </div>

            <div className="text-white">
              <h3 className="font-bold text-lg mb-1 line-clamp-2">
                {recipe.title}
              </h3>
              <div className="flex items-center gap-3 text-sm mt-2">
                <span className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-full">
                  <AiOutlineLike className="w-4 h-4" />
                  {recipe.likes?.length || 0}
                </span>
                <span className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-full">
                  <AiOutlineComment className="w-4 h-4" />
                  {recipe.comments?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Delete Recipe?
              </h3>
              <p className="text-gray-600 mb-5">
                This will permanently remove your recipe.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outlined"
                  color="gray"
                  className="rounded-lg"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  color="red"
                  className="rounded-lg"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </Link>
    );
  }

  // Normal Card View (default)
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      {/* Recipe Header - Profile and Date */}
      <div className="p-3 flex justify-between items-center border-b border-gray-100">
        <Link
          to={`/profile/${recipe.createdBy?._id}`}
          className="flex items-center gap-2"
        >
          <img
            src={recipe.createdBy?.profileImage || DEFAULT_AVATAR_IMAGE}
            alt={recipe.createdBy?.username || "User"}
            className="w-9 h-9 rounded-full object-cover border-2 border-white shadow"
            onError={(e) => {
              e.target.src = DEFAULT_AVATAR_IMAGE;
            }}
          />
          <div>
            <Typography
              variant="small"
              className="font-semibold text-gray-800 leading-tight"
            >
              {recipe.createdBy?.username}
            </Typography>
            <Typography
              variant="small"
              className="text-xs text-gray-500 leading-tight"
            >
              {new Date(recipe.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Typography>
          </div>
        </Link>
        
        {isOwner && (
          <div className="flex gap-1">
            <Link
              to={`/edit-recipe/${recipe._id}`}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
              <AiOutlineEdit className="w-4 h-4 text-gray-600" />
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowDeleteModal(true);
              }}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
              <AiOutlineDelete className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}
      </div>

      {/* Recipe Image */}
      <Link to={`/recipe/${recipe._id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={recipe.recipeImage || DEFAULT_RECIPE_IMAGE}
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.src = DEFAULT_RECIPE_IMAGE;
            }}
          />
        </div>
      </Link>

      {/* Recipe Info */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/recipe/${recipe._id}`}>
            <Typography
              variant="h5"
              className="font-bold text-gray-900 hover:text-orange-600 transition-colors line-clamp-1"
            >
              {recipe.title}
            </Typography>
          </Link>
        </div>

        <Typography
          variant="paragraph"
          className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[40px]"
        >
          {recipe.description}
        </Typography>

        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                recipe.difficulty
              )}`}
            >
              {recipe.difficulty}
            </span>
            <span className="flex items-center gap-1 text-gray-600 text-sm">
              <AiFillClockCircle className="text-orange-500" />
              {recipe.cookingTime} min
            </span>
          </div>

          <span className="bg-orange-50 text-orange-700 text-xs font-semibold px-2 py-1 rounded">
            {recipe.category}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="flex gap-4">
            <button
              onClick={(e) => handleInteraction("like", e)}
              className="flex items-center gap-1.5 group"
            >
              {isLiked ? (
                <AiFillLike className="w-5 h-5 text-red-500" />
              ) : (
                <AiOutlineLike className="w-5 h-5 text-gray-500 group-hover:text-red-500" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {likesCount}
              </span>
            </button>
            <Link
              to={`/recipe/${recipe._id}`}
              className="flex items-center gap-1.5 group"
            >
              <AiOutlineComment className="w-5 h-5 text-gray-500 group-hover:text-blue-500" />
              <span className="text-sm font-medium text-gray-700">
                {recipe.comments?.length || 0}
              </span>
            </Link>
          </div>
          <button
            onClick={(e) => handleInteraction("save", e)}
            className="group p-1.5 hover:bg-orange-50 rounded-full transition-colors"
            aria-label={isSaved ? "Unsave recipe" : "Save recipe"}
          >
            {isSaved ? (
              <FilledBookmarkIcon className="w-5 h-5 text-orange-500" />
            ) : (
              <OutlineBookmarkIcon className="w-5 h-5 text-gray-500 group-hover:text-orange-500" />
            )}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Delete Recipe?
            </h3>
            <p className="text-gray-600 mb-5">
              This will permanently remove your recipe.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outlined"
                color="gray"
                className="rounded-lg"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button color="red" className="rounded-lg" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeCard;