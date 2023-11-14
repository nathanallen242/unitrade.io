import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import Products from '../components/Products';
import { del } from '../middleware/auth.js';
const BASE_URL = import.meta.env.VITE_API_URL;

const UserPosts = () => {
  const [userPosts, setUserPosts] = useState([]);
  const { currentUser } = useAuth();

  const fetchUserPosts = async () => {
    if (currentUser) {
      try {
        const response = await axios.get(`${BASE_URL}/posts/user/${currentUser.id}`);
        setUserPosts(response.data.length > 0 ? response.data : []);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [currentUser]);

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await del(`/posts/${postId}`);
        setUserPosts(currentPosts => currentPosts.filter(post => post.post_id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  return (
    <div>
      <h1>My Posts</h1>
      <Products posts={userPosts} onDelete={handleDelete} />
    </div>
  );
};

export default UserPosts;
