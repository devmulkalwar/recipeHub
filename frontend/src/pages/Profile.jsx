import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaBookmark, FaPizzaSlice, FaHeart, FaComment, FaShare } from "react-icons/fa";
import { RecipeCard } from "../components/components.js";
import useAuth from "../contexts/useAuthContext";
import axios from "axios";
import useRecipe from "../contexts/useRecipeContext";
import { toast } from 'react-toastify';
import { AiOutlineEdit } from 'react-icons/ai';

const Profile = () => {
  const { user: loggedInUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { getUserRecipes, getSavedRecipes, unsaveRecipe } = useRecipe();
  const [activeTab, setActiveTab] = useState("created");
  const [userData, setUserData] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false); // New state for following

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Fetching data for user ID:', id);
        const [userData, recipesData, savedRecipesData] = await Promise.all([
          axios.get(`/api/users/${id}`),
          getUserRecipes(id),
          getSavedRecipes(id)
        ]);

        if (userData.data.success) {
          setUserData(userData.data.user);
          // Check if the logged-in user is following this user
          if (loggedInUser && userData.data.user.followers) {
            setIsFollowing(userData.data.user.followers.includes(loggedInUser.id));
          }
        }
        setUserRecipes(recipesData || []);
        setSavedRecipes(savedRecipesData || []);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id, navigate, loggedInUser, getUserRecipes, getSavedRecipes]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}m`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num;
  };

  const handleFollow = async () => {
    if (!loggedInUser) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post('/api/users/follow', { targetUserId: id });
      if (response.data.success) {
        setIsFollowing(true);
        toast.success('Successfully followed user');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to follow user');
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await axios.post('/api/users/unfollow', { targetUserId: id });
      if (response.data.success) {
        setIsFollowing(false);
        toast.success('Successfully unfollowed user');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to unfollow user');
    }
  };

  const handleSaveToggle = (recipeId, isSaved) => {
    if (activeTab === 'saved') {
      if (!isSaved) {
        // Remove from saved recipes when unsaved
        setSavedRecipes(prev => prev.filter(recipe => recipe._id !== recipeId));
      } else {
        // Add to saved recipes when saved
        const recipe = recipes.find(r => r._id === recipeId);
        if (recipe) {
          setSavedRecipes(prev => [...prev, recipe]);
        }
      }
    }
  };

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

  return (
    <div className="flex-grow flex flex-col items-center bg-gray-50 py-4">
      <div className="w-full max-w-screen-lg px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={userData?.profileImage || "/placeholder-avatar.png"}
              alt={userData?.username}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-orange-100"
            />
            <div className="flex-grow text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-800">{userData?.username}</h1>
              <p className="text-gray-600 mt-2">{userData?.bio || 'No bio yet'}</p>
              
              {/* Stats Row */}
              <div className="flex justify-center sm:justify-start gap-8 mt-4">
                <div className="text-center">
                  <span className="block text-xl font-bold text-gray-800">{userRecipes?.length || 0}</span>
                  <span className="text-sm text-gray-500">posts</span>
                </div>
                <div className="text-center">
                  <span className="block text-xl font-bold text-gray-800">{userData?.followers?.length || 0}</span>
                  <span className="text-sm text-gray-500">followers</span>
                </div>
                <div className="text-center">
                  <span className="block text-xl font-bold text-gray-800">{userData?.following?.length || 0}</span>
                  <span className="text-sm text-gray-500">following</span>
                </div>
              </div>
            </div>
            
            {/* Action Button */}
            {isOwnProfile ? (
              <Link
                to={`/edit-profile/${id}`}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <AiOutlineEdit />
                Edit Profile
              </Link>
            ) : (
              <button
                onClick={isFollowing ? handleUnfollow : handleFollow}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  isFollowing
                    ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab('created')}
            className={`flex items-center gap-2 px-6 py-3 ${
              activeTab === 'created'
                ? 'border-b-2 border-orange-500 text-orange-500'
                : 'text-gray-600'
            }`}
          >
            <span>Posts</span>
          </button>
          {isOwnProfile && (
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 px-6 py-3 ${
                activeTab === 'saved'
                  ? 'border-b-2 border-orange-500 text-orange-500'
                  : 'text-gray-600'
              }`}
            >
              <span>Saved</span>
            </button>
          )}
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="min-h-[300px]">
            {activeTab === 'created' ? (
              userRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userRecipes.map(recipe => (
                    <RecipeCard
                      key={recipe._id}
                      recipe={recipe}
                      onDelete={(deletedId) => {
                        setUserRecipes(prev => 
                          prev.filter(recipe => recipe._id !== deletedId)
                        );
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] bg-white rounded-lg shadow-sm">
                  <p className="text-gray-500 text-lg mb-4">No recipes created yet</p>
                  <Link
                    to="/create-recipe"
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Create Your First Recipe
                  </Link>
                </div>
              )
            ) : (
              savedRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedRecipes.map(recipe => (
                    <RecipeCard
                      key={recipe._id}
                      recipe={recipe}
                      onSaveToggle={handleSaveToggle}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[300px] bg-white rounded-lg shadow-sm">
                  <p className="text-gray-500 text-lg mb-4">No saved recipes yet</p>
                  <Link
                    to="/recipes"
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    Explore Recipes
                  </Link>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;