import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Button, Typography } from '@material-tailwind/react';
import useAuth from '../contexts/useAuthContext'; // Import your Auth context

const EditProfile = () => {
  const { id } = useParams(); // Get user ID from URL
  const { user } = useAuth(); // Assuming you have a user context
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    profileImage: ''
  });

  // Populate form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        bio: user.bio,
        profileImage: user.profileImage
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          profileImage: reader.result // Update the profileImage with the base64 encoded string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., update the user profile)
    console.log('Updated Profile Data:', formData);
  };

  return (
    <div className="max-w-screen-md mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex flex-col items-center justify-center mb-4">
          <Avatar
            src={formData.profileImage}
            alt="Profile Picture"
            size="xl"
            className="w-24 h-24 mb-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm text-gray-500"
          />
        </div>
        <Typography variant="h1" className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Edit Profile
        </Typography>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border bg-white border-gray-300 rounded focus:outline-none focus:ring focus:ring-orange-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border bg-white border-gray-300 rounded focus:outline-none focus:ring focus:ring-orange-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-2 border bg-white border-gray-300 rounded focus:outline-none focus:ring focus:ring-orange-500"
              rows="4"
            />
          </div>
          <Button type="submit" color="orange" className="w-full">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
