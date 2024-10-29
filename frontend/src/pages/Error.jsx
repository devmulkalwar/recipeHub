import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50 text-gray-700 p-6">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-orange-500">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mt-4">Oops! Page Not Found</h2>
        <p className="mt-2 text-lg md:text-xl">It seems like you're lost in the Recipe Hub!</p>
      </div>

      <img
        src="https://via.placeholder.com/500x300?text=Delicious+Recipes+Not+Here!"
        alt="Recipe Not Found"
        className="w-96 h-64 mt-6 rounded-md shadow-md object-cover"
      />

      <Link
        to="/"
        className="flex items-center gap-2 mt-8 px-6 py-3 bg-orange-500 text-white rounded-md text-lg shadow hover:bg-orange-600 transition"
      >
        <FaHome className="text-2xl" />
        Return to Home
      </Link>
    </div>
  );
};

export default Error;
