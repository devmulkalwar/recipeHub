// src/data/generateFakeData.js
import { faker } from '@faker-js/faker';

// Define categories with images
const categories = [
  { name: "Appetizer", image: faker.image.urlLoremFlickr({ category: 'food' }) },
  { name: "Main Course", image: faker.image.urlLoremFlickr({ category: 'food' }) },
  { name: "Dessert", image: faker.image.urlLoremFlickr({ category: 'food' }) },
  { name: "Salad", image: faker.image.urlLoremFlickr({ category: 'food' }) },
  { name: "Soup", image: faker.image.urlLoremFlickr({ category: 'food' }) },
  { name: "Beverage", image: faker.image.urlLoremFlickr({ category: 'food' }) },
  { name: "Snack", image: faker.image.urlLoremFlickr({ category: 'food' }) },
];

// Generate fake users
const generateUsers = (numUsers = 20) => {
  return Array.from({ length: numUsers }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    profileImage: faker.image.avatar(),
    bio: faker.lorem.sentence(),
    createdRecipes: [],
    savedRecipes: [],
    followers: [],
    following: [],
  }));
};

// Generate fake comments
// Generate fake comments with user details
const generateComments = (numComments = 100, users = []) => {
  return Array.from({ length: numComments }, () => {
    const user = faker.helpers.arrayElement(users); // Get a random user for the comment
    return {
      id: faker.string.uuid(),
      userId: user.id, // Store user ID for linking
      text: faker.lorem.sentence(),
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
      userDetails: { // Include user details for rendering
        username: user.username,
        profileImage: user.profileImage,
      }
    };
  });
};

// Generate fake recipes
const generateRecipes = (numRecipes = 50, users = [], comments = []) => {
  return Array.from({ length: numRecipes }, () => {
    const numIngredients = faker.number.int({ min: 3, max: 10 });
    const numInstructions = faker.number.int({ min: 5, max: 20 });
    const difficulties = ["Easy", "Medium", "Hard"];
    const cookingTimes = ["Less than 30 min", "30-60 min", "More than 60 min"];

    // Select a random category and creator
    const randomCategory = faker.helpers.arrayElement(categories);
    const creator = faker.helpers.arrayElement(users);

    const recipe = {
      id: faker.string.uuid(),
      title: faker.food.dish(),
      description: faker.food.description(),
      category: randomCategory.name,
      categoryImage: randomCategory.image,
      cookingTime: faker.helpers.arrayElement(cookingTimes),
      difficulty: faker.helpers.arrayElement(difficulties),
      ingredients: Array.from({ length: numIngredients }, () => faker.food.ingredient()),
      instructions: Array.from({ length: numInstructions }, () => faker.lorem.paragraph()),
      likes: faker.number.int({ min: 0, max: 500 }),
      comments: faker.helpers.arrayElements(comments, faker.number.int({ min: 1, max: 5 })).map(comment => comment.id),
      createdBy: creator.id,
      createdByDetails: {
        username: creator.username,
        profileImage: creator.profileImage,
      },
      image: faker.image.urlLoremFlickr({ category: 'food' }),
      tags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.food.adjective()),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };

    // Add recipe ID to the creator's createdRecipes array
    creator.createdRecipes.push(recipe.id);

    return recipe;
  });
};

// Function to filter recipes based on criteria
const filterRecipes = (recipes, filters) => {
  return recipes.filter(recipe => {
    const matchesSearchTerm =
      recipe.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const matchesPopularity =
      filters.popularity === "all" ||
      (filters.popularity === "latest" && new Date(recipe.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) || // Within last week
      (filters.popularity === "popular" && recipe.likes > 100); // Example for popular

    const matchesCookingTime =
      filters.cookingTime === "all" ||
      (filters.cookingTime === "less_30" && recipe.cookingTime === "Less than 30 min") ||
      (filters.cookingTime === "30_60" && recipe.cookingTime === "30-60 min") ||
      (filters.cookingTime === "more_60" && recipe.cookingTime === "More than 60 min");

    const matchesDifficulty =
      filters.difficulty === "all" || recipe.difficulty === filters.difficulty;

    const matchesCategory =
      filters.categories === "all" || recipe.category === filters.categories;

    const matchesTags =
      filters.tags.length === 0 || filters.tags.some(tag => recipe.tags.includes(tag));

    // Check for ingredients match if ingredients filtering is used
    const matchesIngredients =
      filters.ingredients.length === 0 || filters.ingredients.every(ingredient => recipe.ingredients.includes(ingredient));

    // Check for creators match if creators filtering is used
    const matchesCreators =
      filters.creators.length === 0 || filters.creators.includes(recipe.createdBy);

    return (
      matchesSearchTerm &&
      matchesPopularity &&
      matchesCookingTime &&
      matchesDifficulty &&
      matchesCategory &&
      matchesTags &&
      matchesIngredients &&
      matchesCreators
    );
  });
};

// Generate data
const users = generateUsers();
const comments = generateComments(100, users);
const recipes = generateRecipes(100, users, comments);

// Count recipes by category to find trending categories
const categoryCounts = recipes.reduce((acc, recipe) => {
  acc[recipe.category] = (acc[recipe.category] || 0) + 1;
  return acc;
}, {});

const trendingCategories = Object.entries(categoryCounts)
  .sort((a, b) => b[1] - a[1]) // Sort categories by the number of recipes in descending order
  .slice(0, 3)                  // Take top 3 categories as trending
  .map(([category]) => {
    const categoryDetails = categories.find(cat => cat.name === category);
    return categoryDetails || { name: category, image: '' }; // Return name and image
  });

// Assign saved recipes to users
recipes.forEach(recipe => {
  const numSaves = faker.number.int({ min: 0, max: 5 });
  const savedByUsers = faker.helpers.arrayElements(users, numSaves);

  savedByUsers.forEach(user => {
    user.savedRecipes.push(recipe.id);
  });
});

// Establish followers/following relationships
const establishRelationships = (users) => {
  users.forEach(user => {
    const followCount = faker.number.int({ min: 0, max: 1000 });
    user.followers = faker.helpers.arrayElements(users, followCount).map(follower => follower.id);
    user.following = faker.helpers.arrayElements(users, followCount).map(following => following.id);
  });
};

// Add relationships between users
establishRelationships(users);

const loggedInUserId = users[0].id;

// Export data to use directly in frontend
const fakeData = {
  users,
  recipes,
  comments,
  trendingCategories,
  loggedInUserId,
  filterRecipes, // Added filterRecipes function to the exports
};

export default fakeData;
