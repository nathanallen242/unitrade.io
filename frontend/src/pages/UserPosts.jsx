import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import Products from '../components/Products';
import { del, post, get } from '../middleware/auth.js';
import Header from '../components/Header.jsx';
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

  const handleMakeOffer = async (postId) => {
    try {
      await post(`/create_offer`, { postId: postId, userId: currentUser.id });
      // Additional logic if needed
    } catch (error) {
      console.error('Error making an offer:', error);
    }
  };

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

  useEffect(() => {
    fetchUserPosts();
  }, [currentUser]);


  return (
    <>
    <Header></Header>
    <div>
      <h1>My Posts</h1>
      <Products 
      posts={userPosts} 
      currentUserId={currentUser?.id} 
      onDelete={handleDelete}
      onMakeOffer={handleMakeOffer}
      />
    </div>
    </>
  );
};

export default UserPosts;
