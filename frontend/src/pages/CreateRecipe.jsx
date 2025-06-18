import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useRecipe from '../contexts/useRecipeContext';
import { toast } from 'react-toastify';
import { validateImageFile } from "../utils/fileValidation";

const MAX_TAGS = 5;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const CreateRecipe = () => {
  const navigate = useNavigate();
  const { createRecipe } = useRecipe();
  const [submitting, setSubmitting] = useState(false);
  const newIngredientRef = useRef(null);
  const newInstructionRef = useRef(null);

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
  const [errors, setErrors] = useState({});

  // Form field configurations
  const categories = [
    "Appetizer", "Main Course", "Dessert", 
    "Salad", "Soup", "Beverage", "Snack"
  ];
  const difficulties = ["Easy", "Medium", "Hard"];

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    const requiredFields = ['title', 'description', 'category', 'cookingTime', 'difficulty'];
    requiredFields.forEach(field => {
      if (!recipeData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });

    // Array field validation
    if (!recipeData.ingredients.some(i => i.trim())) {
      newErrors.ingredients = 'At least one ingredient is required';
    }
    if (!recipeData.instructions.some(i => i.trim())) {
      newErrors.instructions = 'At least one instruction is required';
    }

    // Image validation
    if (!recipeData.image) {
      newErrors.image = 'Recipe image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipeData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleArrayChange = (e, index, field) => {
    const { value } = e.target;
    setRecipeData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    const items = recipeData[field];
    const lastItem = items[items.length - 1];
    
    if (lastItem.trim()) {
      setRecipeData(prev => ({
        ...prev,
        [field]: [...prev[field], ""]
      }));
      
      // Focus new input after render
      setTimeout(() => {
        if (field === 'ingredients' && newIngredientRef.current) {
          newIngredientRef.current.focus();
        } else if (field === 'instructions' && newInstructionRef.current) {
          newInstructionRef.current.focus();
        }
      }, 0);
    }
  };

  const deleteArrayItem = (field, index) => {
    if (recipeData[field].length > 1) {
      setRecipeData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validation = validateImageFile(file, MAX_IMAGE_SIZE);
      if (!validation.isValid) {
        toast.error(validation.error);
        return;
      }

      setRecipeData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearImagePreview = () => {
    setImagePreview(null);
    setRecipeData(prev => ({ ...prev, image: null }));
  };

  const handleTagAdd = (e) => {
    e.preventDefault();
    if (currentTag.trim() && recipeData.tags.length < MAX_TAGS) {
      const normalizedTag = currentTag.trim().toLowerCase();
      if (recipeData.tags.includes(normalizedTag)) {
        toast.error('This tag already exists');
        return;
      }
      setRecipeData(prev => ({
        ...prev,
        tags: [...prev.tags, normalizedTag]
      }));
      setCurrentTag("");
    }
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd(e);
    }
  };

  const handleTagDelete = (indexToDelete) => {
    setRecipeData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, index) => index !== indexToDelete)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      
      // Add basic fields
      formData.append('title', recipeData.title);
      formData.append('description', recipeData.description);
      formData.append('category', recipeData.category);
      formData.append('cookingTime', recipeData.cookingTime);
      formData.append('difficulty', recipeData.difficulty);
      
      // Add arrays as JSON strings
      formData.append('ingredients', JSON.stringify(
        recipeData.ingredients.filter(i => i.trim())
      ));
      formData.append('instructions', JSON.stringify(
        recipeData.instructions.filter(i => i.trim())
      ));
      formData.append('tags', JSON.stringify(recipeData.tags));
      
      // Add image
      formData.append('recipeImage', recipeData.image);

      const recipe = await createRecipe(formData);
      toast.success('Recipe created successfully!');
      navigate(`/recipe/${recipe._id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to create recipe');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-6 px-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Create New Recipe
          </h1>
          <p className="text-gray-600">
            Share your culinary masterpiece with the world
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload Section */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-gray-800">Recipe Photo</label>
              {imagePreview ? (
                <div className="relative group rounded-xl overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Recipe Preview"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
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
                    <label className="block cursor-pointer">
                      <input
                        type="file"
                        onChange={handleImageChange}
                        className="hidden"
                        accept="image/*"
                      />
                      <span className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                        Choose Photo
                      </span>
                    </label>
                    <p className="text-sm text-gray-500">
                      Upload a high-quality photo of your recipe (Max 5MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Basic Info Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipe Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={recipeData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Give your recipe a catchy title"
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
                    placeholder="Share the story behind your recipe, its unique features, or any special tips..."
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 
                      bg-white resize-none transition-colors duration-200 text-gray-800 placeholder-gray-400
                      hover:border-orange-300"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                  )}
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
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                  )}
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
                  {errors.difficulty && (
                    <p className="text-red-500 text-sm mt-1">{errors.difficulty}</p>
                  )}
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
                  {errors.cookingTime && (
                    <p className="text-red-500 text-sm mt-1">{errors.cookingTime}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Ingredients
              </h2>
              
              <div className="space-y-3">
                {recipeData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-8 h-8 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full font-medium">
                      {index + 1}
                    </span>
                    <input
                      value={ingredient}
                      onChange={(e) => handleArrayChange(e, index, "ingredients")}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder="Add an ingredient"
                    />
                    {index === recipeData.ingredients.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => addArrayItem("ingredients")}
                        className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        disabled={!ingredient.trim()}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => deleteArrayItem("ingredients", index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Instructions
              </h2>
              
              <div className="space-y-3">
                {recipeData.instructions.map((instruction, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-8 h-8 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full font-medium">
                      {index + 1}
                    </span>
                    <input
                      value={instruction}
                      onChange={(e) => handleArrayChange(e, index, "instructions")}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      placeholder={`Step ${index + 1}: Describe this step...`}
                      ref={index === recipeData.instructions.length - 1 ? newInstructionRef : null}
                    />
                    {index === recipeData.instructions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => addArrayItem("instructions")}
                        className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        disabled={!instruction.trim()}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => deleteArrayItem("instructions", index)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.instructions && (
                <p className="text-red-500 text-sm mt-1">{errors.instructions}</p>
              )}
            </div>

            {/* Tags Section - similar styling pattern */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Tags
              </h2>
              
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
                    onKeyPress={handleTagKeyPress}
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Creating Recipe...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Create Recipe</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipe;