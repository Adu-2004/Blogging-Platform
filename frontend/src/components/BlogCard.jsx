import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const BlogCard = ({ blog }) => {

  const { title, description, category, image, _id, initialLikes = 0 } = blog;
  const navigate = useNavigate();

  
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);

  const handleLikeToggle = (e) => {
    e.stopPropagation(); // Prevent card click navigation
    if (isLiked) {
      setIsLiked(false);
      setLikeCount(likeCount - 1);
    } else {
      setIsLiked(true);
      setLikeCount(likeCount + 1);
    }
  }

  return (
    <div onClick={() => navigate(`/blog/${_id}`)} className='w-full rounded-lg overflow-hidden shadow hover:scale-102 hover:shadow-blue-100 duration-300 cursor-pointe bg-white border-2 border-white'>
      <img src={image} alt='' className='aspect-video' />
      <span className='ml-5 mt-4 px-3 py-1 inline-block bg-blue-200 rounded-full text-blue text-xs'>{category}</span>
      <div className='p-5'>
        <h5 className='mb-2 font-medium text-gray-900'>{title}</h5>
        <p className='mb-3 text-xs text-gray-600' dangerouslySetInnerHTML={{ "__html": description.slice(0, 80) }}></p>
         <button
          onClick={handleLikeToggle}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition duration-300
            ${isLiked ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          {isLiked ? 'Unlike' : 'Like'} ({likeCount})
        </button>
      </div>
    </div>
  )
}

export default BlogCard
