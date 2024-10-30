import React from "react";
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

const Profile = () => {
  // Retrieve the logged-in user's data
  const loggedInUser = fakeData.users.find(
    (user) => user.id === fakeData.loggedInUserId
  );

  // Filter created and saved recipes
  const createdRecipes = fakeData.recipes.filter(
    (recipe) => recipe.createdBy === loggedInUser.id
  );
  const savedRecipes = fakeData.recipes.filter((recipe) =>
    loggedInUser.savedRecipes.includes(recipe.id)
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
  console.log("Logged In User:", loggedInUser);
console.log("Saved Recipes IDs:", loggedInUser.savedRecipes);
console.log("All Recipes:", fakeData.recipes);

  const [activeTab, setActiveTab] = React.useState("created");

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      {/* Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 bg-white shadow-md rounded-lg p-6 max-w-screen-lg mx-auto">
        {/* User Profile Picture */}
        <div className="flex-shrink-0 flex items-center justify-center mb-4 md:mb-0">
          <Avatar
            src={loggedInUser.profileImage}
            alt="Profile Picture"
            size="xl"
          />
        </div>

        {/* User Info Section */}
        <div className="flex flex-col justify-center md:col-span-2 pl-4 pt-4">
          <Typography
            variant="h1"
            className="text-2xl font-semibold text-gray-800"
          >
            {loggedInUser.name}
          </Typography>
          <Typography
            variant="h1"
            className="text-lg font-semibold text-gray-600"
          >
            @{loggedInUser.username}
          </Typography>
          <Typography variant="paragraph" className="mt-2 text-gray-600">
            {loggedInUser.bio || "This user hasn't written a bio yet."}
          </Typography>

          {/* Stats Section */}
          <div className="flex justify-around mt-4">
            <div className="flex flex-col items-center">
              <Typography
                variant="h1"
                className="text-xl font-semibold text-gray-800"
              >
                {createdRecipes.length}
              </Typography>
              <Typography variant="paragraph" className="text-gray-500">
                Posts
              </Typography>
            </div>
            <div className="flex flex-col items-center">
              <Typography
                variant="h1"
                className="text-xl font-semibold text-gray-800"
              >
                {loggedInUser.followers.length}
              </Typography>
              <Typography variant="paragraph" className="text-gray-500">
                Followers
              </Typography>
            </div>
            <div className="flex flex-col items-center">
              <Typography
                variant="h1"
                className="text-xl font-semibold text-gray-800"
              >
                {loggedInUser.following.length}
              </Typography>
              <Typography variant="paragraph" className="text-gray-500">
                Following
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for Created and Saved Recipes */}
      <div className="mt-6">
        <Tabs value={activeTab}>
          <TabsHeader
            className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
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
                    <RecipeCard key={recipe.id} recipe={recipe}  />
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
