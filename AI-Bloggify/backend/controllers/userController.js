import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Blog from '../models/Blog.js';

export const userSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "All fields are required" });
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            });
        }

        if (password.length < 6) {
            return res.json({ success: false, message: "Password must be at least 6 characters long" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'user'
        });

        const token = jwt.sign(
            {  userId: user._id, email: user.email, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: "Account created successfully!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                 role: user.role
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        if (!user.isActive) {
            return res.json({ success: false, message: "Account is deactivated" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, name: user.name,role: user.role  },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                 role: user.role
            }
        });

    } catch (error) {
         console.error("Login error:", error);
        res.json({ success: false, message: error.message });
    }
};

export const getUserDashboard = async (req, res) => {
    try {
        const userId = req.user.userId;

        const userBlogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });
        const totalBlogs = await Blog.countDocuments({ author: userId });
        const publishedBlogs = await Blog.countDocuments({ author: userId, isPublished: true });
        const draftBlogs = await Blog.countDocuments({ author: userId, isPublished: false });

        const dashboardData = {
            totalBlogs,
            publishedBlogs,
            draftBlogs,
            recentBlogs: userBlogs.slice(0, 5)
        };

        res.json({ success: true, dashboardData });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getUserBlogs = async (req, res) => {
    try {
      const userId = req.user.userId;
      const blogs = await Blog.find({ author: userId })
        .sort({ createdAt: -1 })
        .select('-description');
      res.json({ success: true, blogs });
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  };

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name } = req.body;

        if (!name) {
            return res.json({ success: false, message: "Name is required" });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { name },
            { new: true, runValidators: true }
        ).select('-password');

        res.json({ success: true, message: "Profile updated successfully!", user });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};