import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaBookmark, FaPizzaSlice, FaEdit, FaHeart, FaComment, FaShare } from "react-icons/fa";
import { RecipeCard } from "../components/components.js";
import useAuth from "../contexts/useAuthContext";
import axios from "axios";
import useRecipe from "../contexts/useRecipeContext";
import { toast } from 'react-toastify';

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
    <div className="min-h-screen bg-white">
      {/* Profile Header */}
      <header className="max-w-5xl mx-auto p-4 md:py-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Profile Image */}
          <div className="shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-[3px] ring-gray-100">
              <img
                src={userData?.profileImage || "/placeholder-avatar.png"}
                alt={userData?.username}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder-avatar.png";
                }}
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-grow">
            {/* Username and Edit Profile */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <h2 className="text-xl font-normal">{userData?.username}</h2>
              {isOwnProfile && (
                <Link
                  to={`/edit-profile/${id}`}
                  className="px-4 py-1.5 rounded-lg border border-gray-300 font-medium text-sm hover:bg-gray-50"
                >
                  Edit profile
                </Link>
              )}
              {!isOwnProfile && (
                <button
                  className={`px-6 py-1.5 rounded-lg font-medium text-sm ${
                    isFollowing
                      ? "border border-gray-300 hover:bg-gray-50"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  onClick={() => setIsFollowing(!isFollowing)}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="flex justify-center md:justify-start gap-8 my-4 text-sm">
              <div className="text-center md:text-left">
                <span className="font-semibold">{formatNumber(createdRecipes.length)}</span>
                <span className="text-gray-500 ml-1">posts</span>
              </div>
              <div className="text-center md:text-left">
                <span className="font-semibold">{formatNumber(userData?.followers?.length || 0)}</span>
                <span className="text-gray-500 ml-1">followers</span>
              </div>
              <div className="text-center md:text-left">
                <span className="font-semibold">{formatNumber(userData?.following?.length || 0)}</span>
                <span className="text-gray-500 ml-1">following</span>
              </div>
            </div>

            {/* Bio */}
            <div className="text-center md:text-left space-y-1">
              <div className="font-semibold">{userData?.name}</div>
              <p className="text-sm whitespace-pre-line">{userData?.bio}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content Tabs */}
      <div className="border-t border-gray-200">
        <div className="max-w-5xl mx-auto">
          <div className="flex">
            <button
              className={`flex-1 py-4 text-sm font-medium text-center border-t-2 transition-colors ${
                activeTab === "created"
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-black"
              }`}
              onClick={() => setActiveTab("created")}
            >
              <FaPizzaSlice className="inline-block mr-2 h-3 w-3" />
              POSTS
            </button>
            {isOwnProfile && (
              <button
                className={`flex-1 py-4 text-sm font-medium text-center border-t-2 transition-colors ${
                  activeTab === "saved"
                    ? "border-black text-black"
                    : "border-transparent text-gray-500 hover:text-black"
                }`}
                onClick={() => setActiveTab("saved")}
              >
                <FaBookmark className="inline-block mr-2 h-3 w-3" />
                SAVED
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="max-w-5xl mx-auto px-4">
        {activeTab === "created" ? (
          userRecipes.length === 0 ? (
            <EmptyState
              icon={<FaPizzaSlice className="h-8 w-8 text-gray-400" />}
              title="No Posts Yet"
              message="When you create recipes, they'll appear here."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
              {userRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  cardType={isOwnProfile ? "normal" : "grid"}
                />
              ))}
            </div>
          )
        ) : (
          savedRecipes.length === 0 ? (
            <EmptyState
              icon={<FaBookmark className="h-8 w-8 text-gray-400" />}
              title="No Saved Recipes"
              message="Save recipes to see them here."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
              {savedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  cardType="normal"
                  onUnsave={() => handleUnsaveRecipe(recipe._id)}
                />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

const EmptyState = ({ icon, title, message }) => (
  <div className="py-20 text-center">
    <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
      {icon}
    </div>
    <h3 className="text-2xl font-light text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500">{message}</p>
  </div>
);

export default Profile;