import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaBookmark, FaPizzaSlice, FaEdit } from "react-icons/fa";
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800">User not found</h2>
        <Link to="/" className="mt-4 text-orange-600 hover:text-orange-700">
          Return to Home
        </Link>
      </div>
    );
  }

  const isOwnProfile = loggedInUser && loggedInUser.id === id;
  const createdRecipes = userData.recipes || [];
  const savedRecipes = userData.savedRecipes || [];

  return (
    <div className="max-w-screen-xl mx-auto p-4 md:p-8">
      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden shadow-lg">
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
                className="absolute bottom-2 right-2 p-2 bg-orange-500 rounded-full text-white hover:bg-orange-600 transition-colors shadow-md"
              >
                <FaEdit className="w-5 h-5" />
              </Link>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {userData.name || "New User"}
            </h1>
            <p className="text-gray-600 mb-4">@{userData.username || "username"}</p>
            <p className="text-gray-700 mb-6 max-w-2xl">{userData.bio || "No bio yet"}</p>

            {/* Stats */}
            <div className="flex justify-center md:justify-start gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{createdRecipes.length}</p>
                <p className="text-gray-600">Recipes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{userData.followers?.length || 0}</p>
                <p className="text-gray-600">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{userData.following?.length || 0}</p>
                <p className="text-gray-600">Following</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <div className="tabs tabs-boxed">
          <button
            className={`tab ${activeTab === 'created' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('created')}
          >
            <FaPizzaSlice className="mr-2" /> Created
          </button>
          {isOwnProfile && (
            <button
              className={`tab ${activeTab === 'saved' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('saved')}
            >
              <FaBookmark className="mr-2" /> Saved
            </button>
          )}
        </div>

        {/* Recipe Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'created' 
            ? createdRecipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))
            : savedRecipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
          