import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const BlogLike = ({ blogId, initialLikes = [] }) => {
  const { axios } = useAppContext()
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(initialLikes.length)

  useEffect(() => {
    // Check if current logged-in user already liked
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]))
        const currentUserId = decoded.userId
        setLiked(initialLikes.includes(currentUserId))
      } catch (error) {
        console.error('Token decode error:', error)
      }
    }
  }, [initialLikes])

  const handleLike = async () => {
    const token = localStorage.getItem('token')
    if (!token) return toast.error('Please login to like')

    try {
      if (liked) {
        const { data } = await axios.get(
  `/api/blog/${blogId}/unlike`,
  { headers: { Authorization: `Bearer ${token}` } }
)
        if (data.success) {
          setLiked(false)
          setLikeCount(prev => prev - 1)
        }
      } else {
const { data } = await axios.get(
  `/api/blog/${blogId}/like`,
  { headers: { Authorization: `Bearer ${token}` } }
)

        if (data.success) {
          setLiked(true)
          setLikeCount(prev => prev + 1)
        }
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='flex items-center gap-3 max-w-3xl mx-auto mt-8 mb-4'>
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 px-5 py-2 rounded-full border transition-all duration-200 font-medium text-sm cursor-pointer
          ${liked
            ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
            : 'bg-white text-gray-500 border-gray-300 hover:border-blue-400 hover:text-blue-500'
          }`}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className={`w-5 h-5 transition-transform duration-200 ${liked ? 'scale-110' : ''}`}
          fill={liked ? 'currentColor' : 'none'}
          viewBox='0 0 24 24'
          stroke='currentColor'
          strokeWidth={2}
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-1.3H14z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3'
          />
        </svg>
        {liked ? 'Liked' : 'Like'}
      </button>
      <span className='text-gray-500 text-sm'>
        {likeCount} {likeCount === 1 ? 'like' : 'likes'}
      </span>
    </div>
  )
}

export default BlogLike;