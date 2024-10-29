import React from 'react';
import { Button, Typography } from '@material-tailwind/react';
import { Link } from 'react-router-dom';

const GetStarted = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 relative">
      <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: 'url("/path/to/your/background-image.jpg")' }} />
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md relative z-10">
        <Typography variant="h4" className="text-center text-gray-800 mb-6">
          Get Started with Recipe Hub
        </Typography>
        
        <img 
          src="/path/to/your/featured-image.jpg" 
          alt="Delicious Recipe" 
          className="w-full h-32 object-cover rounded-lg mb-4" 
        />

        <Typography variant="body1" className="text-gray-600 mb-4 text-center">
          Discover a world of delicious recipes! Join our community to share your favorite meals and get inspired by others.
        </Typography>
        
        <Link to = "/signup">
        <Button 
          color="orange" 
          className="w-full mt-4 py-2"
        >
          Get Satrted
        </Button>
        </Link>

        <Typography variant="body2" className="text-gray-500 text-center mt-4">
          Already have an account? 
          <a href="/login" className="text-orange-500 font-semibold"> Log In</a>
        </Typography>
        
        <Typography variant="body2" className="text-gray-500 text-center mt-4">
          Want to explore? 
          <a href="/" className="text-orange-500 font-semibold"> Explore Recipes</a>
        </Typography>
      </div>
    </div>
  );
};

export default GetStarted;
