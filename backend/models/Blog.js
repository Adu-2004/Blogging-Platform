///////////////////////////////////////
/*import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
            require:true
    },
    subTitle: {
        type:String,  
      
    },
    description:{
        type: String,
        require: true
    },
    category:{
        type: String,
        require: true
    },
    image: {
        type: String,
        require:true
    },
    isPublished: {
        type: Boolean,
        require: true
    },
   author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
} , {timestamps:true});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
*//*
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {type: String, required: true

    },
    subTitle: {type: String, required: true

    },
    description: {type: String, required: true

    },
    category: {type: String, required: true

    },
    image: {type: String, required: true

    },
    isPublished: {type: Boolean, required: true

    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
       required: false 
    },
    authorName: {
        type: String,
        required: false 
    },
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        userName: {
            type: String,
        //  required: true
        }
    }],
    likesCount: {
        type: Number,
        default: 0
    }
}, {timestamps: true});

const Blog = mongoose.model('blog', blogSchema);

export default Blog;
*/
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subTitle: { type: String },
  description: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  isPublished: { type: Boolean, required: true },
  // author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;