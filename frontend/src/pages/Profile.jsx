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
import { FaBookmark, FaPizzaSlice } from "react-icons/fa"; // Importing icons
import { RecipeCard } from "../components/components.js"; // Assuming you have a RecipeCard component

const Profile = () => {
  const recipes = [
    {
      image: "https://via.placeholder.com/400x300?text=Recipe+1",
      title: "Spaghetti Carbonara",
      cookingTime: 25,
      difficulty: "Easy",
      tags: ["Italian", "Pasta", "Quick"],
      username: "ChefMaria",
      createdAt: "2024-10-28T10:00:00Z",
    },
    {
      image: "https://via.placeholder.com/400x300?text=Recipe+2",
      title: "Chicken Tikka Masala",
      cookingTime: 40,
      difficulty: "Medium",
      tags: ["Indian", "Spicy", "Main Course"],
      username: "ChefRaj",
      createdAt: "2024-10-27T14:30:00Z",
    },
    // Additional recipe objects...
  ];

  const data = [
    {
      label: <FaPizzaSlice className="text-xl" />,
      value: "created",
      recipes: recipes, // For created recipes, you can filter or use the full array
    },
    {
      label: <FaBookmark className="text-xl" />,
      value: "saved",
      recipes: recipes, // For saved recipes, you can filter or use the full array
    },
  ];

  const [activeTab, setActiveTab] = React.useState("created");

  return (
    <div className="max-w-screen-lg mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-white shadow-md rounded-lg p-6 max-w-screen-lg mx-auto">
        {/* Profile Picture with Avatar */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <div className="avatar">
            <div className="w-20 md:w-24 rounded-full">
              <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="flex flex-col justify-center pl-4 pt-4 md:flex md:items-center">
          <Typography
            variant="h1"
            className="text-xl font-semibold text-gray-800 md:hidden"
          >
            @grinder
          </Typography>

          <div className="flex flex-col items-start ">
            <Typography
              variant="h1"
              className="text-2xl font-semibold text-gray-800 hidden md:block"
            >
              Username
            </Typography>
            <Typography variant="paragraph" className="mt-4 text-gray-600">
            Cooking enthusiast sharing my favorite recipes!
          </Typography>
          </div>
          <div className="flex self-start space-x-8 mt-4 md:mt-0 md:ml-4">
              <div className="flex flex-col items-center">
                <Typography
                  variant="h1"
                  className="text-xl font-semibold text-gray-800"
                >
                  100
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
                  200
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
                  150
                </Typography>
                <Typography variant="paragraph" className="text-gray-500">
                  Following
                </Typography>
              </div>
            </div>
        
        </div>
      </div>

      {/* Underline Tabs for Created and Saved Recipes */}
      <div className="mt-6">
        <Tabs value={activeTab}>
          <TabsHeader
            className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
            indicatorProps={{
              className:
                "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
            }}
          >
            {data.map(({ label, value }) => (
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
            {data.map(({ value, recipes }) => (
              <TabPanel key={value} value={value}>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recipes.map((recipe, index) => (
                    <RecipeCard key={index} recipe={recipe} />
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
