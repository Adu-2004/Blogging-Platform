import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { toast } from 'react-hot-toast';
import Loader from '../../components/Loader';
import UserSidebar from '../../components/user/UserSidebar';
import Navbar from '../../components/Navbar';

const UserDashboard = () => {
  const { axios, token } = useAppContext();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    recentBlogs: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    loadDashboard();
  }, [navigate, token]);

  const loadDashboard = async () => {
    try {
      const { data } = await axios.get('/api/user/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (data?.success) {
        setDashboardData(data.dashboardData);
      } else {
        throw new Error(data?.message || "Failed to load dashboard");
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row min-h-screen bg-blue-50/50">
        <UserSidebar />
        
        <div className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto bg-blue-50/50">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your blogs and track your progress</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="bg-blue-50 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Blogs</p>
                  <p className="text-2xl font-bold text-gray-800">{dashboardData.totalBlogs}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="bg-green-50 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Published</p>
                  <p className="text-2xl font-bold text-gray-800">{dashboardData.publishedBlogs}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="bg-yellow-50 p-3 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Drafts</p>
                  <p className="text-2xl font-bold text-gray-800">{dashboardData.draftBlogs}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/user/add-blog"
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Blog
              </Link>
              <Link
                to="/user"
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Manage Blogs
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Recent Blogs</h2>
            </div>

            {dashboardData.recentBlogs.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {dashboardData.recentBlogs.map((blog) => (
                  <div key={blog._id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-800 mb-1">{blog.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>{formatDate(blog.createdAt)}</span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            blog.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {blog.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={`/blog/${blog._id}`}
                          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-700 mb-2">No blogs yet</h3>
                <p className="text-gray-500 mb-4">Start by creating your first blog post</p>
                <Link
                  to="/user/add-blog"
                  className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Blog
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;