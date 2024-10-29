import React from "react";
import { Carousel, Button, Typography } from "@material-tailwind/react";
import RecipeCategories from "../components/RecipeCategories";
import RecipeCard from "../components/RecipeCard";
import { Link } from "react-router-dom";

const Home = () => {
  const carouselItems = [
    {
      image:
        "https://via.placeholder.com/1600x900?text=Delicious+Recipes+to+Try!",
      caption: "Delicious Recipes to Try!",
    },
    {
      image:
        "https://via.placeholder.com/1600x900?text=Healthy+and+Nutritious+Meals!",
      caption: "Healthy and Nutritious Meals!",
    },
    {
      image:
        "https://via.placeholder.com/1600x900?text=Quick+and+Easy+Cooking!",
      caption: "Quick and Easy Cooking!",
    },
  ];

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
    },{
      image: "https://via.placeholder.com/400x300?text=Recipe+2",
      title: "Chicken Tikka Masala",
      cookingTime: 40,
      difficulty: "Medium",
      tags: ["Indian", "Spicy", "Main Course"],
      username: "ChefRaj",
      createdAt: "2024-10-27T14:30:00Z",
    },
    // additional recipe objects...
  ];

  return (
    <div className="flex-grow flex flex-col items-center bg-gray-50">
      {/* Carousel Section */}
      <div className="w-full max-w-screen-lg">
        <Carousel className="h-96" autoplay loop>
          {carouselItems.map((item, index) => (
            <div key={index} className="relative h-full w-full">
              <img
                src={item.image}
                alt={`Carousel Item ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-10 left-10 bg-orange-100 p-4 rounded-lg shadow-lg">
                <Typography
                  variant="h3"
                  className="text-gray-800 text-sm md:text-2xl"
                >
                  {item.caption}
                </Typography>
                <Button
                  color="orange"
                  className="mt-2 px-4 py-2 text-xs md:text-sm"
                >
                  Explore Recipes
                </Button>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* Categories Section */}
      <section className="w-full max-w-screen-lg  py-10  bg-orange-100">
        <div className="flex justify-between items-center px-6">
          <Typography
            variant="h2"
            className="text-gray-800 text-lg md:text-2xl"
          >
            Recipe Categories
          </Typography>
        </div>
       <RecipeCategories/>
      </section>

      {/* Featured Recipes Section */}
      <section className="w-full max-w-screen-lg my-8 ">
        <Typography
          variant="h2"
          className="text-left text-gray-800 mb-8 text-lg md:text-2xl  px-4"
        >
          Featured Recipes
        </Typography>

        <div className="min-w-[320px] max-w-screen-lg flex justify-center items-center w-full py-6  px-4">
          <div className="w-full  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe, index) => (
              <RecipeCard key={index} recipe={recipe} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full max-w-screen-lg bg-gray-200 text-center py-10">
        <Typography
          variant="h4"
          className="text-gray-800 mb-4 text-lg md:text-2xl"
        >
          Join Our Recipe Community!
        </Typography>
        <Button color="orange" className="px-4 py-2 text-xs md:text-sm">
          Sign Up Now
        </Button>
      </section>
    </div>
  );
};

export default Home;
