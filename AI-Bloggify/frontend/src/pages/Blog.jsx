import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets } from '../assets/assets'
import Navbar from '../components/Navbar'
import Moment from 'moment'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import BlogLike from '../components/BlogLike'
import BlogBotChatbot from '../components/Blogbotchatbot'

const Blog = () => {
  const { id } = useParams()
  const { axios } = useAppContext()

  const [data, setdata] = useState(null)
  const [comments, setComments] = useState([])
  const [content, setContent] = useState('')

  const [replyingTo, setReplyingTo] = useState(null) 
  const [replyContent, setReplyContent] = useState('')
  const [submittingReply, setSubmittingReply] = useState(false)

  

  const fetchBlogData = async () => {
    try {
      const { data } = await axios.get(`/api/blog/${id}`)
      data.success ? setdata(data.blog) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`/api/blog/comments/${id}`)
      if (data.success) {
        setComments(data.comments)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const addComment = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return toast.error('Please login to comment')
      }

      const { data } = await axios.post(
        '/api/blog/add-comment',
        { blog: id, content },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success(data.message)
        setContent('')
        fetchComments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleReplyToggle = (commentId) => {
    if (replyingTo === commentId) {
      setReplyingTo(null)
      setReplyContent('')
    } else {
      const token = localStorage.getItem('token')
      if (!token) {
        return toast.error('Please login to reply')
      }
      setReplyingTo(commentId)
      setReplyContent('')
    }
  }

  const submitReply = async (e, commentId) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) {
      return toast.error('Please login to reply')
    }

    if (!replyContent.trim()) {
      return toast.error('Reply cannot be empty')
    }

    setSubmittingReply(true)
    try {
      const { data } = await axios.post(
        '/api/blog/add-reply',
        { commentId, content: replyContent },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (data.success) {
        toast.success('Reply added!')
        setReplyingTo(null)
        setReplyContent('')
        fetchComments() 
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSubmittingReply(false)
    }
  }

  useEffect(() => {
    fetchBlogData()
    fetchComments()
  }, [id])

  return data ? (
    <div className='relative'>
      <img src={assets.gradientBackground} alt='' className='absolute -top-50 -z-1 opacity-50' />
      <Navbar />
      <div className='text-center mt-8 text-gray-600'>
        <p className='text-blue-500 py-4 font-medium'>
          Published on {Moment(data.createdAt).format('MMMM Do YYYY')}
        </p>
        <h1 className='text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800'>{data.title}</h1>
        <h2 className='my-5 max-w-lg truncate mx-auto'>{data.subTitle}</h2>
        <p className='inline-block py-1 px-4 rounded-full mb-6 border border-primary/40 bg-blue-100 font-medium text-sm text-blue-700'>
          Posted by{' '}
          <span className='font-semibold text-blue-800'>
            {data?.author?.name || 'Admin'}
          </span>
        </p>
      </div>

      <div className='mx-5 max-w-5xl md:mx-auto my-10 mt-6'>
        <img src={data.image} alt='' className='rounded-3xl mb-5 w-full max-h-[500px] object-contain' />
        <div className='rich-text max-w-3xl mx-auto' dangerouslySetInnerHTML={{ __html: data.description }}></div>
        
        {/* Comments Section */}
        <div className='mt-14 mb-9 max-w-3xl mx-auto'>
          <BlogLike blogId={data._id} initialLikes={data.likes || []} />
          <p className='font-semibold mb-4'>Comments ({comments.length})</p>
          <div className='flex flex-col gap-4'>
            {comments.length === 0 ? (
              <p className='text-gray-400 text-sm'>No comments yet. Be the first to comment!</p>
            ) : (
              comments.map((item, index) => (
                <div key={index} className='flex flex-col gap-2'>
                  {/* Comment Card */}
                  <div className='relative bg-blue-50 border border-blue-300 max-w-xl p-4 rounded-3xl text-gray-600'>
                    <div className='flex items-center gap-2 mb-2'>
                      <img src={assets.user_icon} alt='' className='w-6' />
                      <p className='font-medium'>{item.userId?.name || 'Anonymous'}</p>
                    </div>
                    <p className='text-sm max-w-md ml-8'>{item.content}</p>
                    <div className='flex items-center justify-between mt-3 ml-8'>
                      {/* Reply toggle button */}
                      <button
                        onClick={() => handleReplyToggle(item._id)}
                        className='text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors'
                      >
                      
                     {item.replies && item.replies.length > 0 ? null : (
                             <span
                        onClick={() => handleReplyToggle(item._id)}
                        className='text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors'
                          >
                          {replyingTo === item._id ? 'Cancel' : '↩ Reply'}
                          </span>
                        )}
                      </button>
                      <span className='text-xs text-gray-400'>
                        {Moment(item.createdAt).fromNow()}
                      </span>
                    </div>
                  
                 
                  {/* Replies List */}
                  {item.replies && item.replies.length > 0 && (
                    <div className='ml-8 flex flex-col gap-2'>
                      {item.replies.map((reply, rIdx) => (
                        <div
                          key={rIdx}
                          className='relative bg-gray-50 border border-gray-200 max-w-md p-3 rounded-3xl text-gray-600'
                        >
                          <div className='flex items-center gap-2 mb-1'>
                            <img src={assets.user_icon} alt='' className='w-5' />
                            <p className='font-medium text-sm'>{reply.userId?.name || 'Anonymous'}</p>
                          </div>
                          <p className='text-sm max-w-sm ml-7'>{reply.content}</p>
                          <div className='absolute right-3 bottom-2 text-xs text-gray-400'>
                            {Moment(reply.createdAt).fromNow()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  </div>

                  {/* Reply Input Box (shown only for the active comment) */}
                  {replyingTo === item._id && (
                    <form
                      onSubmit={(e) => submitReply(e, item._id)}
                      className='ml-8 flex flex-col gap-2 max-w-md'
                    >
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={`Replying to ${item.userId?.name || 'Anonymous'}...`}
                        required
                        className='w-full p-2 border border-blue-300 rounded outline-none h-24 text-sm text-gray-600 resize-none focus:border-blue-500 transition-colors'
                      />
                      <div className='flex gap-2'>
                        <span
                          type='submit'
                          disabled={submittingReply}
                          className='bg-blue-500 text-white text-sm rounded py-1.5 px-5 hover:bg-blue-600 transition-colors disabled:opacity-50 cursor-pointer'
                        >
                          {submittingReply ? 'Posting...' : 'Post Reply'}
                        </span>
                        <button
                          type='button'
                          onClick={() => { setReplyingTo(null); setReplyContent('') }}
                          className='text-sm text-gray-500 hover:text-gray-700 py-1.5 px-3 rounded border border-gray-300 transition-colors cursor-pointer'
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Comment Section */}
        <div className='max-w-3xl mx-auto'>
          <p className='font-semibold mb-4'>Add your comment</p>
          <form onSubmit={addComment} className='flex flex-col items-start gap-4 max-w-lg'>
            <textarea
              onChange={(e) => setContent(e.target.value)}
              value={content}
              placeholder='Write your comment...'
              required
              className='w-full p-2 border border-gray-300 rounded outline-none h-48'
            ></textarea>
            <button
              type='submit'
              className='bg-blue-500 text-white rounded p-2 px-8 hover:scale-102 transition-all cursor-pointer'
            >
              Submit
            </button>
          </form>
        </div>

        {/* Share Buttons */}
       <div className='my-24 max-w-3xl mx-auto'>
  <p className='font-semibold my-4'>Share this article on social media</p>
  <div className='flex'>
    <a href={`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`} target='_blank' rel='noreferrer'>
      <img src={assets.facebook_icon} width={50} alt='Share on Facebook'/>
    </a>
    <a href={`https://twitter.com/intent/tweet?url=${window.location.href}`} target='_blank' rel='noreferrer'>
      <img src={assets.twitter_icon} width={50} alt='Share on Twitter'/>
    </a>
    <a href={`https://plus.google.com/share?url=${window.location.href}`} target='_blank' rel='noreferrer'>
      <img src={assets.googleplus_icon} width={50} alt='Share on Google+'/>
    </a>
    <a href={`https://www.instagram.com/share?url=${window.location.href}`} target='_blank' rel='noreferrer'>
      <img src={assets.insta_logo} width={50} alt='Share on Google+'/>
    </a>
  </div>   
</div>
      </div>
      <BlogBotChatbot/>
      <Footer />
    </div>
  ) : (
    <Loader />
  )
}

export default Blog