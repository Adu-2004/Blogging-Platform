import './App.css'
import {Route,Routes} from 'react-router-dom'
import Home from './pages/Home';
import About from './pages/About';
import Blog from './pages/Blog';
import Layout from './pages/admin/Layout';
import  Dashboard  from './pages/admin/Dashboard';
import AddBlog from './pages/admin/AddBlog';
import ListBlog from './pages/admin/ListBlog';
import Comment from './pages/admin/Comment';
import Login from './pages/Login'
import 'quill/dist/quill.snow.css'
import {Toaster} from 'react-hot-toast';
import { useAppContext } from './context/AppContext'
import MyBlogs from './pages/MyBlogs'
import Allusers from './pages/admin/Allusers'


function App(){
  
    const {token} = useAppContext()

  return (
    <>
   <div>
    <Toaster/>
    <Routes>
      <Route path='/' element= {<Home/>}/>
      <Route path="/allusers" element={<Allusers />} />
        <Route path='about' element={<About/>} />
        <Route path='/Blog/:id' element= {<Blog/>}/>
    <Route path='/admin' element={token ? <Layout/> : <Login/>}>   
        <Route index element={<Dashboard/>}/>  
       <Route path='addBlog' element={<AddBlog/>}/>
       <Route path='listBlog' element={<ListBlog/>}/>
       <Route path='comments' element={<Comment/>}/>
         <Route path="my-blogs" element={<MyBlogs />} />
       

      </Route>
    </Routes>
   </div>
    </>
  )
}

export default App
