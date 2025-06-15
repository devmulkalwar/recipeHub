import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "default_profile_image_url", 
    },
    bio: {
      type: String,
      maxlength: 200,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    savedRecipes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
    likedRecipes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    createdRecipes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true
    },
    verificationToken: {
      type: String,
      select: false // Don't include in default queries
    },
    verificationTokenExpiresAt: {
      type: Date,
      select: false // Don't include in default queries
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
    isProfileComplete: {
      type: Boolean,
      default: false
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Remove the conflicting virtual since we're using a real field
UserSchema.pre('save', function(next) {
  // Update isProfileComplete based on required fields
  this.isProfileComplete = !!(this.name && this.username && this.profileImage);
  
  // Handle verification fields
  if (this.isVerified) {
    this.verificationToken = undefined;
    this.verificationTokenExpiresAt = undefined;
  }
  next();
});

const User = mongoose.model("User", UserSchema);
export default User;
