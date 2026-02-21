import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import BlogList from '../components/BlogList'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'

import BlogBotChatbot from '../components/Blogbotchatbot'

const Home = () => {
  return (
    <div className="min-h-screen w-full relative">
      {/* Aurora Dream Diagonal Flow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 5% 40%, rgba(175, 109, 255, 0.48), transparent 67%),
            radial-gradient(ellipse 70% 60% at 45% 45%, rgba(255, 100, 180, 0.41), transparent 67%),
            radial-gradient(ellipse 62% 52% at 83% 76%, rgba(255, 235, 170, 0.44), transparent 63%),
            radial-gradient(ellipse 60% 48% at 75% 20%, rgba(120, 190, 255, 0.36), transparent 66%),
            linear-gradient(45deg, #f7eaff 0%, #fde2ea 100%)
          `,
        }}
      />
      {/* Content with higher z-index to appear above background */}
      <div className="relative z-10">
        <Navbar />
        <Header />
        <BlogList />
        <Newsletter />
        <Footer />
        <BlogBotChatbot />
      </div>
    </div>
  )
}

export default Home
