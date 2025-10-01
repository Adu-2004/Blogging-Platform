
/*
export const addBlog = async (req, res) => {
    try{
        const {title, subTitle, description, category, isPublished} = JSON.parse
        (req.body.blog);
        const imageFile = req.file;

        //Check if all fields are present
        if(!title || !description || !category || !imageFile) {
            return res.json({success:false, message: "Missing required fields" })
        }
    }catch(error) {

    }
}
    */

// controllers/blogController.js
/*
import Blog from '../models/Blog.js';  // Adjust path as needed
import cloudinary from '../utils/cloudinary.js'; // Your Cloudinary config file

// Upload blog image and create a blog post
export const addBlog = async (req, res) => {
  try {
     const {title, subTitle, description, category, isPublished} = JSON.parse(req.body.blog);
    const imageFile = req.file;
    if (!title || !description || !category || !imageFile) {
      return res.status(400).json({ success:false, message: 'Image file is required' });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(imageFile.path, {
      folder: 'Blogimages',
    });

    // Create blog post in database
    const newBlog = new Blog({
      title: req.body.title,
      subTitle: req.body.subTitle,
      description: req.body.description,
      category: req.body.category,
      image: result.secure_url,     // Store Cloudinary URL here
      isPublished: req.body.isPublished,
    });

    await newBlog.save();

    res.status(201).json({
      message: 'Blog post created successfully',
      blog: newBlog,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create blog post', error: error.message });
  }
};
*/
// Additional controllers like getPosts, updatePost etc. can be added here
//////////////////////////////////////////////////////////////////
import Blog from '../models/Blog.js';
import cloudinary from '../utils/cloudinary.js';
import Comment from '../models/Comment.js';
import main from '../utils/gemini.js';


export const addBlog = async (req, res) => {
  try {
      console.log("User from auth middleware:", req.user);
      console.log("Author ID passed:", req.user.userId);

    // Parse blog fields from JSON sent as string in req.body.blog
    const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
    const imageFile = req.file;

    if (!title || !description || !category || !imageFile) {
      return res.status(400).json({ success: false, message: 'All required fields including image are needed' });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(imageFile.path, {
      folder: 'Blogimages',
    });

    // Create blog post in database using destructured variables
    const newBlog = new Blog({
      title,
     subTitle,
      description,
      category,
      image: result.secure_url,  // Cloudinary image URL
      isPublished,
    //  author: req.user, //|| req.user._id,,
    //  likes: [] 
  /* title: req.body.title,
      subTitle: req.body.subTitle,
      description: req.body.description,
      category: req.body.category,
      image: result.secure_url,
      isPublished: req.body.isPublished,
      author: req.user.id, // <-- Set author here from authenticated user
      likes: []  */
    });
///////////
   /*  if (req.user && req.user.userId) {
            blogData.author = req.user.userId;
            blogData.authorName = req.user.name;
        }
*/
/////////////
    await newBlog.save();

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
      //  .populate('author', 'name')
         // .select('title subTitle description category image isPublished author authorName likesCount createdAt updatedAt')
         //   .sort({ createdAt: -1 });
          const formattedBlogs = blogs.map(blog => ({
       ...blog.toObject(),
          authorName: blog.author?.name || blog.authorName || 'Admin'
      }));
        res.json({success: true, blogs:formattedBlogs})
    }catch (error) {
          res.json({success: false, message: error.message });
    }
}

export const getBlogById = async (req, res) => {
    try{
        const {blogId} = req.params;
        const blog = await Blog.findById(blogId); //.populate('author', 'name');
        if(!blog){
           return res.json({ success:false ,message: 'Blog not found' });
        }
          res.json({success: true, blog});
    }catch (error) {
         res.json({success:false,message: error.message });
    }
}

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
}

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
}

export const addComment = async (req, res) => {
  try{
       const { blog, name, content } = req.body;
       await Comment .create({blog, name, content});
        res.json({success: true, message:"Comment added for review"})
  }catch(error){
      res.json({success: false, message:error.message})
  }
}

export const getBlogComments = async (req, res) => {
  try {
      const {blogId} = req.body;
      const comments = await Comment.find({blog: blogId, isApproved: true}).sort({createAt: -1});
  //  const comments = await Comment.find().populate({ path: 'author', strictPopulate: false });

      res.json({success: true, comments})
  } catch (error) {
    res.json({success: false, message: error.message})
  }
}

export const generateContent = async (req, res) => {
    try {
       const { prompt } = req.body;
       const content = await main(prompt + 'Generate a blog content for this topic in simple text format');
       res.json({success: true,content})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

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
}

/////////////////////

export const getBlogs = async (req, res) => {
  try {
    const userId = req.id;
      //const blogs = await Blog.find({ author: token }).populate('author', 'username').sort({ createdAt: -1 });
    const blogs = await Blog.find({ author: userId }).sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};






/////////////////////////////////////////////
/*
export const deleteBlogById = async (req, res) => {
    try {
        const { blogId } = req.params;
        
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.json({success: false, message: "Blog not found"});
        }

        const isAdmin = !req.user.userId; 
        const isAuthor = req.user.userId && blog.author && blog.author.toString() === req.user.userId;

        if (!isAdmin && !isAuthor) {
            return res.json({success: false, message: "Unauthorized to delete this blog"});
        }

        await Blog.findByIdAndDelete(blogId);
        await Comment.deleteMany({ blog: blogId });

        res.json({success: true, message: "Blog deleted successfully"});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}
*/
export const toggleLike = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.user?.userId;
        const userName = req.user?.name;

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

export const getBlogLikes = async (req, res) => {
    try {
        const { blogId } = req.params;
        
        const blog = await Blog.findById(blogId)
            .select('likes likesCount')
            .populate('likes.user', 'name');

        if (!blog) {
            return res.json({ success: false, message: "Blog not found" });
        }

        res.json({ 
            success: true, 
            likes: blog.likes,
            likesCount: blog.likesCount 
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const checkUserLike = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.user?.userId;

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
}
/*
export const getOwnBlogs = async(req,res) =>{
    try {
        const userId = req.user;

        if(!userId){
            return res.status(400).json({message:"User ID is required."});
        }

      const blogs = await Blog.find({author: userId}).populate({
        path:'author',
        select:'email'
      }).populate({
        path :'comments',
        sort:{createAt: -1},
        populate:{
            path:'userId',
            select:'email'
        }
      });
      
      if(!blogs) {
        return res.status(404).json({message:"NO blogs found", blogs:[],success:false});
      }
     return res.status(200).json({blogs, success:true});
    } catch (error) {
     res.status(500).json({message:"Error featching blogs", error: error.message});
    }
}

*/
