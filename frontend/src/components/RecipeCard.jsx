// RecipeCard Component
import React from "react";
import { Typography, Button } from "@material-tailwind/react";
import {
  AiOutlineLike,
  AiOutlineComment,
  AiFillClockCircle,
} from "react-icons/ai";
import { BookmarkIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

const RecipeCard = ({ recipe }) => {
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

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105 w-full max-w-sm mx-auto flex flex-col h-full">
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
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              WebkitLineClamp: 2,
              maxHeight: '3rem', // Ensures consistent height
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
            className={`px-2 py-1 rounded-md text-xs ${getDifficultyColor(difficulty)}`}
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
              <span className=" text-gray-600 text-xs font-semibold p-1">+{tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-center">
            <Button
              variant="outlined"
              className="flex items-center justify-center text-gray-700 border-gray-300 hover:bg-gray-200 mr-2"
            >
              <AiOutlineLike className="mr-1" />
              {likes}
            </Button>

            <Button
              variant="outlined"
              className="flex items-center justify-center text-gray-700 border-gray-300 hover:bg-gray-200 mr-2"
            >
              <AiOutlineComment className="mr-1" />
              {comments.length}
            </Button>
          </div>

          {/* Save Recipe Button */}
          <Button
            variant="outlined"
            className="flex items-center justify-center text-gray-700 border-gray-300 hover:bg-gray-200"
          >
            <BookmarkIcon className="w-5 h-5 mr-1" />
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
