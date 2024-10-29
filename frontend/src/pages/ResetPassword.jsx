import React, { useState } from 'react';
import { Button, Typography } from '@material-tailwind/react';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    
    // Logic for resetting the password goes here
    alert(`Password reset to: ${newPassword}`);
    setError(''); // Clear error message
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <Typography variant="h4" className="text-center text-gray-800 mb-6">
          Reset Password
        </Typography>
        {error && (
          <Typography variant="body2" className="text-red-500 text-center mb-4">
            {error}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            required
            className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
            className="w-full h-12 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
          />
          <Button 
            type="submit"
            color="orange" 
            className="w-full py-2"
          >
            Reset Password
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

export default ResetPassword;
