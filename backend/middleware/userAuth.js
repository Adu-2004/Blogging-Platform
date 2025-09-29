import jwt from "jsonwebtoken";
import User from "../models/User.js";

const userAuth = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token provided"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded.userId) {
            return res.status(403).json({
                success: false,
                message: "Invalid user token"
            });
        }

        const user = await User.findById(decoded.userId);
        if (!user || !user.isActive) {
            return res.status(403).json({
                success: false,
                message: "User not found or inactive"
            });
        }

        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({
            success: false,
            message: "Invalid token!"
        });
    }
}

export default userAuth;