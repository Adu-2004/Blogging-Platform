import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';
import Loader from '../../components/Loader';
import Navbar from '../../components/Navbar';
import UserSidebar from '../../components/user/UserSidebar';

const UserBlogs = () => {
  const { axios, token } = useAppContext();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get('/api/user/blogs', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (data.success) {
          setBlogs(data.blogs);
        } else {
          throw new Error(data.message || 'Failed to load blogs');
        }
      } catch (error) {
        toast.error(error.message);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('token');
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [axios, navigate, token]);

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row min-h-screen bg-blue-50/50">
        <UserSidebar />
        <div className="flex-1 p-4 md:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-blue-50/50">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-0">My Blogs</h1>
            <Link
              to="/user/add-blog"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Blog
            </Link>
          </div>

          <div className="bg-blue-50/50 rounded-lg shadow overflow-hidden ">
            <div className="md:hidden">
              {blogs.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {blogs.map((blog) => (
                    <div key={blog._id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-base font-medium text-gray-900">{blog.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{blog.subTitle}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          blog.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {blog.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </div>
                      <div className="mt-3 flex space-x-3">
                        <Link
                          to={`/blog/${blog._id}`}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View
                        </Link>
                        <Link
                          to={`/user/edit-blog/${blog._id}`}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6">
                  <svg className="w-10 h-10 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 mb-3">No blogs yet. Start writing your first blog!</p>
                  <Link
                    to="/user/add-blog"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Blog
                  </Link>
                </div>
              )}
            </div>

            <table className="hidden md:table min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <tr key={blog._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                      <div className="text-sm text-gray-500">{blog.subTitle}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        blog.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/blog/${blog._id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBlogs;