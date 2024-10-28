import React from 'react';
import { Link } from 'react-router-dom';
import { BellIcon } from '@heroicons/react/24/solid';
import { IconButton, Typography } from '@material-tailwind/react';

const Header = () => {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-orange-100 border-b border-orange-200 md:hidden">
      {/* Title with Link to Homepage */}
      <Link to="/">
        <Typography variant="h5" className="text-orange-700 font-bold">
          RecipeHub
        </Typography>
      </Link>
      
      {/* Notification Icon */}
      <IconButton variant="text" color="orange">
        <BellIcon className="h-6 w-6 text-orange-600" />
      </IconButton>
    </header>
  );
};

export default Header;
