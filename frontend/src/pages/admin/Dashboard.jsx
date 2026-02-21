import React, { useEffect, useState } from 'react'
import { assets,dashboard_data } from '../../assets/assets'
import BlogTableItem from '../../components/admin/BlogTableItem'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'
import { NavLink, useNavigate } from 'react-router-dom'


const Dashboard = () => {
  
  const [dashboardData, setDashboardData] = useState({
    blogs:0,
    comments:0,
    drafts:0,
    recentBlogs: []
  })

  const {axios} = useAppContext()
    const navigate = useNavigate();

const fetchDashboard = async () => {
  try {
    // ✅ Get only YOUR blogs
    const blogRes = await axios.get('/api/blog/my-blogs');
    if (blogRes.data.success) {
      const myBlogs = blogRes.data.blogs;

      setDashboardData(prev => ({
        ...prev,
        recentBlogs: myBlogs,
        blogs: myBlogs.length,                                    
        drafts: myBlogs.filter(b => !b.isPublished).length,      
        comments: prev.comments                                   
      }));
    }
  } catch (error) {
    toast.error(error.message);
  }
};

useEffect(() => {
    fetchDashboard()
},[])

  return (
    <div className='flex-1 p-4 md:p-10 min-h-svh bg-blue-50/50'>
      <div className='flex flex-wrap gap-4'>

        <NavLink to ='/admin/listBlog' className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all'>
        <img src={assets.dashboard_icon_1} alt=''/>
             <div>
              <p className='tet-xl font-semibold text-gray-600'>{dashboardData.blogs}</p>
              <p className='text-gray-400 font-light'>Blogs</p>
             </div>
             </NavLink>

               <NavLink to ='/admin/comments' className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all'>
        <img src={assets.dashboard_icon_2} alt=''/>
             <div>
              <p className='tet-xl font-semibold text-gray-600'>{dashboardData.comments}</p>
              <p className='text-gray-400 font-light'>Comments</p>
             </div>
             </NavLink>

               <div className='flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all'>
        <img src={assets.dashboard_icon_3} alt=''/>
             <div>
              <p className='tet-xl font-semibold text-gray-600'>{dashboardData.drafts}</p>
              <p className='text-gray-400 font-light'>Drafts</p>
             </div>
             </div>
           </div>
        <div>
        
         <div className=" w-4xl p-6 bg-white rounded-lg shadow flex flex-col gap-4 mt-6">

      <p className="text-lg font-semibold text-gray-700 mb-2">Quick Actions</p>

      <div className="flex gap-4">
        {/* Add New Blog Button */}
         <button
            onClick={() => navigate('/admin/addBlog')}
          className="flex items-center justify-center gap-2 flex-1
            px-5 py-3 bg-blue-600 text-white rounded transition
            hover:bg-blue-700  active:scale-95
            font-medium shadow focus:outline-none outline-none
            duration-300"
          style={{ position: "relative", overflow: "hidden" }}
        >   
          Add New Blog
        </button>
        {/* Manage Blogs Button */}
        <button   
          className="flex items-center justify-center gap-2 flex-1
            px-5 py-3 bg-gray-100 text-gray-700 rounded
            border border-gray-200 transition hover:bg-gray-200
            font-medium shadow focus:outline-none outline-none
            duration-300"
        >     
          Manage Blogs
        </button>
      </div>
    </div>
          <div className='flex items-center gap-3 m-4 mt-6 text-gray-600'>
            <img src={assets.dashboard_icon_4} alt=''/>
            <p>Latest Blogs</p>
          </div>
          
          <div className='relative max-w-4xl overflow-x-auto shadow rounded-lg scroll-hide bg-white'>
                <table className='w-full text-sm text-gray-500'>
                  <thead className='text-xs text-gray-600 text-left uppercase'>
                         <tr>
                          <th scope='col' className='px-2 py-4 xl:px-6'> # </th>
                          <th scope='col' className='px-2 py-4'> Blog Title </th>
                          <th scope='col' className='px-2 py-4 max-sm:hidden'> Date </th>
                          <th scope='col' className='px-2 py-4 max-sm:hidden' > Status </th>
                          <th scope='col' className='px-2 py-4'> Actions </th>
                         </tr>
                  </thead>
                 <tbody>
  {dashboardData.recentBlogs.length === 0 ? (
    <tr>
      <td colSpan="5" className='text-center py-16 text-gray-400'>
        <div className='flex flex-col items-center gap-2'>
          <span className='text-4xl'>📝</span>
          <p className='text-lg font-medium'>No blogs yet!</p>
          <p className='text-sm'>Start writing your first blog and share your thoughts with the world.</p>
        </div>
      </td>
    </tr>
  ) : (
    dashboardData.recentBlogs.map((blog, index) => (
      <BlogTableItem key={blog._id} blog={blog} fetchBlogs={fetchDashboard} index={index + 1}/>
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
