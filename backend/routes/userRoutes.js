import express from 'express';
import { 
    userSignup, 
    userLogin, 
    getUserDashboard, 
    getUserBlogs, 
    getUserProfile, 
    updateUserProfile 
} from '../controllers/userController.js';
import { addBlog, deleteBlogById, togglePublishById } from '../controllers/blogController.js';
import upload from '../utils/multer.js';
import auth from '../middleware/auth.js';

const userRouter = express.Router();

// Authentication routes
userRouter.post('/signup', userSignup);
userRouter.post('/login', userLogin);

// Protected routes
userRouter.get('/dashboard', auth, getUserDashboard);
userRouter.get('/blogs', auth, getUserBlogs);
userRouter.get('/profile', auth, getUserProfile);
userRouter.put('/profile', auth, updateUserProfile);

// Blog management for users
userRouter.post('/add-blog', upload.single('image'), auth, addBlog);
userRouter.patch('/blogs/:blogId/toggle-publish', auth, togglePublishById);
userRouter.delete('/blogs/:blogId', auth, deleteBlogById);

export default userRouter;