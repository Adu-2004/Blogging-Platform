// import React, { useEffect, useState } from 'react';
// import toast from 'react-hot-toast';
// import { useAppContext } from '../context/AppContext';
// import BlogCard from '../components/BlogCard';
// import { blogCategories } from '../assets/assets';
// import { motion } from 'motion/react';

// const MyBlogs = () => {
//   const { axios, navigate, token } = useAppContext();

//   const [myBlogs, setMyBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [menu, setMenu] = useState('All');

//   useEffect(() => {
//     if (!token) {
//       navigate('/login');
//       return;
//     }
//     fetchMyBlogs();
//   }, [token]);

//   const fetchMyBlogs = async () => {
//     try {
//       setLoading(true);
//       const { data } = await axios.get('/api/blog/my-blogs');

//       if (data.success) {
//         setMyBlogs(data.blogs);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       if (error.response?.status === 401) {
//         toast.error('Please login to view your blogs');
//         navigate('/login');
//       } else {
//         toast.error(error.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter by selected category
//   const filteredBlogs = myBlogs.filter((blog) =>
//     menu === 'All' ? true : blog.category === menu
//   );

//   // ── Guard ──────────────────────────────────────────────────────
//   if (!token) return null;

//   // ── Loading ────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className='min-h-[60vh] flex items-center justify-center pl-120'>
//         <div className='flex flex-col items-center gap-3'>
//           <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
//           <p className='text-gray-400 text-sm'>Loading your blogs...</p>
//         </div>
//       </div>
//     );
//   }

//   // ── Empty State ────────────────────────────────────────────────
//   if (myBlogs.length === 0) {
//     return (
//       <div className='min-h-[60vh] flex flex-col items-center justify-center gap-4 pl-100'>
//         <p className='text-5xl'>📝</p>
//         <h2 className='text-xl font-semibold text-gray-800'>No blogs yet</h2>
//         <p className='text-gray-400 text-sm'>
//           You haven't written anything. Start your first post!
//         </p>
//         <button
//           onClick={() => navigate('/admin/addBlog')}
//           className='mt-2 px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition duration-300'
//         >
//           + Write a Blog
//         </button>
//       </div>
//     );
//   }

//   // ── Main ───────────────────────────────────────────────────────
//   return (
//     <div className='max-w-7xl mx-auto'>

//       <div className='flex justify-center gap-4 sm:gap-8 my-10 relative'>
//         {blogCategories.map((item) => (
//           <div key={item} className='relative'>
//             <button
//               onClick={() => setMenu(item)}
//               className={`cursor-pointer text-gray-500 ${
//                 menu === item && 'text-white px-4 pt-0.5'
//               }`}
//             >
//               {item}
//               {menu === item && (
//                 <motion.div
//                   layoutId='my-blogs-underline'
//                   transition={{ type: 'spring', stiffness: 500, damping: 30 }}
//                   className='absolute left-0 right-0 top-0 h-7 -z-1 bg-blue-700 rounded-full'
//                 />
//               )}
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Blog Cards — reuses your existing BlogCard */}
//       {filteredBlogs.length > 0 ? (
//         <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40'>
//           {filteredBlogs.map((blog) => (
//             <BlogCard key={blog._id} blog={blog} />
//           ))}
//         </div>
//       ) : (
//         <div className='flex flex-col items-center justify-center py-20 text-gray-400'>
//           <p className='text-4xl mb-3'>🔍</p>
//           <p className='text-sm'>No blogs in this category yet.</p>
//         </div>
//       )}

//     </div>
//   );
// };

// export default MyBlogs;

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';
import BlogCard from '../components/BlogCard';
import { blogCategories } from '../assets/assets';
import { motion } from 'motion/react';

const MyBlogs = () => {
  const { axios, navigate, token } = useAppContext();

  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState('All');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchMyBlogs();
  }, [token]);

  const fetchMyBlogs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/blog/my-blogs');
      if (data.success) {
        setMyBlogs(data.blogs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Please login to view your blogs');
        navigate('/login');
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = myBlogs.filter((blog) =>
    menu === 'All' ? true : blog.category === menu
  );

  if (!token) return null;

  // ── Loading ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className='min-h-[60vh] flex items-center justify-center'>
        <div className='flex flex-col items-center gap-3'>
          <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
          <p className='text-gray-400 text-sm'>Loading your blogs...</p>
        </div>
      </div>
    );
  }

  // ── Empty State ────────────────────────────────────────────────
  if (myBlogs.length === 0) {
    return (
      <div className='min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4'>
        <p className='text-5xl'>📝</p>
        <h2 className='text-xl font-semibold text-gray-800'>No blogs yet</h2>
        <p className='text-gray-400 text-sm text-center'>
          You haven't written anything. Start your first post!
        </p>
        <button
          onClick={() => navigate('/admin/addBlog')}
          className='mt-2 px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition duration-300'
        >
          + Write a Blog
        </button>
      </div>
    );
  }

  // ── Main ───────────────────────────────────────────────────────
  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-8'>

      {/* Category Filter */}
      <div className='flex flex-wrap justify-center gap-3 sm:gap-6 my-8'>
        {blogCategories.map((item) => (
          <div key={item} className='relative'>
            <button
              onClick={() => setMenu(item)}
              className={`cursor-pointer text-gray-500 text-sm sm:text-base ${
                menu === item && 'text-white px-4 pt-0.5'
              }`}
            >
              {item}
              {menu === item && (
                <motion.div
                  layoutId='my-blogs-underline'
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className='absolute left-0 right-0 top-0 h-7 -z-10 bg-blue-700 rounded-full'
                />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Blog Cards */}
      {filteredBlogs.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-24'>
          {filteredBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-20 text-gray-400'>
          <p className='text-4xl mb-3'>🔍</p>
          <p className='text-sm'>No blogs in this category yet.</p>
        </div>
      )}

    </div>
  );
};

export default MyBlogs;