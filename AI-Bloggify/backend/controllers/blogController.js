
import Blog from '../models/Blog.js';
import cloudinary from '../utils/cloudinary.js';
import Comment from '../models/Comment.js';
import main from '../utils/gemini.js';


export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
    const imageFile = req.file;

    if (!title || !description || !category || !imageFile) {
      return res.status(400).json({ success: false, message: 'All required fields including image are needed' });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(imageFile.path, {
      folder: 'Blogimages',
    });
   const newBlog = await Blog.create({  // ADD: 'newBlog =' var
  title,
  subTitle,
  description,
  category,
  image: result.secure_url,
  isPublished,
  author: req.user._id,   
 //authorName: req.user.email.split('@')[0] || 'Admin'   // ADD: your requested author name [cite:10]
});
   
    res.json({
        success: true, message: 'Blog post created successfully',
       blog: newBlog,
    });
  } catch (error) {
    res.json({ success: false ,message: 'Failed to create blog post', error: error.message });
  }
};

export const getAllBlogs = async(req, res) => {
    try{
        const blogs = await Blog.find({isPublished: true})
      .populate('author', 'name')
      .select('title subTitle description category image isPublished author authorName likesCount createdAt updatedAt')
      .sort({ createdAt: -1 });
          const formattedBlogs = blogs.map(blog => ({
       ...blog.toObject(),
          authorName: blog.author?.name || blog.authorName || 'Admin'
      }));
        res.json({success: true, blogs:formattedBlogs})
    }catch (error) {
          res.json({success: false, message: error.message });
    }
};

export const getBlogById = async (req, res) => {
    try{
        const {blogId} = req.params;
        const blog = await Blog.findById(blogId).populate('author', 'name');
        if(!blog){
           return res.json({ success:false ,message: 'Blog not found' });
        }
          res.json({success: true, blog});
    }catch (error) {
         res.json({success:false,message: error.message });
    }
};

export const deleteBlogById = async (req, res) => {
    try{
        const { id } = req.body;
       const blog = await Blog.findById(id);
        if (!blog) {
            return res.json({success: false, message: "Blog not found"});
        }

        const isAdmin = !req.user.userId;
        const isAuthor = req.user.userId && blog.author && blog.author.toString() === req.user.userId;

        if (!isAdmin && !isAuthor) {
            return res.json({success: false, message: "Unauthorized to delete this blog"});
        }
      
      
        await Blog.findByIdAndDelete(id);

        //Delete all comment with Blog
        await Comment.deleteMany({blog: id});   

            res.json({ success:true ,message: 'Blog deleted successfully'});        
    }catch (error) {
         res.json({ success: false, message: error.message });
    }
};

export const togglePublish = async (req, res) => {
    try{
        const { id } = req.body;
        const blog = await Blog.findById(id);
          if (!blog) {
            return res.json({success: false, message: "Blog not found"});
        }

        const isAdmin = !req.user.userId;
        const isAuthor = req.user.userId && blog.author && blog.author.toString() === req.user.userId;

        if (!isAdmin && !isAuthor) {
            return res.json({success: false, message: "Unauthorized to modify this blog"});
        }
         blog.isPublished = !blog.isPublished;
        await blog.save();
        res.json({success: true, message: "Blog status updated"});
    }catch (error) { 
        res.json({success: false, message:error.message})
    }
};

export const addComment = async (req, res) => {
  try{
       const { blog, content } = req.body;
       await Comment .create({blog, content,userId: req.user._id});
        res.json({success: true, message:"Comment added for review"})
  }catch(error){
      res.json({success: false, message:error.message})
  }
};

export const getBlogComments = async (req, res) => {
  try {
    
      const { blogId } = req.params;
const comments = await Comment.find({ blog: blogId, isApproved: true })
.populate('userId', 'name') 
.populate('replies.userId', 'name') 
.sort({ createdAt: -1 });   
//console.log("populated comments:", JSON.stringify(comments, null, 2));     // ✅ only fetches name
     

      res.json({success: true, comments})
  } catch (error) {
    res.json({success: false, message: error.message})
  }
};

export const generateContent = async (req, res) => {
    try {
       const { prompt } = req.body;
       const content = await main(prompt + 'Generate a blog content for this topic in simple text format');
       res.json({success: true,content})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
};

export const generateChatbot = async (req, res) => {
    try {
       const { prompt } = req.body;
       const content = await main(prompt + 'Give me answer of this!');
       
       // If response.text is object, convert to string or extract text field
       const replyText = typeof content === 'string' ? content : JSON.stringify(content);

       res.json({ success: true, content: replyText });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getBlogs = async (req, res) => {
  try {
    
    
    // ✅ TRY ALL POSSIBLE USER ID FIELDS
       const userId = req.user._id;

    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Please login first - no user ID found' });
    }

    const blogs = await Blog.find({ author: userId })
      .populate('author', 'name')
      .sort({ createdAt: -1 });
      
    
    res.json({ success: true, blogs });
  } catch (error) {
    console.log("❌ ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleLike = async (req, res) => {
    try {
          const { blogId } = req.params;
          const userId = req.user._id;     // ✅ was req.user?.userId
          const { userName } = req.body;

        if (!userId || !userName) {
            return res.json({ success: false, message: "Please login to like blogs" });
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }

        const existingLikeIndex = blog.likes.findIndex(like => like.user.toString() === userId);

        if (existingLikeIndex !== -1) {
            blog.likes.splice(existingLikeIndex, 1);
            blog.likesCount = Math.max(0, blog.likesCount - 1);
            await blog.save();
            
            res.json({ 
                success: true, 
                message: "Blog unliked", 
                liked: false,
                likesCount: blog.likesCount 
            });
        } else {
            blog.likes.push({ user: userId, userName: userName });
            blog.likesCount = blog.likesCount + 1;
            await blog.save();
            
            res.json({ 
                success: true, 
                message: "Blog liked", 
                liked: true,
                likesCount: blog.likesCount 
            });
        }

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
   

export const checkUserLike = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.id;

        if (!userId) {
            return res.json({ success: true, liked: false, likesCount: 0 });
        }

        const blog = await Blog.findById(blogId).select('likes likesCount');
        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }

        const isLiked = blog.likes.some(like => like.user.toString() === userId);
        
        res.json({ 
            success: true, 
            liked: isLiked,
            likesCount: blog.likesCount 
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const togglePublishById = async (req, res) => {
    try {
        const { blogId } = req.params;
        
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.json({success: false, message: "Blog not found"});
        }

        const isAdmin = !req.user.userId;
        const isAuthor = req.user.userId && blog.author && blog.author.toString() === req.user.userId;

        if (!isAdmin && !isAuthor) {
            return res.json({success: false, message: "Unauthorized to modify this blog"});
        }

        blog.isPublished = !blog.isPublished;
        await blog.save();
        res.json({success: true, message: "Blog Status Updated"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};
///////////////////////////////////////////////////////////////////////////
export const likeBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const likeKrneWalaUserKiId = req.id;
        const blog = await Blog.findById(blogId).populate({path:'likes'});
        if (!blog) return res.status(404).json({ message: 'Blog not found', success: false })

        // Check if user already liked the blog
        // const alreadyLiked = blog.likes.includes(userId);

        //like logic started
        await blog.updateOne({ $addToSet: { likes: likeKrneWalaUserKiId } });
        await blog.save();


        return res.status(200).json({ message: 'Blog liked', blog, success: true });
    } catch (error) {
        console.log(error);

    }
}

export const dislikeBlog = async (req, res) => {
    try {
        const likeKrneWalaUserKiId = req.id;
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId);
        if (!blog) return res.status(404).json({ message: 'post not found', success: false })

        //dislike logic started
        await blog.updateOne({ $pull: { likes: likeKrneWalaUserKiId } });
        await blog.save();

        return res.status(200).json({ message: 'Blog disliked', blog, success: true });
    } catch (error) {
        console.log(error);

    }
}

export const getMyTotalBlogLikes = async (req, res) => {
    try {
      const userId = req.id; // assuming you use authentication middleware
  
      // Step 1: Find all blogs authored by the logged-in user
      const myBlogs = await Blog.find({ author: userId }).select("likes");
  
      // Step 2: Sum up the total likes
      const totalLikes = myBlogs.reduce((acc, blog) => acc + (blog.likes?.length || 0), 0);
  
      res.status(200).json({
        success: true,
        totalBlogs: myBlogs.length,
        totalLikes,
      });
    } catch (error) {
      console.error("Error getting total blog likes:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch total blog likes",
      });
    }
  };

export const getBlogCommentsByAuthor = async (req, res) => {
  try {
    const authorId = req.user._id; // logged-in user

    // Step 1: Find all blogs that belong to this author
    const authorBlogs = await Blog.find({ author: authorId }).select('_id');

    if (!authorBlogs.length) {
      return res.json({ success: false, message: "No blogs found for this author" });
    }

    // Extract blog IDs
    const blogIds = authorBlogs.map(blog => blog._id);

    // Step 2: Find all approved comments on those blogs
    const comments = await Comment.find({ 
      blog: { $in: blogIds }, 
      isApproved: true 
    })
    .populate('blog', 'title') // shows which blog the comment belongs to
    .select('name content blog createdAt')
    .sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const approveComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { isApproved: true },
      { new: true }
    );

    if (!comment) {
      return res.json({ success: false, message: "Comment not found" });
    }

    res.json({ success: true, message: "Comment approved", comment });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
//////////////////////New comment ?/////////////////////////////
export const addReply = async (req, res) => {
  try {
    const { commentId, content } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.json({ success: false, message: "Comment not found" });

    comment.replies.push({ userId: req.user._id, content });
    await comment.save();

    res.json({ success: true, message: "Reply added" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};