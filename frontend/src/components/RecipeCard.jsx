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
    return <div>No recipe available</div>;
  }

  const {
    id,
    title = "Untitled Recipe",
    cookingTime = "N/A",
    difficulty = "Unknown",
    likes = 0,
    comments = [],
    image,
    tags = [],
    createdAt = "Unknown",
    createdBy,
    createdByDetails = {
      username: "Anonymous",
      profileImage: "default-profile.jpg",
    },
  } = recipe;

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
            src={createdByDetails.profileImage}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <Link to={`/profile/${createdBy}`}>
              <Typography
                variant="h6"
                className="text-gray-800 font-semibold hover:underline"
              >
                {createdByDetails.username}
              </Typography>
            </Link>
            <Typography variant="small" className="text-gray-500 text-xs">
              {createdAt
                ? new Date(createdAt).toLocaleDateString()
                : "Date not available"}
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
      <img
        src={image || "fallback-image-url.jpg"}
        alt={title}
        className="w-full h-48 object-cover"
      />

      {/* Recipe Details */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center gap-2 h-12">
          <Typography
            variant="h5"
            className="text-gray-800 font-bold mb-2 line-clamp-2"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              WebkitLineClamp: 2,
              maxHeight: "3rem",
            }}
          >
            {title}
          </Typography>
        </div>
      </div>

      {/* Action Buttons and View Details Button */}
      <div className="px-4 pb-4 flex gap-2 flex-col mt-auto">
        {/* Cooking Time and Difficulty Badge */}
        <div className="flex justify-between items-center text-gray-600 mt-2">
          <div className="flex justify-center items-center">
            <AiFillClockCircle className="mr-1" />
            <span>{cookingTime}</span>
          </div>

          {/* Difficulty Badge */}
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
          <div className="flex flex-wrap items-center mt-2 max-h-10 overflow-hidden">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="m-1.5 bg-orange-200 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-gray-600 text-xs font-semibold p-1">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex justify-evenly items-center mt-auto space-x-2">
          <Button
            variant="outlined"
            className="flex items-center justify-center text-gray-700 border-gray-300 hover:bg-gray-200 w-1/3 h-10"
            onClick={() => setIsLiked(!isLiked)}
          >
            {isLiked ? (
              <AiFillLike className="h-5 w-5 mr-1 text-orange-500" />
            ) : (
              <AiOutlineLike className="h-5 w-5 mr-1" />
            )}
            {likes + (isLiked ? 1 : 0)}
          </Button>

          <Button
            variant="outlined"
            className="flex items-center justify-center text-gray-700 border-gray-300 hover:bg-gray-200 w-1/3 h-10"
          >
            <AiOutlineComment className="h-5 w-5 mr-1" />
            {comments.length}
          </Button>

          <Button
            variant="outlined"
            className="flex items-center justify-center text-gray-700 border-gray-300 hover:bg-gray-200 w-1/3 h-10"
            onClick={() => setIsSaved(!isSaved)}
          >
            {isSaved ? (
              <FilledBookmarkIcon className="w-5 h-5 mr-1 text-orange-500" />
            ) : (
              <OutlineBookmarkIcon className="w-5 h-5 mr-1" />
            )}
          </Button>
        </div>

        {/* View Details Button */}
        <Link to={`/recipe-details/${id}`} className="max-w-full mt-2">
          <Button
            variant="filled"
            className="w-full text-white bg-orange-500 hover:bg-orange-600"
          >
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard;
