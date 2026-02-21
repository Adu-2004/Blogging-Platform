import express from "express"
import { addBlog,
     addComment,
     deleteBlogById,
     generateContent,
     getAllBlogs, getBlogById,
     getBlogComments,
     toggleLike,
     togglePublish,
     getBlogs,
     likeBlog,
     getMyTotalBlogLikes,
     dislikeBlog,
     getBlogCommentsByAuthor,
     approveComment,
     addReply }  from "../controllers/blogController.js";
import upload from "../utils/multer.js";
import auth from "../middleware/authMiddleware.js";
import generateChatResponse from "../controllers/chatController.js";

const blogRoutes = express.Router();

blogRoutes.post("/add", upload.single('image'),auth,addBlog);
blogRoutes.get('/all', getAllBlogs);
blogRoutes.get('/my-blogs', auth, getBlogs);

blogRoutes.post('/delete',auth, deleteBlogById);
blogRoutes.post('/toggle-publish',auth ,togglePublish);
blogRoutes.post('/add-comment',auth, addComment);

blogRoutes.get('/my-blog-comments', auth, getBlogCommentsByAuthor);
blogRoutes.patch('/comment/:commentId/approve', auth, approveComment);

blogRoutes.get('/comments/:blogId', getBlogComments);
blogRoutes.post('/add-reply', auth, addReply);

blogRoutes.post('/generate', auth, generateContent);
blogRoutes.post("/:blogId/like", auth, toggleLike);

blogRoutes.post('/chatbot', generateChatResponse);

blogRoutes.get('/:id/like',auth,likeBlog);
blogRoutes.get('/:id/unlike',auth,dislikeBlog);
blogRoutes.get('/:id/check-like',auth,getMyTotalBlogLikes);
blogRoutes.get('/:blogId', getBlogById);



export default blogRoutes;
