import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast';
import { assets } from '../assets/assets';

function Login() {

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const { axios, setToken } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const { data } = await axios.post('/api/user/login', { email, password });
        if (data.token) {
          setToken(data.token);
          localStorage.setItem('token', data.token);
          localStorage.setItem('userName', data.name);
          axios.defaults.headers.common['Authorization'] = data.token;
          toast.success('Logged in successfully');
          navigate('/admin');
        } else {
          toast.error(data.message || 'Login failed');
        }
      } else {
        if (!name) return toast.error('Please enter your name');
        const { data } = await axios.post('/api/user/signup', { name, email, password });
        if (data.success) {
          toast.success('Sign up successful! Please log in.');
          setIsLogin(true);
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
    <div className='flex h-screen'>

      {/* ── LEFT PANEL: Illustration ── */}
      <div className='hidden md:flex w-1/2 bg-blue-50 items-center justify-center'>
        <img
          src={assets.Login_illustration}
          alt='Login Illustration'
          className='w-full h-screen object-cover'
        />
      </div>

      {/* ── RIGHT PANEL: Form ── */}
      <div className='flex w-full md:w-1/2 items-center justify-center px-8 bg-blue-50'>
        <div className='w-full max-w-sm p-6 border border-blue-300 shadow-xl shadow-blue-150 rounded-lg'>
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
                  <label>Full Name</label>
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

    </div>
  );
}

export default Login;
