import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Moment from 'moment'

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
    <div onClick={() => navigate(`/blog/${_id}`)} className='w-full rounded-lg overflow-hidden shadow hover:scale-102 hover:shadow-blue-100 duration-300 cursor-pointe bg-white border-2 border-white flex flex-col'>
      <img src={image} alt='' className='w-full h-48 object-cover' />
      <span className='ml-5 mt-4 w-fit mb-2 px-3 py-1 inline-block bg-blue-200 rounded-full text-blue text-xs'>{category}</span>
      <div className='p-5 flex flex-col flex-1'>
        <h5 className='mb-2 font-medium text-gray-900'>{title}</h5>
        <p className='mb-3 text-xs text-gray-600' dangerouslySetInnerHTML={{ "__html": description.slice(0, 80) }}></p>
        <div className='flex items-center justify-between border-t border-gray-105 pt-3 mt-auto text-xs text-gray-500'>
          <p>By <span className='font-semibold text-gray-700'>{blog?.author?.name || 'Admin'}</span></p>
          <p>{Moment(blog?.createdAt).format('MMM Do YYYY')}</p>
        </div>
      </div>
    </div>
  )
}
////////////////////////////////////////////////////////////////////////////
export default BlogCard
