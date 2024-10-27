import mongoose from 'mongoose';

// Define the Comment schema
const CommentSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    text: { 
        type: String, 
        required: true 
    },
},{
    timestamps: true, 
});

// Export the Comment model
const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;
