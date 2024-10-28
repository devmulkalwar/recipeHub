import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
	const token = req.cookies?.token;
	console.log("Cookies:", req.cookies);
	console.log("Token:", token);

	if (!token) {
		return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		console.log("Decoded Token:", decoded);

		if (!decoded) {
			return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
		}

		req.userId = decoded.userId;
		next();
	} catch (error) {
		console.log("Error in verifyToken", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
};

export default verifyToken;
