import express from "express"
import { addBlog, addComment, checkUserLike, deleteBlogById, generateChatbot, generateContent, getAllBlogs, getBlogById, getBlogComments, getBlogLikes, toggleLike, togglePublish } from "../controllers/blogController.js";
import upload from "../utils/multer.js";
import auth from "../middleware/authMiddleware.js";
import generateChatResponse from "../controllers/chatController.js";

const blogRoutes = express.Router();

blogRoutes.post("/add", upload.single('image'),auth,addBlog);
blogRoutes.get('/all', getAllBlogs);
blogRoutes.get('/:blogId', getBlogById);
blogRoutes.post('/delete',auth, deleteBlogById);
blogRoutes.post('/toggle-publish',auth ,togglePublish);
blogRoutes.post('/add-comment', addComment);
blogRoutes.post('/comments', getBlogComments);
blogRoutes.post('/generate', auth, generateContent);
blogRoutes.post("/:blogId/like", auth, toggleLike);
blogRoutes.get("/:blogId/likes", getBlogLikes);
blogRoutes.get("/:blogId/check-like", auth, checkUserLike);
//blogRoutes.route("/get-own-blogs").get(auth,getOwnBlogs);
blogRoutes.post('/chatbot', generateChatResponse);



export default blogRoutes;