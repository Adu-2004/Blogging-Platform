import React from 'react'
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const BlogTableItem = ({blog, fetchBlogs, index}) => {
  
    const {title, createdAt} = blog;
    const BlogDate = new Date(createdAt)

    const {axios} = useAppContext();

    const  deleteBlog = async ()=> {
        const confirm = window.confirm('Are you sure you want to delete this blog?')
        if(!confirm) return;
        try {
            const {data} = await axios.post('api/blog/delete', {id : blog._id})
            if(data.success){
                toast.success(data.message)
                await fetchBlogs()                                        
            }else{ 
                 toast.error(data.message)
            }
        } catch (error) {
               toast.error(error.message)
        }
    }
  
   const togglePublish = async () => {
    try {
         const {data} = await axios.post('/api/blog/toggle-publish', {id: blog._id})
     if(data.success){
                toast.success(data.message)
                await fetchBlogs()
            }else{ 
                 toast.error(data.message)
            }
    } catch (error) {
        toast.error(error.message)
    }
    
   } 


    return (
    <tr className='border-y border-gray-300'>
        <th className='px-2 py-4'>{index}</th>
        <td className='px-2 py-4'>{title}</td>
        <td className='px-2 py-4 max-sm:hidden'>{BlogDate.toDateString()}</td>
        <td className='px-2 py-4 max-sm:hidden'>
            <p className={`${blog.isPublished ? "text-green-600" : "text-orange-700"}`}
            >{blog.isPublished ? 'Published' : 'Unpublished'}</p>
        </td>
        <td className='px-2 py-4 flex text-xs gap-3'>
            <button onClick={togglePublish} className='border px-2 py-0.5 mt-1 rounded cursor-pointer'
            >{blog.isPublished ? 'Unpublish' : 'Publish'}</button>
            <img src={assets.cross_icon} className='w-8 hover:scale-110 transition-all cursor-pointer' alt='' onClick={deleteBlog}/>
        </td>
    </tr>
  )
}


export default BlogTableItem 
 
// import React from 'react'
// import { assets } from '../../assets/assets';
// import { useAppContext } from '../../context/AppContext';
// import toast from 'react-hot-toast';

// const BlogTableItem = ({ blog, fetchBlogs, index }) => {

//   const { title, createdAt } = blog;
//   const BlogDate = new Date(createdAt)

//   const { axios } = useAppContext();

//   const deleteBlog = async () => {
//     const confirm = window.confirm('Are you sure you want to delete this blog?')
//     if (!confirm) return;
//     try {
//       const { data } = await axios.post('api/blog/delete', { id: blog._id })
//       if (data.success) {
//         toast.success(data.message)
//         await fetchBlogs()
//       } else {
//         toast.error(data.message)
//       }
//     } catch (error) {
//       toast.error(error.message)
//     }
//   }

//   const togglePublish = async () => {
//     try {
//       const { data } = await axios.post('/api/blog/toggle-publish', { id: blog._id })
//       if (data.success) {
//         toast.success(data.message)
//         await fetchBlogs()
//       } else {
//         toast.error(data.message)
//       }
//     } catch (error) {
//       toast.error(error.message)
//     }
//   }

//   return (
//     <tr className='border-y border-gray-100 hover:bg-gray-50 transition-colors'>

//       {/* Index */}
//       <td className='px-2 py-2.5 sm:px-6 sm:py-4 text-xs sm:text-sm text-gray-400 font-medium w-8'>
//         {index}
//       </td>

//       {/* Title */}
//       <td className='px-2 py-2.5 sm:px-3 sm:py-4 text-xs sm:text-sm text-gray-700 max-w-[120px] sm:max-w-xs'>
//         <p className='truncate' title={title}>{title}</p>
//       </td>

//       {/* Date — hidden on mobile */}
//       <td className='px-2 py-2.5 sm:px-3 sm:py-4 text-xs sm:text-sm text-gray-500 hidden sm:table-cell whitespace-nowrap'>
//         {BlogDate.toDateString()}
//       </td>

//       {/* Status — hidden on mobile */}
//       <td className='px-2 py-2.5 sm:px-3 sm:py-4 hidden sm:table-cell'>
//         <span className={`inline-block text-xs sm:text-sm font-medium px-2 py-0.5 rounded-full
//           ${blog.isPublished
//             ? 'text-green-700 bg-green-50'
//             : 'text-orange-700 bg-orange-50'
//           }`}>
//           {blog.isPublished ? 'Published' : 'Draft'}
//         </span>
//       </td>

//       {/* Actions */}
//       <td className='py-2.5 pr-0 sm:px-3 sm:py-4'>
//         <div className='flex items-center gap-2 sm:gap-4'>
//           <button
//             onClick={togglePublish}
//             className={`text-xs px-2 py-1 sm:px-2.5 sm:py-1 rounded border font-medium
//               cursor-pointer transition-colors whitespace-nowrap
//               ${blog.isPublished
//                 ? 'border-orange-300 text-orange-600 hover:bg-orange-50'
//                 : 'border-green-300 text-green-600 hover:bg-green-50'
//               }`}
//           >
//             {blog.isPublished ? 'Unpublish' : 'Publish'}
//           </button>
//           <img
//             src={assets.cross_icon}
//             className='w-6 h-6 sm:w-7 sm:h-7 hover:scale-110 transition-transform cursor-pointer opacity-60 hover:opacity-100'
//             alt='Delete'
//             onClick={deleteBlog}
//           />
//         </div>
//       </td>

//     </tr>
//   )
// }

// export default BlogTableItem