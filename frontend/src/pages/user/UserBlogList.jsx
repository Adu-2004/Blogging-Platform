import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const UserBlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { axios, token, navigate } = useAppContext();

    const fetchUserBlogs = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/user/blogs", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (data.success) {
                setBlogs(data.blogs);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching user blogs:', error);
            toast.error(error.response?.data?.message || 'Failed to load blogs');
        } finally {
            setLoading(false);
        }
    };

    const togglePublishStatus = async (blogId, currentStatus) => {
        try {
            const { data } = await axios.patch(
                `/api/user/blogs/${blogId}/toggle-publish`,
                { isPublished: !currentStatus },
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            
            if (data.success) {
                toast.success(data.message);
                fetchUserBlogs();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update blog status');
        }
    };

    const deleteBlog = async (blogId) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return;
        
        try {
            const { data } = await axios.delete(`/api/user/blogs/${blogId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (data.success) {
                toast.success(data.message);
                fetchUserBlogs();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete blog');
        }
    };

    useEffect(() => {
        fetchUserBlogs();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-900">My Blogs</h1>
                <Link
                    to="/user/add-blog"
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                    Add New Blog
                </Link>
            </div>

            {blogs.length === 0 ? (
                <div className="bg-white p-6 sm:p-8 rounded-lg shadow text-center">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs yet</h3>
                    <p className="text-gray-500 mb-4">Start writing your first blog post</p>
                    <Link
                        to="/user/add-blog"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Create Your First Blog
                    </Link>
                </div>
            ) : (
                <div className="bg-blue/50 rounded-lg shadow overflow-hidden">
                <div className="md:hidden space-y-4 p-4">
                  {blogs.map((blog) => (
                    <div key={blog._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{blog.title}</h3>
                          <p className="text-sm text-gray-500 truncate">{blog.subTitle}</p>
                        </div>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 whitespace-nowrap ml-2">
                          {blog.category}
                        </span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3 gap-2">
                        <div className="flex flex-wrap gap-2">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            blog.isPublished 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {blog.isPublished ? 'Published' : 'Draft'}
                          </span>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => navigate(`/blog/${blog._id}`)}
                            className="text-blue-600 hover:text-blue-900 text-sm whitespace-nowrap"
                          >
                            View
                          </button>
                          <button
                            onClick={() => togglePublishStatus(blog._id, blog.isPublished)}
                            className={`text-sm whitespace-nowrap ${
                              blog.isPublished 
                                ? 'text-yellow-600 hover:text-yellow-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {blog.isPublished ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            onClick={() => deleteBlog(blog._id)}
                            className="text-red-600 hover:text-red-900 text-sm whitespace-nowrap"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              

                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {blogs.map((blog) => (
                                    <tr key={blog._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {blog.title}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {blog.subTitle}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                                {blog.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                blog.isPublished 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {blog.isPublished ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => navigate(`/blog/${blog._id}`)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    View
                                                </button>
                                                <button
                                                    onClick={() => togglePublishStatus(blog._id, blog.isPublished)}
                                                    className={`${
                                                        blog.isPublished 
                                                            ? 'text-yellow-600 hover:text-yellow-900' 
                                                            : 'text-green-600 hover:text-green-900'
                                                    }`}
                                                >
                                                    {blog.isPublished ? 'Unpublish' : 'Publish'}
                                                </button>
                                                <button
                                                    onClick={() => deleteBlog(blog._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserBlogList;