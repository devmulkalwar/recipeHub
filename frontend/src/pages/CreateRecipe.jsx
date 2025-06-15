import React, { useState } from "react";
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useRecipe from '../contexts/useRecipeContext';

const CreateRecipe = () => {
  const { createRecipe } = useRecipe();
  const navigate = useNavigate();
  
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!recipeData.title || !recipeData.description || !recipeData.category ||
          !recipeData.cookingTime || !recipeData.difficulty || !recipeData.image) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Validate at least one ingredient and instruction
      if (!recipeData.ingredients[0] || !recipeData.instructions[0]) {
        toast.error('Please add at least one ingredient and instruction');
        return;
      }

      const formData = new FormData();
      formData.append('title', recipeData.title);
      formData.append('description', recipeData.description);
      formData.append('category', recipeData.category);
      formData.append('cookingTime', recipeData.cookingTime);
      formData.append('difficulty', recipeData.difficulty);
      formData.append('recipeImage', recipeData.image);

      // Filter out empty strings before appending
      const filteredIngredients = recipeData.ingredients.filter(i => i.trim());
      const filteredInstructions = recipeData.instructions.filter(i => i.trim());

      // Append arrays as comma-separated strings
      formData.append('ingredients', filteredIngredients.join(','));
      formData.append('instructions', filteredInstructions.join(','));
      
      if (recipeData.tags.length > 0) {
        formData.append('tags', recipeData.tags.join(','));
      }

      const recipe = await createRecipe(formData);
      
      if (recipe) {
        toast.success('Recipe created successfully!');
        navigate(`/recipe/${recipe._id}`);
      }
    } catch (error) {
      console.error('Create recipe error:', error);
      if (error.message.includes('complete your profile')) {
        toast.error('Please complete your profile first');
        navigate('/complete-profile');
      } else {
        toast.error(error.message || 'Failed to create recipe');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Create New Recipe
          </h1>
          <p className="text-gray-600">
            Share your culinary masterpiece with the world
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-800">
                Recipe Photo
              </label>
              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Recipe Preview"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl flex items-center justify-center">
                    <label className="cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                      <input
                        type="file"
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/*"
                      />
                      Change Photo
                    </label>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-orange-200 rounded-xl p-8 text-center hover:border-orange-300 transition-colors">
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <label className="block">
                      <span className="sr-only">Choose recipe photo</span>
                      <input
                        type="file"
                        onChange={handleImageChange}
                        className="block w-full text-gray-500 text-sm
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-orange-50 file:text-orange-700
                          hover:file:bg-orange-100
                          cursor-pointer
                        "
                        accept="image/*"
                      />
                    </label>
                    <p className="text-sm text-gray-500">
                      Upload a high-quality photo of your recipe
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Basic Information */}
            <div className="divider divider-orange">
              <span className="text-lg font-semibold">Basic Information</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-medium">Recipe Title *</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={recipeData.title}
                  onChange={handleInputChange}
                  placeholder="Enter your recipe title"
                  required
                  className="input input-bordered input-orange focus:input-orange w-full"
                />
              </div>

              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text font-medium">Description *</span>
                </label>
                <textarea
                  name="description"
                  value={recipeData.description}
                  onChange={handleInputChange}
                  placeholder="Tell us about your recipe..."
                  required
                  rows={4}
                  className="textarea textarea-bordered textarea-orange focus:textarea-orange resize-none"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Category *</span>
                </label>
                <select
                  name="category"
                  value={recipeData.category}
                  onChange={handleInputChange}
                  required
                  className="select select-bordered select-orange focus:select-orange w-full"
                >
                  <option value="" disabled>Choose a category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Difficulty *</span>
                </label>
                <select
                  name="difficulty"
                  value={recipeData.difficulty}
                  onChange={handleInputChange}
                  required
                  className="select select-bordered select-orange focus:select-orange w-full"
                >
                  <option value="" disabled>Select difficulty</option>
                  {difficulties.map((difficulty, index) => (
                    <option key={index} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Cooking Time *</span>
                  <span className="label-text-alt">minutes</span>
                </label>
                <input
                  type="number"
                  name="cookingTime"
                  value={recipeData.cookingTime}
                  onChange={handleInputChange}
                  placeholder="30"
                  required
                  min="1"
                  className="input input-bordered input-orange focus:input-orange w-full"
                />
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="divider divider-orange">
              <span className="text-lg font-semibold">Ingredients</span>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Add your ingredients</span>
                <span className="label-text-alt">{recipeData.ingredients.filter(i => i.trim()).length} ingredient(s)</span>
              </label>
              <div className="space-y-3">
                {recipeData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <div className="badge badge-outline badge-orange text-xs font-medium min-w-8">
                      {index + 1}
                    </div>
                    <input
                      value={ingredient}
                      onChange={(e) => handleArrayChange(e, index, "ingredients")}
                      className="input input-bordered input-sm flex-grow focus:input-orange"
                      placeholder="e.g., 2 cups flour"
                    />
                    {index === recipeData.ingredients.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => addArrayItem("ingredients")}
                        className="btn btn-sm btn-orange"
                        disabled={ingredient.trim() === ""}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => deleteArrayItem("ingredients", index)}
                        className="btn btn-sm btn-error btn-outline"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions Section */}
            <div className="divider divider-orange">
              <span className="text-lg font-semibold">Instructions</span>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Step-by-step instructions</span>
                <span className="label-text-alt">{recipeData.instructions.filter(i => i.trim()).length} step(s)</span>
              </label>
              <div className="space-y-3">
                {recipeData.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="badge badge-orange text-white font-bold min-w-12 mt-3">
                      {index + 1}
                    </div>
                    <textarea
                      value={instruction}
                      onChange={(e) => handleArrayChange(e, index, "instructions")}
                      className="textarea textarea-bordered flex-grow focus:textarea-orange resize-none"
                      placeholder="Describe this step in detail..."
                      rows={3}
                    />
                    {index === recipeData.instructions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => addArrayItem("instructions")}
                        className="btn btn-sm btn-orange mt-3"
                        disabled={instruction.trim() === ""}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => deleteArrayItem("instructions", index)}
                        className="btn btn-sm btn-error btn-outline mt-3"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Tags Section */}
            <div className="divider divider-orange">
              <span className="text-lg font-semibold">Tags</span>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Add tags to help others find your recipe</span>
                <span className="label-text-alt">{recipeData.tags.length}/5 tags</span>
              </label>
              
              {recipeData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipeData.tags.map((tag, index) => (
                    <div key={index} className="badge badge-orange gap-2">
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleTagDelete(index)}
                        className="text-orange-200 hover:text-white"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  placeholder="e.g., vegetarian, quick, healthy"
                  className="input input-bordered input-orange focus:input-orange flex-grow"
                  disabled={recipeData.tags.length >= 5}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                />
                <button
                  type="button"
                  onClick={handleTagAdd}
                  className="btn btn-orange"
                  disabled={recipeData.tags.length >= 5 || !currentTag.trim()}
                >
                  Add Tag
                </button>
              </div>
              {recipeData.tags.length >= 5 && (
                <div className="label">
                  <span className="label-text-alt text-warning">Maximum 5 tags allowed</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 
                hover:from-orange-600 hover:to-orange-700 text-white 
                font-medium py-3 px-4 rounded-xl shadow-lg 
                hover:shadow-xl transition-all duration-200 flex 
                items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Create Recipe</span>
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            By creating a recipe, you agree to share it with our community
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipe;