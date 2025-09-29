/*import React from 'react'

const Newsletter = () => {
  return (
    <div className='flex flex-col items-center justify-center text-center space-y-2 my-32'>
      <h1 className='md:text-4xl text-2xl font-semibold'>Never Miss a Blog!</h1>
      <p className='md:text-lg text-gray-500/70 pb-8'>Subscribe to get the latest blog, new tech, and exclusive news.</p>
      <form className='flex items-center justify-between max-w-2xl w-full md:h-13 h-12'>
        <input className='border-2 border-blue-400 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-700' type='text' placeholder='Enter your email id' required/>
        <button type='submit' className='md:px-12 px-8 h-full text-white bg-blue-500 hover:bg-blue-700 transition-all cursor-pointer rounded-md rounded-l-none'>Subscribe</button>
      </form>
    </div>
  )
}

export default Newsletter
*/
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Newsletter = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success("You are subscribed!");
  };

  return (
    <div className='flex flex-col items-center justify-center text-center space-y-2 my-32'>
      <h1 className='md:text-4xl text-2xl font-semibold'>Never Miss a Blog!</h1>
      <p className='md:text-lg text-gray-500/70 pb-8'>Subscribe to get the latest blog, new tech, and exclusive news.</p>
      <form onSubmit={handleSubscribe} className='flex items-center justify-between max-w-2xl w-full md:h-13 h-12'>
        <input
          className='border-2 border-blue-400 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-700'
          type='email'
          placeholder='Enter your email id'
          required
        />
        <button
          type='submit'
          className='md:px-12 px-8 h-full text-white bg-blue-500 hover:bg-blue-700 transition-all cursor-pointer rounded-md rounded-l-none'
        >
          Subscribe
        </button>
      </form>

      {/* Toast container to hold notifications */}
      <ToastContainer />
    </div>
  );
};

export default Newsletter;
