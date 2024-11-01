import React, { useState, useEffect } from "react";
import { Button, Typography } from "@material-tailwind/react";
import {
  Avatar,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { FaBookmark, FaPizzaSlice } from "react-icons/fa";
import { RecipeCard } from "../components/components.js";
import fakeData from "../data/generateFakeData.js";
import useAuth from "../contexts/useAuthContext.js";
import { Link } from "react-router-dom"; // Import Link

const Profile = () => {
  const { user } = useAuth(); // Ensure useAuth() is called before any conditional logic
  const [activeTab, setActiveTab] = useState("created");

  // Check if user is not null
  if (!user) {
    return <div>Loading...</div>; // Or a suitable loading state
  }

  // Filter created and saved recipes
  const createdRecipes = fakeData.recipes.filter(
    (recipe) => recipe.createdBy === user.id
  );
  const savedRecipes = fakeData.recipes.filter((recipe) =>
    user.savedRecipes.includes(recipe.id)
  );

  // Tab data for created and saved recipes
  const profileTabsData = [
    {
      label: <FaPizzaSlice className="text-xl" />,
      value: "created",
      recipes: createdRecipes,
    },
    {
      label: <FaBookmark className="text-xl" />,
      value: "saved",
      recipes: savedRecipes,
    },
  ];

  return (
    <div className="max-w-screen-lg mx-auto p-2 md:p-4">
      <div className="bg-white shadow-md rounded-lg p-2 max-w-screen-lg mx-auto">
        <div className="flex flex-col md:grid md:grid-cols-3 gap-6 items-center">
          {/* User Profile Picture */}
          <div className="flex items-center justify-center mb-4 md:mb-0">
            <Avatar
              src={user.profileImage}
              alt="Profile Picture"
              size="xl"
              className="w-24 h-24 md:w-40 md:h-40"
            />
          </div>

          {/* User Info Section */}
          <div className="flex flex-col items-center md:items-start md:col-span-2 text-center md:text-left">
            <Typography
              variant="h1"
              className="text-2xl md:text-3xl font-semibold text-gray-800"
            >
              {user.name}
            </Typography>

            <Link to={`/edit-profile/${user.id}`}>Update Profile</Link>

            <Typography
              variant="h1"
              className="text-lg md:text-xl font-semibold text-gray-600"
            >
              @{user.username}
            </Typography>
            <Typography variant="paragraph" className="mt-2 text-gray-600">
              {user.bio || "This user hasn't written a bio yet."}
            </Typography>

            {/* Stats Section */}
            <div className="flex justify-around mt-6 w-full md:w-auto">
              <div className="flex flex-col items-center mx-4">
                <Typography
                  variant="h1"
                  className="text-xl md:text-2xl font-semibold text-gray-800"
                >
                  {createdRecipes.length}
                </Typography>
                <Typography variant="paragraph" className="text-gray-500">
                  Posts
                </Typography>
              </div>
              <div className="flex flex-col items-center mx-4">
                <Typography
                  variant="h1"
                  className="text-xl md:text-2xl font-semibold text-gray-800"
                >
                  {user.followers.length}
                </Typography>
                <Typography variant="paragraph" className="text-gray-500">
                  Followers
                </Typography>
              </div>
              <div className="flex flex-col items-center mx-4">
                <Typography
                  variant="h1"
                  className="text-xl md:text-2xl font-semibold text-gray-800"
                >
                  {user.following.length}
                </Typography>
                <Typography variant="paragraph" className="text-gray-500">
                  Following
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Created and Saved Recipes */}
      <div className="mt-6">
        <Tabs value={activeTab}>
          <TabsHeader
            className="rounded-none border-b border-blue-gray-50 bg-transparent p-0 my-4"
            indicatorProps={{
              className:
                "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
            }}
          >
            {profileTabsData.map(({ label, value }) => (
              <Tab
                key={value}
                value={value}
                onClick={() => setActiveTab(value)}
                className={activeTab === value ? "text-gray-900" : ""}
              >
                {label}
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody>
            {profileTabsData.map(({ value, recipes }) => (
              <TabPanel key={value} value={value}>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
