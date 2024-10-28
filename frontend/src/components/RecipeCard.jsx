import React from "react";
import { Typography, Button } from "@material-tailwind/react";
import { AiOutlineLike, AiOutlineComment, AiFillClockCircle } from "react-icons/ai";
import { BookmarkIcon } from "@heroicons/react/24/solid";
import { Avatar } from "@material-tailwind/react"; // Import Avatar from Material Tailwind

const RecipeCard = ({ recipe }) => {
  const { image, title, cookingTime, difficulty, tags, username, createdAt } =
    recipe;

  // Function to determine the badge color based on difficulty
  const getDifficultyColor = (level) => {
    switch (level) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800"; // Default color
    }
  };

  return (
    <div className="bg-white  self-center shadow-lg rounded-lg transition-transform transform hover:scale-105 max-w-xs mx-auto"> 
      {/* User Profile Header */}
      <div className="flex justify-between p-4 border-b border-gray-300">
        <div className="flex items-center">
          <Avatar
            src={`https://api.hello-avatar.com/adorables/50/${username}.png`} // Using Avatar with user's placeholder image
            alt={username}
            className="mr-3"
          />
          <Typography variant="h6" className="text-gray-800 font-semibold text-sm md:text-base">
            {username}
          </Typography>
        </div>

        {/* Date Created Section */}
        <div className="flex flex-col p-4 text-gray-500 text-xs md:text-sm">
          <span>Posted on</span>
          <span>{new Date(createdAt).toLocaleDateString()}</span>
          {/* Displaying formatted date */}
        </div>
      </div>

      {/* Recipe Image */}
      <img src={image} alt={title} className="w-full h-48 md:h-60 object-cover" />

      <div className="p-4">
        <Typography variant="h5" className="text-gray-800 mb-2 font-semibold text-sm md:text-lg">
          {title}
        </Typography>
        <div className="flex justify-between text-xs md:text-sm text-gray-600 mb-2">
          <span className="flex items-center">
            <AiFillClockCircle className="mr-1" /> {cookingTime} mins
          </span>
          {/* Difficulty Badge */}
          <span className={`px-2 py-1 rounded ${getDifficultyColor(difficulty)}`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}{" "}
            {/* Capitalize the first letter */}
          </span>
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
        <Button color="orange" className="w-auto mb-2 px-3 py-1 text-xs md:text-sm">
          View Recipe
        </Button>
      </div>

      {/* Icons Section for Like, Comment, and Save */}
      <div className="flex justify-around items-center p-4 bg-gray-200">
        <button className="flex flex-col items-center text-gray-600 hover:text-orange-500 transition">
          <AiOutlineLike className="text-lg" />
          <span className="text-xs">10k</span> 
          {/* Added label for better visibility */}
        </button>
        <button className="flex flex-col items-center text-gray-600 hover:text-orange-500 transition">
          <AiOutlineComment className="text-lg" />
          <span className="text-xs">10k</span> 
          {/* Added label for better visibility */}
        </button>
        <button className="flex flex-col items-center text-gray-600 hover:text-orange-500 transition">
          <BookmarkIcon className="text-lg" />
          <span className="text-xs">Saved</span> 
          {/* Added label for better visibility */}
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
