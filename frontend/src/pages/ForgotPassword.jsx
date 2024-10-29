import React, { useState } from 'react';
import { Button, Typography } from '@material-tailwind/react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for sending reset password email goes here
    alert(`Reset link sent to ${email}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <Typography variant="h4" className="text-center text-gray-800 mb-6">
          Forgot Password
        </Typography>
        <Typography variant="body1" className="text-gray-600 mb-4 text-center">
          Enter your email address and we will send you a link to reset your password.
        </Typography>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            required
            className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
          />
          <Button 
            type="submit"
            color="orange" 
            className="w-full py-2"
          >
            Send Reset Link
          </Button>
        </form>
        <Typography variant="body2" className="text-gray-500 text-center mt-4">
          Remembered your password? 
          <a href="/login" className="text-orange-500 font-semibold"> Log In</a>
        </Typography>
      </div>
    </div>
  );
};

export default ForgotPassword;
