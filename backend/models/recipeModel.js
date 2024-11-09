import mongoose from 'mongoose';

const { Schema } = mongoose;

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    categoryImage: {
      type: String,
      required: true,
    },
    cookingTime: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    ingredients: [{
      type: String,
      required: true,
    }],
    instructions: [{
      type: String,
      required: true,
    }],
    likes: {
      type: Number,
      default: 0,
    },
    comments: [{
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    tags: [{
      type: String,
      required: true,
    }],
  },
  {
    timestamps: true,  // Automatically manage createdAt and updatedAt fields
  }
);

// Create a method to populate `createdByDetails` dynamically
recipeSchema.methods.populateCreatedByDetails = function () {
  return this.populate('createdBy', 'username profileImage');
};

export default mongoose.model('Recipe', recipeSchema);
