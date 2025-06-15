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

const RecipeCard = ({ recipe }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  if (!recipe) {
    return null;
  }

  const {
    _id,
    title,
    description,
    cookingTime,
    difficulty,
    likes = [],
    comments = [],
    recipeImage,
    tags = [],
    createdAt,
    createdBy,
  } = recipe;

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

  useEffect(() => {
    console.log(recipe);
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 w-full max-w-sm mx-auto flex flex-col h-full">
      {/* Recipe Header - Profile Picture, Username, and Created Date */}
      <div className="flex justify-between items-center p-4 gap-3">
        {/* Profile Section */}
        <div className="flex items-center gap-2">
          <img
            src={createdBy?.profileImage || "/placeholder-avatar.png"}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              e.target.src = "/placeholder-avatar.png";
            }}
          />
          <div className="flex flex-col">
            <Link to={`/profile/${createdBy?._id}`}>
              <Typography
                variant="h6"
                className="text-gray-800 font-semibold hover:underline"
              >
                {createdBy?.username || "Anonymous"}
              </Typography>
            </Link>
            <Typography variant="small" className="text-gray-500 text-xs">
              {formatDate(createdAt)}
            </Typography>
          </div>
        </div>

        {/* Follow Button */}
        <button
          className="text-blue-500 text-sm font-semibold hover:underline"
          onClick={() => setIsFollowing(!isFollowing)}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
      </div>

      {/* Recipe Image */}
      <Link to={`/recipe/${_id}`}>
        <div className="relative pt-[75%] overflow-hidden">
          <img
            src={recipeImage || "/placeholder-recipe.jpg"}
            alt={title}
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            onError={(e) => {
              e.target.src = "/placeholder-recipe.jpg";
            }}
          />
        </div>
      </Link>

      {/* Recipe Details */}
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/recipe/${_id}`}>
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 hover:text-orange-600 transition-colors">
            {title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

        {/* Cooking Time and Difficulty */}
        <div className="flex justify-between items-center text-gray-600 mb-4">
          <div className="flex items-center">
            <AiFillClockCircle className="mr-1" />
            <span>{cookingTime} min</span>
          </div>
          <span
            className={`px-2 py-1 rounded-md text-xs ${getDifficultyColor(
              difficulty
            )}`}
          >
            {difficulty}
          </span>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-auto">
          <Button
            variant="text"
            className="flex items-center gap-2"
            onClick={() => setIsLiked(!isLiked)}
          >
            {isLiked ? (
              <AiFillLike className="text-orange-500" />
            ) : (
              <AiOutlineLike className="h-5 w-5 mr-1" />
            )}
            <span>{likes.length}</span>
          </Button>

          <Button
            variant="text"
            className="flex items-center gap-2"
          >
            <AiOutlineComment className="h-5 w-5 mr-1" />
            <span>{comments.length}</span>
          </Button>

          <Button
            variant="text"
            className="flex items-center gap-2"
            onClick={() => setIsSaved(!isSaved)}
          >
            {isSaved ? (
              <FilledBookmarkIcon className="h-5 w-5 text-orange-500" />
            ) : (
              <OutlineBookmarkIcon className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
      