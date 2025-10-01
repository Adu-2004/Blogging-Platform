import React, { useEffect, useState } from 'react';
import BlogList from '../components/BlogList'; // Adjust path accordingly

const MyBlogs = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  if (!userName) return <p>Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto mt-10">
      <h1 className="text-3xl font-semibold mb-6 px-9">My Blogs</h1>
      < BlogList/>
    </div>
  );
};

export default MyBlogs;

