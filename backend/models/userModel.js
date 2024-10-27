import mongoose, { Schema } from 'mongoose'; // Import Schema from mongoose
import bcrypt from 'bcrypt'; // Ensure you import bcrypt for password comparison

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    default: 'default_profile_image_url', // Placeholder URL or default avatar image
  },
  bio: {
    type: String,
    maxlength: 200,
  },
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  savedRecipes: [{
    type: Schema.Types.ObjectId,
    ref: 'Recipe',
  }],
  likedRecipes: [{
    type: Schema.Types.ObjectId,
    ref: 'Recipe',
  }],
  createdRecipes: [{
    type: Schema.Types.ObjectId,
    ref: 'Recipe',
  }],
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Method to compare the provided password with the hashed password
UserSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

// Export the User model
const User = mongoose.model('User', UserSchema);
export default User;
