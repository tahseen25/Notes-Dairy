const jwt = require("jsonwebtoken");
const User = require("../models/user-model");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized. Token not provided." });
  }

  const jwtToken = token.replace("Bearer", "").trim();
  

  try {
    const secretKey = process.env.JWT_KEY;
    if (!secretKey) {
      throw new Error("JWT secret key not set.");
    }

    const decoded = jwt.verify(jwtToken, secretKey);
   

    const user = await User.findOne({ email: decoded.email }).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: "Unauthorized. User not found." });
    }

    req.token = token;
    req.user = user;
    req.userID = user._id;

    next();
  } catch (error) {
  
    return res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
};

module.exports = authMiddleware;
