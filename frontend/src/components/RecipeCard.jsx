import React from "react";
import { Typography, Button } from "@material-tailwind/react";
import { AiOutlineLike, AiOutlineComment } from "react-icons/ai";
import { BookmarkIcon } from "@heroicons/react/24/solid";

const RecipeCard = ({ recipe }) => {
  const { image, title, cookingTime, difficulty, tags, username, createdAt } = recipe;

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
      <img src={image} alt={title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <Typography variant="h5" className="text-gray-800 mb-2 font-semibold">
          {title}
        </Typography>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Cooking Time: {cookingTime} mins</span>
          <span>Difficulty: {difficulty}</span>
        </div>
        <div className="flex flex-wrap mt-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-orange-100 text-orange-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
        <Button color="orange" className="w-full mb-2">
          View Recipe
        </Button>
      </div>
      <div className="flex justify-between items-center bg-gray-100 p-4">
        <div className="flex items-center">
          <img
            src={`https://api.hello-avatar.com/adorables/50/${username}.png`} // Placeholder for user avatar
            alt={username}
            className="rounded-full w-8 h-8 mr-2"
          />
          <Typography variant="small" className="text-gray-700">
            {username}
          </Typography>
        </div>
        <Typography variant="small" className="text-gray-500">
          {new Date(createdAt).toLocaleDateString()}
        </Typography>
      </div>
      {/* Icons Section for Like, Comment, and Save */}
      <div className="flex justify-around p-4 bg-gray-200">
        <button className="flex flex-col items-center text-gray-600 hover:text-orange-500">
          <AiOutlineLike className="text-lg" />
          <span className="text-xs">Like</span>
        </button>
        <button className="flex flex-col items-center text-gray-600 hover:text-orange-500">
          <AiOutlineComment className="text-lg" />
          <span className="text-xs">Comment</span>
        </button>
        <button className="flex flex-col items-center text-gray-600 hover:text-orange-500">
          <BookmarkIcon className="text-lg" />
          <span className="text-xs">Save</span>
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
