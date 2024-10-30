// src/fakeData/fakeRecipeData.js
import { faker } from '@faker-js/faker';

// Generate fake users
const generateUsers = (numUsers = 20) => {
  return Array.from({ length: numUsers }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    username: faker.internet.username(),
    email: faker.internet.email(),
    profileImage: faker.image.avatar(),
    bio: faker.lorem.sentence(),
    followers: [],
    following: [],
    savedRecipes: [],
    likedRecipes: [],
    createdRecipes: [], // Will hold IDs of recipes created by this user
    lastLogin: faker.date.recent(),
    isVerified: faker.datatype.boolean(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  }));
};

// Generate fake comments
const generateComments = (numComments = 100, users = []) => {
  return Array.from({ length: numComments }, () => ({
    id: faker.string.uuid(),
    user: faker.helpers.arrayElement(users).id,
    text: faker.lorem.sentence(),
    createdAt: faker.date.recent(),
    updatedAt: faker.date.recent(),
  }));
};

// Generate fake recipes
const generateRecipes = (numRecipes = 50, users = [], comments = []) => {
  return Array.from({ length: numRecipes }, () => {
    const numIngredients = faker.number.int({ min: 3, max: 10 });
    const numInstructions = faker.number.int({ min: 5, max: 20 });
    const recipeComments = faker.helpers.arrayElements(comments, faker.number.int({ min: 1, max: 5 }));
    const difficulties = ["Easy", "Medium", "Hard"];
    const randomDifficulty = faker.helpers.arrayElement(difficulties);

    // Select a user as the creator
    const creator = faker.helpers.arrayElement(users);
    const creatorId = creator.id;

    const recipe = {
      id: faker.string.uuid(),
      title: faker.food.dish(),
      description: faker.food.description(),
      cookingTime: `${faker.number.int({ min: 10, max: 120 })} mins`,
      difficulty: randomDifficulty,
      ingredients: Array.from({ length: numIngredients }, () => faker.food.ingredient()),
      instructions: Array.from({ length: numInstructions }, () => faker.lorem.paragraph()),
      likes: faker.number.int({ min: 0, max: 500 }),
      comments: recipeComments.map(comment => comment.id),
      createdBy: creatorId,  // Store only creator ID for reference
      createdByDetails: {    // Store additional details here
        username: creator.username,
        profileImage: creator.profileImage,
      },
      image: faker.image.urlLoremFlickr({ category: 'food' }),
      tags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.food.adjective()),
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };

    // Add recipe ID to the creator's createdRecipes array
    const originalUser = users.find(user => user.id === creatorId);
    if (originalUser) {
      originalUser.createdRecipes.push(recipe.id);
    }

    return recipe;
  });
};

// Generate data
const users = generateUsers();
const comments = generateComments(100, users);
const recipes = generateRecipes(50, users, comments);

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
  loggedInUserId
};

export default fakeData;
