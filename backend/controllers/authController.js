import User from '../models/userModel.js'; // Assuming you have a User model
import { hashPassword, comparePassword } from '../utils/passwordUtils.js'; // Import utility functions
import jwt from 'jsonwebtoken';

// Register a new user
export const registerUser = async (req, res) => {
    try {
        const hashedPassword = await hashPassword(req.body.password);
        const newUser = new User({ ...req.body, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error registering user', error });
    }
};

// Login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Respond with token and user info
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                bio: user.bio,
            },
        });
    } catch (error) {
        console.error(error);  // Log error for debugging
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};


// Logout user
export const logoutUser = (req, res) => {
    // Handle logout logic here (e.g., clear token on client-side)
    res.status(200).json({ message: 'User logged out successfully' });
};
