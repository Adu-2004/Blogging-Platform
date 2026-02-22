import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import BlogTableItem from '../../components/admin/BlogTableItem'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { NavLink, useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    blogs: 0,
    comments: 0,
    drafts: 0,
    recentBlogs: []
  })

  const { axios } = useAppContext()
  const navigate = useNavigate()

  const fetchDashboard = async () => {
    try {
      const blogRes = await axios.get('/api/blog/my-blogs')
      if (blogRes.data.success) {
        const myBlogs = blogRes.data.blogs
        setDashboardData(prev => ({
          ...prev,
          recentBlogs: myBlogs,
          blogs: myBlogs.length,
          drafts: myBlogs.filter(b => !b.isPublished).length,
          comments: prev.comments
        }))
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  return (
    <div className='flex-1 p-3 sm:p-6 md:p-8 lg:p-10 min-h-screen bg-blue-50/50'>

      {/* ── Stat Cards ── */}
      <div className='grid grid-cols-3 gap-2 sm:gap-4'>

        <NavLink
          to='/admin/listBlog'
          className='flex items-center gap-2 sm:gap-4 bg-white p-2.5 sm:p-4 rounded-lg shadow
                     cursor-pointer hover:scale-105 transition-transform duration-200'
        >
          <img src={assets.dashboard_icon_1} alt='' className='w-7 h-7 sm:w-12 sm:h-12 flex-shrink-0' />
          <div>
            <p className='text-base sm:text-xl font-semibold text-gray-600'>{dashboardData.blogs}</p>
            <p className='text-gray-400 font-light text-xs sm:text-sm'>Blogs</p>
          </div>
        </NavLink>

        <NavLink
          to='/admin/comments'
          className='flex items-center gap-2 sm:gap-4 bg-white p-2.5 sm:p-4 rounded-lg shadow
                     cursor-pointer hover:scale-105 transition-transform duration-200'
        >
          <img src={assets.dashboard_icon_2} alt='' className='w-7 h-7 sm:w-12 sm:h-12 flex-shrink-0' />
          <div>
            <p className='text-base sm:text-xl font-semibold text-gray-600'>{dashboardData.comments}</p>
            <p className='text-gray-400 font-light text-xs sm:text-sm'>Comments</p>
          </div>
        </NavLink>

        <div
          className='flex items-center gap-2 sm:gap-4 bg-white p-2.5 sm:p-4 rounded-lg shadow
                     hover:scale-105 transition-transform duration-200'
        >
          <img src={assets.dashboard_icon_3} alt='' className='w-7 h-7 sm:w-12 sm:h-12 flex-shrink-0' />
          <div>
            <p className='text-base sm:text-xl font-semibold text-gray-600'>{dashboardData.drafts}</p>
            <p className='text-gray-400 font-light text-xs sm:text-sm'>Drafts</p>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className='bg-white rounded-lg shadow p-3 sm:p-6 mt-3 sm:mt-6'>
        <p className='text-sm sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-4'>Quick Actions</p>
        <div className='flex gap-2 sm:gap-3'>
          <button
            onClick={() => navigate('/admin/addBlog')}
            className='flex items-center justify-center gap-1 sm:gap-2 flex-1
                       px-3 py-2 sm:px-4 sm:py-3 bg-blue-600 text-white rounded
                       hover:bg-blue-700 active:scale-95 transition-all
                       font-medium shadow text-xs sm:text-base focus:outline-none'
          >
            + Add New Blog
          </button>
          <button
            onClick={() => navigate('/admin/listBlog')}
            className='flex items-center justify-center gap-1 sm:gap-2 flex-1
                       px-3 py-2 sm:px-4 sm:py-3 bg-gray-100 text-gray-700 rounded
                       border border-gray-200 hover:bg-gray-200 active:scale-95
                       transition-all font-medium shadow text-xs sm:text-base focus:outline-none'
          >
            Manage Blogs
          </button>
        </div>
      </div>

      {/* ── Latest Blogs Table ── */}
      <div className='mt-3 sm:mt-6'>
        <div className='flex items-center gap-2 mb-2 sm:mb-4 text-gray-600'>
          <img src={assets.dashboard_icon_4} alt='' className='w-4 h-4 sm:w-5 sm:h-5' />
          <p className='font-medium text-xs sm:text-base'>Latest Blogs</p>
        </div>

        <div className='w-full overflow-x-auto shadow rounded-lg bg-white'>
          <table className='w-full text-xs sm:text-sm text-gray-500 min-w-[340px]'>
            <thead className='text-xs text-gray-600 uppercase bg-gray-50'>
              <tr>
                <th className='px-2 py-2 sm:px-6 sm:py-3 text-left w-8'>#</th>
                <th className='px-2 py-2 sm:px-3 sm:py-3 text-left'>Blog Title</th>
                <th className='px-2 py-2 sm:px-3 sm:py-3 text-left hidden sm:table-cell'>Date</th>
                <th className='px-2 py-2 sm:px-3 sm:py-3 text-left hidden sm:table-cell'>Status</th>
                <th className='px-2 py-2 sm:px-3 sm:py-3 text-left'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentBlogs.length === 0 ? (
                <tr>
                  <td colSpan='5' className='text-center py-8 sm:py-16 text-gray-400'>
                    <div className='flex flex-col items-center gap-1 sm:gap-2'>
                      <span className='text-2xl sm:text-4xl'>📝</span>
                      <p className='text-sm sm:text-lg font-medium'>No blogs yet!</p>
                      <p className='text-xs px-4 text-center'>
                        Start writing your first blog and share your thoughts with the world.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                dashboardData.recentBlogs.map((blog, index) => (
                  <BlogTableItem
                    key={blog._id}
                    blog={blog}
                    fetchBlogs={fetchDashboard}
                    index={index + 1}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard