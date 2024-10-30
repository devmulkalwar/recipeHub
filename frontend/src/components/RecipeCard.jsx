// RecipeCard Component
import React from "react";
import { Typography, Button } from "@material-tailwind/react";
import {
  AiOutlineLike,
  AiOutlineComment,
  AiFillClockCircle,
} from "react-icons/ai";
import { BookmarkIcon } from "@heroicons/react/24/solid";

const RecipeCard = ({ recipe }) => {
  if (!recipe) {
    return <div>No recipe available</div>;
  }

  const {
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
        <div className="flex justify-between items-center gap-2">
          <Typography
            variant="h5"
            className="text-gray-800 font-bold mb-2 line-clamp-2" // Add line-clamp class
            style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', WebkitLineClamp: 2 }}
          >
            {title}
          </Typography>
        </div>

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
          <div className="flex flex-wrap mt-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="m-1.5 bg-orange-200 text-orange-800 text-xs font-semibold px-2.5 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons and View Details Button */}
      <div className="px-4 pb-4 flex flex-col mt-auto">
        {/* Action Buttons */}
        <div className="flex justify-between items-center">
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
        <Button
          variant="filled"
          className="max-w-full mt-2 text-white bg-orange-500 hover:bg-orange-600"
        >
          View Details
        </Button>
      </div>
    </div>
  );
};

export default RecipeCard;
