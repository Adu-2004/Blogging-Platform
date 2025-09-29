import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const LikeButton = ({ blogId, initialLikesCount = 0 }) => {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [loading, setLoading] = useState(false);
    const { token } = useAppContext();

    useEffect(() => {
        checkUserLike();
    }, [blogId, token]);

    const checkUserLike = async () => {
        if (!token) return;
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blog/${blogId}/check-like`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setLiked(data.liked);
                setLikesCount(data.likesCount);
            }
        } catch (error) {
            console.error('Error checking like status:', error);
        }
    };

    const handleLike = async () => {
        if (!token) {
            alert('Please login to like blogs');
            return;
        }

        if (loading) return;
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/blog/${blogId}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.success) {
                setLiked(data.liked);
                setLikesCount(data.likesCount);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={handleLike}
                disabled={loading}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                    liked 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <svg 
                    className={`w-4 h-4 ${liked ? 'fill-current' : 'stroke-current fill-none'}`}
                    viewBox="0 0 24 24" 
                    strokeWidth="2"
                >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                {likesCount}
            </button>
        </div>
    );
};

export default LikeButton;
