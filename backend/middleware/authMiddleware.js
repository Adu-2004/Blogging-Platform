import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }
    
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : authHeader;
      
    if (!token) {
      return res.status(401).json({ success: false, message: "Token missing" });
    }
    
    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log("Decoded token:", decoded);
    
    // ✅ Fetch user from database using userId from token
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    
    //console.log("User found in DB:", user);
    
    // ✅ Set complete user object
    req.user = user;
    req.id = user._id;
    
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ 
      success: false, 
      message: "Invalid or expired token",
      error: error.message 
    });
  }
};

export default auth;

