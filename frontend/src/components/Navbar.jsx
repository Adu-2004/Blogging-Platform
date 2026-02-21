import React from 'react'
import {assets} from '../assets/assets'

import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext';
const Navbar = () => {
 
  const {navigate, token} = useAppContext(); 
  return (
   <div className='flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32'>
      
      <img onClick={()=>navigate('/')} src={assets.blog_logo} alt='logo' className='sm:w-60 cursor-pointer'/>
      <button  onClick={()=>navigate('/admin')}  className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-blue-700 text-white hover:scale-110 hover:bg-blue-500 px-10 py-2.5'>
        {token ? 'Dashboard' : 'Login'}
        <img src={assets.arrow} className='w-3.5' alt='arrow'/>
      </button>
      
    </div> 
    
  )
}

export default Navbar
