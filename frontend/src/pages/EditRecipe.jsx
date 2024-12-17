import React, { useState } from "react";

const CreateRecipe = () => {
  const [recipeData, setRecipeData] = useState({
    title: "",
    description: "",
    category: "",
    cookingTime: "",
    difficulty: "",
    ingredients: [""],
    instructions: [""],
    tags: [],
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [currentTag, setCurrentTag] = useState("");

  const categories = [
    "Appetizer",
    "Main Course",
    "Dessert",
    "Salad",
    "Soup",
    "Beverage",
    "Snack",
  ];
  const difficulties = ["Easy", "Medium", "Hard"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipeData({ ...recipeData, [name]: value });
  };

  const handleArrayChange = (e, index, field) => {
    const newArray = [...recipeData[field]];
    newArray[index] = e.target.value;
    setRecipeData({ ...recipeData, [field]: newArray });
  };

  const addArrayItem = (field) => {
    const lastItem = recipeData[field][recipeData[field].length - 1];
    if (lastItem !== "") {
      setRecipeData({ ...recipeData, [field]: [...recipeData[field], ""] });
    }
  };

  const deleteArrayItem = (field, index) => {
    const newArray = recipeData[field].filter((_, i) => i !== index);
    setRecipeData({ ...recipeData, [field]: newArray });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRecipeData({ ...recipeData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleTagAdd = () => {
    if (currentTag.trim() && recipeData.tags.length < 5) {
      setRecipeData((prevData) => ({
        ...prevData,
        tags: [...prevData.tags, currentTag.trim()],
      }));
      setCurrentTag("");
    }
  };

  const handleTagDelete = (index) => {
    const newTags = recipeData.tags.filter((_, i) => i !== index);
    setRecipeData({ ...recipeData, tags: newTags });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Recipe Created:", recipeData);
  };

  return (
    
      <div className="flex-grow m-auto in-h-screen flex items-center justify-center flex-col w-full max-w-md bg-white shadow-lg rounded-lg p-2">
        <h2 className="text-center text-orange-600 font-bold text-xl sm:text-2xl mb-4">
          Create a New Recipe
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Image Preview"
              className="mb-4 w-full h-32 sm:h-40 object-cover rounded"
            />
          )}
          <input
            type="file"
            onChange={handleImageChange}
            className="mb-2"
            accept="image/*"
          />

          <input
            type="text"
            name="title"
            value={recipeData.title}
            onChange={handleInputChange}
            placeholder="Title"
            required
            className="w-full p-2 border border-gray-300 rounded bg-white focus:ring focus:ring-orange-500 text-sm sm:text-base"
          />

          <textarea
            name="description"
            value={recipeData.description}
            onChange={handleInputChange}
            placeholder="Description"
            required
            className="w-full p-2 border border-gray-300 rounded bg-white focus:ring focus:ring-orange-500 text-sm sm:text-base"
          />

          <select
            name="category"
            value={recipeData.category}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded bg-white focus:ring focus:ring-orange-500 text-sm sm:text-base"
          >
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="cookingTime"
            value={recipeData.cookingTime}
            onChange={handleInputChange}
            placeholder="Cooking Time (in mins)"
            required
            className="w-full p-2 border border-gray-300 rounded bg-white focus:ring focus:ring-orange-500 text-sm sm:text-base"
          />

          <select
            name="difficulty"
            value={recipeData.difficulty}
            onChange={handleInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded bg-white focus:ring focus:ring-orange-500 text-sm sm:text-base"
          >
            <option value="">Select Difficulty</option>
            {difficulties.map((difficulty, index) => (
              <option key={index} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>

          {/* Ingredients Section */}
          <div>
            <label className="block font-medium text-gray-700 mb-2 text-sm">
              Ingredients:
            </label>
            {recipeData.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  value={ingredient}
                  onChange={(e) => handleArrayChange(e, index, "ingredients")}
                  className="flex-grow p-2 border border-gray-300 rounded bg-white focus:ring focus:ring-orange-500 text-sm sm:text-base"
                  placeholder="Ingredient"
                />
                {index === recipeData.ingredients.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => addArrayItem("ingredients")}
                    className="bg-orange-500 text-white hover:bg-orange-600 px-3 py-1 rounded text-xs sm:text-sm"
                  >
                    Add
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => deleteArrayItem("ingredients", index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs sm:text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Instructions Section */}
          <div>
            <label className="block font-medium text-gray-700 mb-2 text-sm">
              Instructions:
            </label>
            {recipeData.instructions.map((instruction, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <input
                  value={instruction}
                  onChange={(e) => handleArrayChange(e, index, "instructions")}
                  className="flex-grow p-2 border border-gray-300 rounded bg-white focus:ring focus:ring-orange-500 text-sm sm:text-base"
                  placeholder="Instruction"
                />
                {index === recipeData.instructions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => addArrayItem("instructions")}
                    className="bg-orange-500 text-white hover:bg-orange-600 px-3 py-1 rounded text-xs sm:text-sm"
                  >
                    Add
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => deleteArrayItem("instructions", index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs sm:text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Tags Section */}
          <div>
            <label className="block font-medium text-gray-700 mb-2 text-sm">
              Tags:
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {recipeData.tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center bg-orange-500 text-white px-2 py-1 rounded text-xs sm:text-sm"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleTagDelete(index)}
                    className="ml-1 text-xs text-red-500 hover:text-red-600"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add a tag"
                className="flex-grow p-2 border border-gray-300 rounded bg-white focus:ring focus:ring-orange-500 text-sm sm:text-base"
                disabled={recipeData.tags.length >= 5}
              />
              <button
                type="button"
                onClick={handleTagAdd}
                className="bg-orange-500 text-white hover:bg-orange-600 px-3 py-1 rounded text-xs sm:text-sm"
                disabled={recipeData.tags.length >= 5}
              >
                Add Tag
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 rounded transition duration-200"
          >
            Submit Recipe
          </button>
        </form>
   </div>
  );
};

export default CreateRecipe;
