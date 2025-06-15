import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../contexts/useAuthContext';
import { toast } from 'react-toastify';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { user, completeProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    profileImage: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB
        toast.error('File size should be less than 10MB');
        return;
      }

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a JPEG or PNG image');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      setFormData(prev => ({
        ...prev,
        profileImage: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('username', formData.username);
      formDataToSend.append('bio', formData.bio);
      if (formData.profileImage) {
        formDataToSend.append('profileImage', formData.profileImage, formData.profileImage.name);
      }

      const success = await completeProfile(formDataToSend);
      if (success) {
        toast.success('Profile completed successfully!');
        navigate(`/profile/${user.id}`);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-white shadow-2xl">
        <div className="card-body p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Complete Your Profile
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                  <img
                    src={imagePreview || '/placeholder-avatar.png'}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </label>
              </div>
            </div>

            {/* Name Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-700 font-medium">Full Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="input input-bordered w-full focus:input-warning focus:border-orange-400"
                required
              />
            </div>

            {/* Username Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-700 font-medium">Username</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                className="input input-bordered w-full focus:input-warning focus:border-orange-400"
                required
              />
            </div>

            {/* Bio Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-700 font-medium">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself"
                className="textarea textarea-bordered w-full h-24 focus:textarea-warning focus:border-orange-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-none text-white font-medium py-3 shadow-lg hover:shadow-xl transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Saving...' : 'Complete Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;