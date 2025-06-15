const checkProfileComplete = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user.isProfileComplete) {
      return res.status(403).json({
        success: false,
        message: "Please complete your profile first"
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking profile status"
    });
  }
};

export default checkProfileComplete;
