import React from "react";
import { Carousel, Button, Typography } from "@material-tailwind/react";
import { CategoryTabs } from "../components/CategoryTabs"; // Ensure this path is correct
import RecipeCard from "../components/RecipeCard"; // Adjust the path as necessary
import { Link } from "react-router-dom";

const Home = () => {
  const carouselItems = [
    {
      image: "https://via.placeholder.com/1600x900?text=Delicious+Recipes+to+Try!",
      caption: "Delicious Recipes to Try!",
    },
    {
      image: "https://via.placeholder.com/1600x900?text=Healthy+and+Nutritious+Meals!",
      caption: "Healthy and Nutritious Meals!",
    },
    {
      image: "https://via.placeholder.com/1600x900?text=Quick+and+Easy+Cooking!",
      caption: "Quick and Easy Cooking!",
    },
  ];

  const recipes = [
    {
      image: "https://via.placeholder.com/400x300?text=Recipe+1", // Placeholder image
      title: "Spaghetti Carbonara",
      cookingTime: 25,
      difficulty: "Easy",
      tags: ["Italian", "Pasta", "Quick"],
      username: "ChefMaria",
      createdAt: "2024-10-28T10:00:00Z",
    },
    {
      image: "https://via.placeholder.com/400x300?text=Recipe+2", // Placeholder image
      title: "Chicken Tikka Masala",
      cookingTime: 40,
      difficulty: "Medium",
      tags: ["Indian", "Spicy", "Main Course"],
      username: "ChefRaj",
      createdAt: "2024-10-27T14:30:00Z",
    },
    {
      image: "https://via.placeholder.com/400x300?text=Recipe+3", // Placeholder image
      title: "Beef Tacos",
      cookingTime: 30,
      difficulty: "Medium",
      tags: ["Mexican", "Tacos", "Quick"],
      username: "ChefLuis",
      createdAt: "2024-10-26T18:15:00Z",
    },
    {
      image: "https://via.placeholder.com/400x300?text=Recipe+4", // Placeholder image
      title: "Vegetable Stir Fry",
      cookingTime: 20,
      difficulty: "Easy",
      tags: ["Vegan", "Healthy", "Quick"],
      username: "ChefAnya",
      createdAt: "2024-10-25T12:45:00Z",
    },
    {
      image: "https://via.placeholder.com/400x300?text=Recipe+5", // Placeholder image
      title: "Chocolate Cake",
      cookingTime: 60,
      difficulty: "Hard",
      tags: ["Dessert", "Baking", "Sweet"],
      username: "ChefEmma",
      createdAt: "2024-10-24T09:20:00Z",
    },
    {
      image: "https://via.placeholder.com/400x300?text=Recipe+6", // Placeholder image
      title: "Caesar Salad",
      cookingTime: 15,
      difficulty: "Easy",
      tags: ["Salad", "Healthy", "Quick"],
      username: "ChefJohn",
      createdAt: "2024-10-23T11:00:00Z",
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Carousel Section */}
      <div className="relative">
        <Carousel className="h-96" autoplay>
          {carouselItems.map((item, index) => (
            <div key={index} className="relative h-full w-full">
              <img
                src={item.image}
                alt={`Carousel Item ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-10 left-10 bg-orange-100 p-4 rounded-lg shadow-lg">
                <Typography variant="h3" className="text-gray-800">
                  {item.caption}
                </Typography>
                <Button color="orange" className="mt-2">
                  Explore Recipes
                </Button>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* Categories Section */}
      <section className="py-10 px-4 bg-orange-100">
        <div>
          <Typography variant="h2" className="text-center text-gray-800 mb-8">
            Recipe Categories
          </Typography>
          <Link to="/recipes" className="text-blue-500 hover:underline">
            See all
          </Link>
        </div>
        <CategoryTabs />
      </section>

      {/* Featured Recipes Section */}
      <section className="py-10 px-4">
        <Typography variant="h2" className="text-center text-gray-800 mb-8">
          Featured Recipes
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe} />
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-10 px-4 bg-gray-200 text-center">
        <Typography variant="h4" className="text-gray-800 mb-4">
          Join Our Recipe Community!
        </Typography>
        <Button color="orange">Sign Up Now</Button>
      </section>
    </div>
  );
};

export default Home;
