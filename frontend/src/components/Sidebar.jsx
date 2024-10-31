import React from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  BookmarkIcon,
  PlusIcon,
  ChatBubbleLeftIcon,
  BellIcon,
} from "@heroicons/react/24/solid"; // Import ChatIcon for Chat
import { IconButton, Typography } from "@material-tailwind/react";

import useAuth from "../contexts/useAuthContext";
import { AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";

export function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="hidden md:flex flex-col space-y-4 p-4 border-r border-gray-200 w-16 md:w-24 lg:w-48 bg-orange-100">
      <Link to="/" className="flex items-center justify-center mb-4">
        <Typography
          variant="h6"
          color="orange"
          className="text-orange-700 font-bold text-center lg:text-lg"
        >
          {/* Display "Recipe" and "Hub" stacked on tablets and inline on larger screens */}
          <span className="block lg:inline">Recipe</span>
          <span className="block lg:inline">Hub</span>
        </Typography>
      </Link>

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
        <IconButton variant="text" color="orange">
          <ChatBubbleLeftIcon className="h-6 w-6 text-orange-600" />
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

      {user ? (
        <Link to={`/profile/${user.id}`} className="flex items-center space-x-2">
          <IconButton variant="text" color="orange">
            <UserCircleIcon className="h-6 w-6 text-orange-600" />
          </IconButton>
          <Typography className="hidden lg:inline text-sm font-medium text-orange-700">
            Profile
          </Typography>
        </Link>
      ) : (
        <>
        <Link to="/login" className="flex items-center space-x-2">
          <IconButton variant="text" color="orange">
            <AiOutlineLogin className="h-6 w-6 text-orange-600" />
          </IconButton>
          <Typography className="hidden lg:inline text-sm font-medium text-orange-700">
            Login
          </Typography>
        </Link>
        <Link to="/signup" className="flex items-center space-x-2">
        <IconButton variant="text" color="orange">
          <AiOutlineLogout className="h-6 w-6 text-orange-600" />
        </IconButton>
        <Typography className="hidden lg:inline text-sm font-medium text-orange-700">
          SignUp
        </Typography>
      </Link>
        </>
      )}
    </aside>
  );
}

export default Sidebar;
