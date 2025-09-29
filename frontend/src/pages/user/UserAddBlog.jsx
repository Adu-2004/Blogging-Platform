import React, { useEffect, useRef, useState } from 'react';
import { assets, blogCategories } from '../../assets/assets';
import Quill from 'quill';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { parse } from 'marked';
import 'quill/dist/quill.snow.css';
import './mobile-responsive.css'; 

const UserAddBlog = () => {
  const { axios, token, navigate } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [image, setImage] = useState(false);
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');
  const [category, setCategory] = useState('Startup');
  const [isPublished, setIsPublished] = useState(false);

  const generateContent = async () => {
    if (!title) return toast.error('Please enter a title');

    try {
      setLoading(true);
      const { data } = await axios.post(
        '/api/blog/generate',
        { prompt: title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (data.success) {
        quillRef.current.root.innerHTML = parse(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsAdding(true);

      if (!image) {
        toast.error("Please upload a thumbnail image");
        return;
      }

      const blog = {
        title,
        subTitle,
        description: quillRef.current.root.innerHTML,
        category,
        isPublished,
      };

      const formData = new FormData();
      formData.append('blog', JSON.stringify(blog));
      formData.append('image', image);

      const { data } = await axios.post('/api/user/add-blog', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        toast.success(data.message);
        setTitle('');
        setSubTitle('');
        setImage(false);
        setCategory('Startup');
        setIsPublished(false);
        if (quillRef.current) {
          quillRef.current.root.innerHTML = '';
        }
        setTimeout(() => {
          navigate('/user');
        }, 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['link', 'image', 'blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['clean']
          ],
        },
        placeholder: 'Write your blog here...',
        scrollingContainer: null
      });

      const style = document.createElement('style');
      style.innerHTML = `
        .ql-container {
          border: 1px solid #d1d5db !important;
          border-radius: 0.375rem !important;
          height: 300px !important;
        }
        .ql-toolbar {
          border: 1px solid #d1d5db !important;
          border-bottom: none !important;
          border-radius: 0.375rem 0.375rem 0 0 !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <form onSubmit={onSubmitHandler} className='flex-1 bg-blue-50/50 text-gray-600 h-full ml-6 overflow-y-auto'>
      <div className='bg-white w-full max-w-3xl p-4 md:p-6 sm:m-4 shadow rounded'>
        <p>Upload thumbnail</p>
        <label htmlFor="image">
          <img 
            src={!image ? assets.upload_area : URL.createObjectURL(image)} 
            alt="Blog thumbnail" 
            className='mt-2 h-16 rounded cursor-pointer'
          />
          <input 
            onChange={(e) => setImage(e.target.files[0])} 
            type="file" 
            id='image' 
            hidden 
            required 
            accept="image/*"
          />
        </label>

        <p className='mt-4'>Blog Title</p>
        <input 
          type="text" 
          placeholder='Type here' 
          required 
          className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded' 
          onChange={e => setTitle(e.target.value)} 
          value={title} 
        />

        <p className='mt-4'>Sub title</p>
        <input 
          type="text" 
          placeholder='Type here' 
          required 
          className='w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded' 
          onChange={e => setSubTitle(e.target.value)} 
          value={subTitle} 
        />

        <p className='mt-4'>Blog Description</p>
        <div className='max-w-lg h-96 pb-6 pt-2 relative'>
          <div ref={editorRef}></div>
          {loading && (
            <div className='absolute right-0 top-0 bottom-0 left-0 flex items-center justify-center bg-black/10 mt-2'>
              <div className='w-8 h-8 rounded-full border-2 border-t-white animate-spin'></div>
            </div>
          )}
          <button 
            disabled={loading} 
            type='button' 
            onClick={generateContent} 
            className='absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer'
          >
            Generate With AI
          </button>
        </div>

        <p className='blog-category-section'>Blog Category</p>
        <select 
          onChange={e => setCategory(e.target.value)}   
          name="category" 
          className='mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded'
        >
          <option value="">Select category</option>
          {blogCategories.map((item,index) => (
            <option key={index} value={item}>{item}</option>
          ))}
        </select>

        <div className='flex gap-2 mt-4'>
          <p>Publish Now</p>
          <input 
            type="checkbox" 
            checked={isPublished} 
            className='scale-125 cursor-pointer' 
            onChange={e => setIsPublished(e.target.checked)}
          />
        </div>

        <button 
          disabled={isAdding} 
          type='submit' 
          className='mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm'
        >
          {isAdding ? 'Adding...' : "Add Blog"}
        </button>
      </div>
    </form>
  );
};

export default UserAddBlog;