import React from "react";
import { Link } from "react-router-dom";
import { HomeIcon,PhoneIcon, MagnifyingGlassIcon, UserCircleIcon, PlusIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/solid";
import { IconButton, Typography } from "@material-tailwind/react";
import useAuth from "../contexts/useAuthContext";
import { AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";

const Bottombar = () => {
  const { user } = useAuth();
  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-orange-100 border-t border-orange-200 py-2 flex justify-around items-center md:hidden">
      <Link to="/" className="flex flex-col items-center">
        <IconButton variant="text" color="orange">
          <HomeIcon className="h-6 w-6 text-orange-600" />
        </IconButton>
        <Typography variant="small" className="text-xs text-orange-700">Home</Typography>
      </Link>

      <Link to="/recipes" className="flex flex-col items-center">
        <IconButton variant="text" color="orange">
          <MagnifyingGlassIcon className="h-6 w-6 text-orange-600" />
        </IconButton>
        <Typography variant="small" className="text-xs text-orange-700">Search</Typography>
      </Link>

      <Link to="/create-recipe" className="flex flex-col items-center">
        <IconButton variant="text" color="orange">
          <PlusIcon className="h-6 w-6 text-orange-600" />
        </IconButton>
        <Typography variant="small" className="text-xs text-orange-700">Create Recipe</Typography>
      </Link>

      <Link to="/contact" className="flex flex-col items-center">
        <IconButton variant="text" color="orange">
          <PhoneIcon className="h-6 w-6 text-orange-600" />
        </IconButton>
        <Typography variant="small" className="text-xs text-orange-700">Contact</Typography>
      </Link>

      {user  ? (
        <Link to={`/profile/${user.id}`} className="flex flex-col items-center">
          <IconButton variant="text" color="orange">
            <UserCircleIcon className="h-6 w-6 text-orange-600" />
          </IconButton>
          <Typography variant="small" className="text-xs text-orange-700">
            Profile
          </Typography>
        </Link>
      ) : (
        <>
          <Link to="/login" className="flex flex-col items-center">
            <IconButton variant="text" color="orange">
              <AiOutlineLogin className="h-6 w-6 text-orange-600" />
            </IconButton>
            <Typography variant="small" className="text-xs text-orange-700">
              Login
            </Typography>
          </Link>

          <Link to="/signup" className="flex flex-col items-center">
            <IconButton variant="text" color="orange">
              <AiOutlineLogout className="h-6 w-6 text-orange-600" />
            </IconButton>
            <Typography variant="small" className="text-xs text-orange-700">
              Sign Up
            </Typography>
          </Link>
        </>
      )}
    </nav>
  );
};

export default Bottombar;
