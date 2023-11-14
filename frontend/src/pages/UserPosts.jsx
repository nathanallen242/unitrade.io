import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext.jsx';
import Products from '../components/Products';
import { del } from '../middleware/auth.js';
const BASE_URL = import.meta.env.VITE_API_URL;

const UserPosts = () => {
  const [userPosts, setUserPosts] = useState([]);
  const { currentUser } = useAuth();

  // Moved outside useEffect
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
        // Filter out the deleted post from the userPosts state
        setUserPosts(currentPosts => currentPosts.filter(post => post.post_id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  return (
    <div>
      <h1>My Posts</h1>
      {userPosts.length > 0 ? (
        <ul>
          {userPosts.map(post => (
            <li key={post.post_id}>
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              {/* Make sure to use the correct property for post ID */}
              <button onClick={() => handleDelete(post.post_id)}>Delete Post</button> 
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts as yet</p>
      )}
    </div>
  );
};

export default UserPosts;
