import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaBookmark, FaPizzaSlice, FaEdit, FaHeart, FaComment, FaShare } from "react-icons/fa";
import { RecipeCard } from "../components/components.js";
import useAuth from "../contexts/useAuthContext";
import axios from "axios";

const Profile = () => {
  const { user: loggedInUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("created");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`);
        if (response.data.success) {
          setUserData(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800">User not found</h2>
        <Link to="/" className="mt-4 text-orange-600 hover:text-orange-700 transition-colors">
          Return to Home
        </Link>
      </div>
    );
  }

  const isOwnProfile = loggedInUser && loggedInUser.id === id;
  const createdRecipes = userData.recipes || [];
  const savedRecipes = userData.savedRecipes || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white min-h-screen">
        {/* Profile Header */}
        <div className="px-4 py-8 md:px-8">
          {/* Mobile Layout */}
          <div className="block md:hidden">
            {/* Profile Picture - Centered on Mobile */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-gray-100 shadow-lg">
                  <img
                    src={userData.profileImage || "/placeholder-avatar.png"}
                    alt={userData.name || "Profile"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder-avatar.png";
                    }}
                  />
                </div>
                {isOwnProfile && (
                  <Link
                    to={`/edit-profile/${id}`}
                    className="absolute -bottom-1 -right-1 p-2 bg-orange-500 rounded-full text-white hover:bg-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <FaEdit className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>

            {/* User Info - Centered on Mobile */}
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-gray-900 mb-1">
                {userData.name || "New User"}
              </h1>
              <p className="text-gray-600 text-sm mb-3">@{userData.username || "username"}</p>
              <p className="text-gray-700 text-sm leading-relaxed px-4">
                {userData.bio || "No bio yet"}
              </p>
            </div>

            {/* Stats - Mobile */}
            <div className="flex justify-center space-x-8 mb-6">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{createdRecipes.length}</div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">Recipes</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{userData.followers?.length || 0}</div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{userData.following?.length || 0}</div>
                <div className="text-xs text-gray-600 uppercase tracking-wide">Following</div>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:block">
            <div className="flex items-start space-x-8">
              {/* Profile Picture - Desktop */}
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-gray-100 shadow-lg">
                  <img
                    src={userData.profileImage || "/placeholder-avatar.png"}
                    alt={userData.name || "Profile"}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder-avatar.png";
                    }}
                  />
                </div>
                {isOwnProfile && (
                  <Link
                    to={`/edit-profile/${id}`}
                    className="absolute -bottom-2 -right-2 p-3 bg-orange-500 rounded-full text-white hover:bg-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <FaEdit className="w-4 h-4" />
                  </Link>
                )}
              </div>

              {/* User Info - Desktop */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-4 mb-4">
                  <h1 className="text-2xl font-light text-gray-900">
                    {userData.name || "New User"}
                  </h1>
                  {isOwnProfile && (
                    <Link
                      to={`/edit-profile/${id}`}
                      className="px-4 py-1.5 text-sm font-medium text-gray-900 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                      Edit Profile
                    </Link>
                  )}
                </div>

                {/* Stats - Desktop */}
                <div className="flex space-x-8 mb-4">
                  <div>
                    <span className="font-semibold text-gray-900">{createdRecipes.length}</span>
                    <span className="text-gray-600 ml-1">recipes</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{userData.followers?.length || 0}</span>
                    <span className="text-gray-600 ml-1">followers</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">{userData.following?.length || 0}</span>
                    <span className="text-gray-600 ml-1">following</span>
                  </div>
                </div>

                {/* Bio - Desktop */}
                <div className="max-w-lg">
                  <p className="text-sm text-gray-900 font-medium mb-1">{userData.name || "New User"}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {userData.bio || "No bio yet"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-t border-gray-200">
          <div className="flex">
            <button
              className={`flex-1 py-3 px-1 text-center border-t-2 transition-colors ${
                activeTab === 'created'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('created')}
            >
              <div className="flex items-center justify-center space-x-2">
                <FaPizzaSlice className="w-3 h-3" />
                <span className="text-xs font-semibold uppercase tracking-widest">Created</span>
              </div>
            </button>
            {isOwnProfile && (
              <button
                className={`flex-1 py-3 px-1 text-center border-t-2 transition-colors ${
                  activeTab === 'saved'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('saved')}
              >
                <div className="flex items-center justify-center space-x-2">
                  <FaBookmark className="w-3 h-3" />
                  <span className="text-xs font-semibold uppercase tracking-widest">Saved</span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="p-4 md:p-8">
          {(activeTab === 'created' ? createdRecipes : savedRecipes).length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-gray-300 flex items-center justify-center">
                {activeTab === 'created' ? (
                  <FaPizzaSlice className="w-6 h-6 text-gray-400" />
                ) : (
                  <FaBookmark className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {activeTab === 'created' ? 'No recipes created yet' : 'No saved recipes'}
              </h3>
              <p className="text-gray-600 text-sm">
                {activeTab === 'created' 
                  ? 'Start sharing your favorite recipes!' 
                  : 'Save recipes you love to see them here'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 md:gap-4">
              {(activeTab === 'created' ? createdRecipes : savedRecipes).map((recipe) => (
                <InstagramRecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Instagram-style Recipe Card Component
const InstagramRecipeCard = ({ recipe }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative aspect-square bg-gray-100 rounded-md overflow-hidden group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={recipe.image || "/placeholder-food.jpg"}
        alt={recipe.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        onError={(e) => {
          e.target.src = "/placeholder-food.jpg";
        }}
      />
      
      {/* Hover Overlay */}
      <div className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-200 ${
        isHovered ? 'opacity-100' : 'opacity-0 md:opacity-0'
      } md:group-hover:opacity-100`}>
        <div className="flex space-x-6 text-white">
          <div className="flex items-center space-x-1">
            <FaHeart className="w-4 h-4" />
            <span className="text-sm font-semibold">{recipe.likes?.length || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaComment className="w-4 h-4" />
            <span className="text-sm font-semibold">{recipe.comments?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Recipe Title Overlay for Mobile */}
      <div className="md:hidden absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
        <p className="text-white text-xs font-medium truncate">{recipe.title}</p>
      </div>
    </div>
  );
};

export default Profile;