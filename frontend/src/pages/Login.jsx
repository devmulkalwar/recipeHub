import React from 'react';
import { Button, Input, Typography } from '@material-tailwind/react';

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <Typography variant="h4" className="text-center text-gray-800 mb-6">
          Login to Recipe Hub
        </Typography>
        <form>
          <div className="mb-4">
            <Input 
              type="email" 
              label="Email" 
              required 
              color="orange" 
              size="lg" 
            />
          </div>
          <div className="mb-6">
            <Input 
              type="password" 
              label="Password" 
              required 
              color="orange" 
              size="lg" 
            />
          </div>
          <Button 
            type="submit" 
            color="orange" 
            className="w-full py-2"
          >
            Log In
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Typography className="text-sm text-gray-600">
            Don't have an account? 
            <a href="/signup" className="text-orange-500 hover:underline"> Sign up</a>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Login;
