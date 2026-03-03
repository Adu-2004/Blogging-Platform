import jwt from 'jsonwebtoken'
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';


export const adminLogin = async (req, res) => {
    try{
        const {email, password} = req.body;

        if(email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.json({success:false, message: "Invalid Credentials"})
        }
        const token = jwt.sign({email},
                    process.env.JWT_SECRET,
                   { expiresIn: '7d' }
                );
        res.json({success: true, token});
    } catch(error) {
        res.json({success:false, message: error.message});
    }
}

export const getAllBlogsAdmin = async (req, res) => {
    try {
        const blogs = await Blog.find({})
        .sort({createAt : -1});
        res.json({success: true, blogs});
    } catch (error) {
        res.json({success:false, message: error.message});
    }
}

export const getAllComments = async (req, res) => {
  try {
    const authorId = req.user._id;  // ✅ get logged-in user

    // Step 1: Find only this author's blogs
    const authorBlogs = await Blog.find({ author: authorId }).select('_id');
    const blogIds = authorBlogs.map((b) => b._id);

    // Step 2: Find comments only on those blogs
    const comments = await Comment.find({ blog: { $in: blogIds } })
      .populate('userId', 'name')
      .populate('blog', 'title')
      .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export const getDashboard = async (req, res) => {
    try {
        const recentBlogs = await Blog.find({}).sort({createAt: -1}).limit(5);
        const blogs = await Blog.countDocuments();
        const comments = await Comment.countDocuments();
        const drafts = await Blog.countDocuments({isPublished: false});
        const dashboardData = {
            blogs, comments, drafts, recentBlogs
        }
           res.json({success: true, dashboardData});
     } catch (error) {
          res.json({success:false, message: error.message});
    }
}

export const deleteCommentById = async (req, res) => {
    try {
        const { id } = req.body;
        await Comment.findByIdAndDelete(id);
         res.json({success: true,message: "Comment deleted successfully"});
    } catch (error) {
        res.json({success:false, message: error.message});
    }
}

export const approveCommentById = async (req, res) => {
    try {
        const { id } = req.body;
        await Comment.findByIdAndUpdate(id, {isApproved: true});
         res.json({success: true,message: "Comment approved successfully"});
    } catch (error) {
        res.json({success:false, message: error.message});
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const toggleUserStatus = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        user.isActive = !user.isActive;
        await user.save();
        
        res.json({ 
            success: true, 
            message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully!` 
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.body;
        
        const userBlogs = await Blog.find({ author: userId });
        const blogIds = userBlogs.map(blog => blog._id);
        
        await Comment.deleteMany({ blog: { $in: blogIds } });
        await Blog.deleteMany({ author: userId });
        await User.findByIdAndDelete(userId);
        
        res.json({ success: true, message: "User and associated data deleted successfully!" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}