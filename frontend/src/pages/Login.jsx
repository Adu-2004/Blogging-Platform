/*import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast';

function Login() {

    const {axios, setToken} = useAppContext();

    const [email, setemail] = useState('')
    const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
            e.preventDefault()
           try {
              const {data} = await axios.post('/api/admin/login', {email, password})
              if(data.success){
                setToken(data.token)
                localStorage.setItem('token', data.token)
                axios.default.headers.common['Authorization'] = data.token; 
              }else{
                toast.error(data.message);
              }
           } catch (error) {
              toast.error(error.message);
           }
  }

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-full max-w-sm p-6 max-md:m-6 border border-blue-300 shadow-xl shadow-blue-150 rounded-lg'> 
        <div className="flex flex-col items-center justify-center">
          <div className='w-full py-6 text-center'>
            <h1 className='text-3xl font-bold'><span className='text-blue-500'>User</span> Login</h1>
            <p className='font-light'>Enter your credentials to access the admin panel</p>
          </div>
              <form onSubmit={handleSubmit} className='mt-6 w-full sm:max-w-md text-gray-600'>
                        <div className='flex flex-col'>
                          <label>Email</label>
                          <input onChange={e => setemail(e.target.value)} value={email}
                           type='email' required placeholder='your email id' 
                          className='border-b-2 border-gray-300 p-2 outline-none mb-6'/>
                        </div>

                         <div className='flex flex-col'>
                          <label>Password</label>
                          <input onChange={e => setPassword(e.target.value)} value={password} 
                          type='password' required placeholder='your password' 
                          className='border-b-2 border-gray-300 p-2 outline-none mb-6'/>
                        </div>
                        <button type='submit' className='w-full py-3 font-medium bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-700 transition-all'>
                                  Login
                        </button>
              </form>
        </div>
      </div>
    </div>
  )
}

export default Login */
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast';

function Login() {
  

  // State for toggling mode between login and signup
  const [isLogin, setIsLogin] = useState(true);

  // Common form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Optional: Additional fields for sign up
  const [name, setName] = useState('');

  // Handle form submission for both login and signup
   const { axios, setToken } = useAppContext();
  const navigate = useNavigate();  // <--- Add this

  // ... existing state and handlers

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const { data } = await axios.post('/api/auth/login', { email, password });
        // Backend sends token, name, role (does not include success property)
        if (data.token) {  // check token existence instead of data.success
          setToken(data.token);
          localStorage.setItem('token', data.token);
          localStorage.setItem('userName', data.name); 
          axios.defaults.headers.common['Authorization'] = data.token;
          toast.success('Logged in successfully');
          navigate('/admin');  // <--- Redirect to admin dashboard after login
        } else {
          toast.error(data.message || 'Login failed');
        }
      } else {
         if (!name) {
          return toast.error('Please enter your name');
        }
        const { data } = await axios.post('/api/auth/register', { name, email, password, });
        if (data.success) {
          toast.success('Sign up successful! Please log in.');
          setIsLogin(true); // Switch to login mode after sign up
          setName('');
          setEmail('');
          setPassword('');
        
        } else {
          toast.success(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='w-full max-w-sm p-6 max-md:m-6 border border-blue-300 shadow-xl shadow-blue-150 rounded-lg'>
        <div className="flex flex-col items-center justify-center">
          <div className='w-full py-6 text-center'>
            <h1 className='text-3xl font-bold'>
              <span className='text-blue-500'>{isLogin ? 'User Login' : 'User Sign Up'}</span>
            </h1>
            <p className='font-light'>
              {isLogin
                ? 'Enter your credentials to access the admin panel'
                : 'Create an account to get started'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className='mt-6 w-full sm:max-w-md text-gray-600'>
            {!isLogin && (
              <div className='flex flex-col'>
                <label>Name</label>
                <input
                  onChange={e => setName(e.target.value)}
                  value={name}
                  type='text'
                  required={!isLogin}
                  placeholder='your full name'
                  className='border-b-2 border-gray-300 p-2 outline-none mb-6'
                />
              </div>
            )}

            <div className='flex flex-col'>
              <label>Email</label>
              <input
                onChange={e => setEmail(e.target.value)}
                value={email}
                type='email'
                required
                placeholder='your email id'
                className='border-b-2 border-gray-300 p-2 outline-none mb-6'
              />
            </div>

            <div className='flex flex-col'>
              <label>Password</label>
              <input
                onChange={e => setPassword(e.target.value)}
                value={password}
                type='password'
                required
                placeholder='your password'
                className='border-b-2 border-gray-300 p-2 outline-none mb-6'
              />
            </div>

            <button
              type='submit'
              className='w-full py-3 font-medium bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-700 transition-all'
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 underline cursor-pointer bg-transparent border-none p-0"
            >
              {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
/*
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

function Login() {
  // State for toggling mode between login and signup
  const [isLogin, setIsLogin] = useState(true);

  // State for toggling between User and Admin mode
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Common form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Additional field for user sign up
  const [name, setName] = useState('');

  const { axios, setToken } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // Login section
        const loginUrl = isAdminMode ? '/api/admin/login' : '/api/user/login';
        const { data } = await axios.post(loginUrl, { email, password });

        if (data.token) {
          setToken(data.token);
          localStorage.setItem('token', data.token);
          localStorage.setItem('userName', data.name || '');
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
          toast.success('Logged in successfully');

          // Redirect based on admin/user
          if (isAdminMode) {
            navigate('/admin'); // Admin dashboard route
          } else {
            navigate('/user/dashboard'); // User dashboard route
          }
        } else {
          toast.error(data.message || 'Login failed');
        }
      } else {
        // Signup only for user mode (disable signup for admin as no API shown)
        if (isAdminMode) {
          return toast.error('Admin registration is not supported.');
        }
        if (!name) {
          return toast.error('Please enter your name');
        }

        const { data } = await axios.post('/api/user/signup', { name, email, password });
        if (data.success) {
          toast.success('Sign up successful! Please log in.');
          setIsLogin(true); // Switch to login mode after sign up
          setName('');
          setEmail('');
          setPassword('');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm p-6 max-md:m-6 border border-blue-300 shadow-xl shadow-blue-150 rounded-lg">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full py-6 text-center">
            <h1 className="text-3xl font-bold">
              <span className="text-blue-500">
                {isAdminMode
                  ? isLogin
                    ? 'Admin Login'
                    : 'Admin Sign Up (Not supported)'
                  : isLogin
                    ? 'User Login'
                    : 'User Sign Up'}
              </span>
            </h1>
            <p className="font-light">
              {isAdminMode
                ? isLogin
                  ? 'Enter your admin credentials'
                  : 'Admin registration not supported'
                : isLogin
                  ? 'Enter your credentials to access the user panel'
                  : 'Create an account to get started'}
            </p>
          </div>

          {/* Toggle user/admin mode 
          <div className="mb-4 flex justify-center gap-4">
            <button
              onClick={() => setIsAdminMode(false)}
              className={`py-2 px-4 rounded ${!isAdminMode ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              type="button"
            >
              User
            </button>
            <button
              onClick={() => setIsAdminMode(true)}
              className={`py-2 px-4 rounded ${isAdminMode ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              type="button"
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 w-full sm:max-w-md text-gray-600">
            {!isLogin && !isAdminMode && (
              <div className="flex flex-col">
                <label>Name</label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  required={!isLogin}
                  placeholder="your full name"
                  className="border-b-2 border-gray-300 p-2 outline-none mb-6"
                />
              </div>
            )}

            <div className="flex flex-col">
              <label>Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                required
                placeholder="your email id"
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
              />
            </div>

            <div className="flex flex-col">
              <label>Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                required
                placeholder="your password"
                className="border-b-2 border-gray-300 p-2 outline-none mb-6"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 font-medium bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-700 transition-all"
              disabled={isAdminMode && !isLogin} // disable admin signup (not supported)
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 underline cursor-pointer bg-transparent border-none p-0"
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

*/

