import express from "express";
import { adminLogin, approveCommentById, deleteCommentById, deleteUser, getAllBlogsAdmin, getAllComments, getAllUsers, getDashboard, toggleUserStatus } from "../controllers/adminController.js";
import auth from "../middleware/authMiddleware.js";
import { getBlogs } from "../controllers/blogController.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.get("/comments",auth, getAllComments);
adminRouter.get('/blogs', auth, getAllBlogsAdmin);
adminRouter.post('/delete-comment',auth, deleteCommentById);
adminRouter.post('/approve-comment', auth,approveCommentById);
adminRouter.get('/dashboard', auth,getDashboard);

//adminRouter.get('/Myblogs',auth, getBlogs);
adminRouter.get("/users", auth, getAllUsers);
adminRouter.post("/toggle-user-status", auth, toggleUserStatus);
adminRouter.post("/delete-user", auth, deleteUser);
export default adminRouter;