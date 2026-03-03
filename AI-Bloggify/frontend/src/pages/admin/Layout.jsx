import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/admin/Sidebar'
import { useAppContext } from '../../context/AppContext'

const Layout = () => {
  const { axios, setToken, navigate } = useAppContext()
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (name) {
      setUserName(name);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    axios.defaults.headers.common['Authorization'] = null;
    setToken(null)
    navigate('/')
  }

  

  return (
    <>
      <div className='flex items-center justify-between py-2 h-[70px] px-4 sm:px-12 border-b border-gray-200'>
        {/* Logo */}
        <img
          src={assets.blog_logo}
          alt=''
          className='w-50 sm:w-60 cursor-pointer'
          onClick={() => navigate('/')}
        />
        
      
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className='text-sm px-4 py-2 bg-gray-200 text-gray-700 rounded-full cursor-pointer hover:bg-gray-300 transition'
          >
            Home
          </button>
 {/* 
          <button
            onClick={() => navigate('/about')}
            className='text-sm px-4 py-2 bg-gray-200 text-gray-700 rounded-full cursor-pointer hover:bg-gray-300 transition'
          >
            About
          </button>
 */}

          {/* Logout Button */}
          <button
            onClick={logout}
            className='text-sm px-8 py-2 bg-blue-500 text-white rounded-full cursor-pointer'
          >
            Logout
          </button>
        </div>
      </div>

      <div className='flex h-[calc(100vh-70px)]'>
        <Sidebar />
        <Outlet />
      </div>
    </>
  )
}

export default Layout

