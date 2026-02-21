import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets'
import BlogBotChatbot from '../Blogbotchatbot'

const Sidebar = () => {
  return (
    <div className='flex flex-col border-r border-gray-200 min-h-full pt-6'>

        <NavLink end={true} to ='/admin' className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && "bg-blue-100 border-r-4 border-blue-500"}`}> 
        <img src={assets.home_icon} alt="" className='min-w-4 w-5'/>
        <p className='hidden md:inline-block'>Dashboard</p> 
      </NavLink>

       <NavLink end={true} to ='/admin/my-blogs' className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && "bg-blue-100 border-r-4 border-blue-500"}`}> 
        <img src={assets.My_blog_icon} alt="" className='min-w-4 w-5'/>
        <p className='hidden md:inline-block'>My Blogs</p> 
      </NavLink>
        
       <NavLink end={true} to ='/admin/addBlog' className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && "bg-blue-100 border-r-4 border-blue-500"}`}> 
        <img src={assets.add_icon} alt="" className='min-w-4 w-5'/>
        <p className='hidden md:inline-block'>Add blogs</p> 
      </NavLink>

       <NavLink end={true} to ='/admin/listBlog' className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && "bg-blue-100 border-r-4 border-blue-500"}`}> 
        <img src={assets.list_icon} alt="" className='min-w-4 w-5'/>
        <p className='hidden md:inline-block'>Blog lists</p> 
      </NavLink>

       <NavLink end={true} to ='/admin/comments' className={({isActive}) => `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && "bg-blue-100 border-r-4 border-blue-500"}`}> 
        <img src={assets.comment_icon} alt="" className='min-w-4 w-5'/>
        <p className='hidden md:inline-block'>Comments</p> 
      </NavLink>
    <div>
         </div>
     <BlogBotChatbot/>
    </div>
  
  )
}

export default Sidebar
