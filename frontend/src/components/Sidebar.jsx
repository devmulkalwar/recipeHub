import React from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  BookmarkIcon,
  FireIcon,
  PlusIcon,
  ChatBubbleLeftIcon,
  BellIcon,
} from "@heroicons/react/24/solid"; // Import ChatIcon for Chat
import { IconButton, Typography } from "@material-tailwind/react";

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col space-y-4 p-4 border-r border-gray-200 w-16 md:w-24 lg:w-48 bg-orange-100">
      <Typography
        variant="h6"
        color="orange"
        className="mb-4 font-bold text-center text-orange-700 lg:text-lg"
      >
        RecipeHub
      </Typography>

      <Link to="/" className="flex items-center space-x-2">
        <IconButton variant="text" color="orange">
          <HomeIcon className="h-6 w-6 text-orange-600" />
        </IconButton>
        <Typography className="hidden lg:inline text-sm font-medium text-orange-700">
          Home
        </Typography>
      </Link>

      <Link to="/recipes" className="flex items-center space-x-2">
        <IconButton variant="text" color="orange">
          <MagnifyingGlassIcon className="h-6 w-6 text-orange-600" />
        </IconButton>
        <Typography className="hidden lg:inline text-sm font-medium text-orange-700">
          Search
        </Typography>
      </Link>

      <Link to="/create-recipe" className="flex items-center space-x-2">
        <IconButton variant="text" color="orange">
          <PlusIcon className="h-6 w-6 text-orange-600" />
        </IconButton>
        <Typography className="hidden lg:inline text-sm font-medium text-orange-700">
          Create Recipe
        </Typography>
      </Link>

      <Link to="/chat" className="flex items-center space-x-2">
        {" "}
        {/* Updated Link for Chat */}
        <IconButton variant="text" color="orange">
          <ChatBubbleLeftIcon className="h-6 w-6 text-orange-600" />{" "}
          {/* Use ChatIcon for Chat */}
        </IconButton>
        <Typography className="hidden lg:inline text-sm font-medium text-orange-700">
          Chat
        </Typography>
      </Link>
      <Link to="/profile" className="flex items-center space-x-2">
        <IconButton variant="text" color="orange">
          <BellIcon className="h-6 w-6 text-orange-600" />
        </IconButton>
        <Typography className="hidden lg:inline text-sm font-medium text-orange-700">
          Notifications
        </Typography>
      </Link>
      <Link to="/profile" className="flex items-center space-x-2">
        <IconButton variant="text" color="orange">
          <UserCircleIcon className="h-6 w-6 text-orange-600" />
        </IconButton>
        <Typography className="hidden lg:inline text-sm font-medium text-orange-700">
          Profile
        </Typography>
      </Link>
    </aside>
  );
}

export default Sidebar;
