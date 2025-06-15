import User from '../models/userModel.js';

const checkProfileComplete = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if profile is complete
    if (!user.isProfileComplete) {
      return res.status(403).json({
        success: false,
        message: "Please complete your profile before creating recipes",
        redirect: "/complete-profile"
      });
    }

    next();
  } catch (error) {
    console.error('Profile check error:', error);
    res.status(500).json({
      success: false,
      message: "Error checking profile status",
      error: error.message
    });
  }
};

export default checkProfileComplete;
