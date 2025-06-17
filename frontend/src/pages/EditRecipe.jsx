import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useRecipe from "../contexts/useRecipeContext";
import { toast } from "react-toastify";

const EditRecipe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getRecipeById, updateRecipe, deleteRecipe, loading } = useRecipe();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipe = await getRecipeById(id);
        setRecipeData(recipe);
        setImagePreview(recipe.image);
      } catch (error) {
        toast.error(error.message || "Failed to fetch recipe");
      }
    };

    fetchRecipe();
  }, [id, getRecipeById]);

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
      await updateRecipe(id, recipeData);
      toast.success("Recipe updated successfully");
      navigate("/recipes");
    } catch (error) {
      toast.error(error.message || "Failed to update recipe");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRecipe(id);
      toast.success("Recipe deleted successfully");
      navigate("/recipes");
    } catch (error) {
      toast.error(error.message || "Failed to delete recipe");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Delete Button */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Edit Recipe
          </h1>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete Recipe
          </button>
        </div>

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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Delete Recipe?
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this recipe? This action cannot be
                undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditRecipe;
