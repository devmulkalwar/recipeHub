import mongoose from 'mongoose';
import Comment from './commentModel.js'; // Import the Comment model

// Define the Recipe schema
const RecipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    ingredients: {
        type: [String],
        required: true,
    },
    instructions: {
        type: String,
        required: true,
    },
    likes: {
        type: Number,
        default: 0, // Default number of likes
    },
    comments: [Comment.schema], // Use the Comment schema
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Reference to the User model (recipe creator)
        required: true, 
    },
    // Additional fields can be added here...
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Export the Recipe model
export default mongoose.model('Recipe', RecipeSchema);
