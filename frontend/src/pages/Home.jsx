import React from "react";
import { Carousel, Button, Typography } from "@material-tailwind/react";
import RecipeCategories from "../components/RecipeCategories";
import RecipeCard from "../components/RecipeCard";
import { Link } from "react-router-dom";
import fakeData from "../data/generateFakeData";
import { faker } from "@faker-js/faker";

const Home = () => {
  const carouselItems = [
    {
      image:
      faker.image.urlLoremFlickr({ category: 'food' }),
      caption: "Delicious Recipes to Try!",
    },
    {
      image:
      faker.image.urlLoremFlickr({ category: 'food' }),
      caption: "Healthy and Nutritious Meals!",
    },
    {
      image:
      faker.image.urlLoremFlickr({ category: 'food' }),
      caption: "Quick and Easy Cooking!",
    },
  ];

  return (
    <div className="flex-grow flex flex-col items-center bg-gray-50 py-4">
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
                <Link
                  to="/recipes"
                  className="block w-full text-center text-white hover:text-orange-400"
                >
                  <Button
                    color="orange"
                    className="mt-2 px-4 py-2 text-xs md:text-sm"
                  >
                    Explore Recipes
                  </Button>
                </Link>
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
            Trending Categories
          </Typography>
        </div>
        <RecipeCategories categories={fakeData.trendingCategories} />
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
            {fakeData.recipes.splice(0, 9).map((recipe, index) => (
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
        <Link to="/signup">
        <Button color="orange" className="px-4 py-2 text-xs md:text-sm">
          Sign Up Now
        </Button>
        </Link>
      </section>
    </div>
  );
};

export default Home;
