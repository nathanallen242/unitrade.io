import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { get, post, del } from '../middleware/auth.js'; // Import your utility functions

const PostPage = () => {
  const { postId } = useParams();
  const [postDetails, setPostDetails] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [error, setError] = useState(null);
  
  const { isAuthenticated, currentUser } = useAuth();

  useEffect(() => {
    get(`/posts/${postId}`)
      .then(response => {
        setPostDetails(response);
        checkIfLiked();
      })
      .catch(err => {
        setError('An error occurred while fetching the data');
        console.error('Error fetching post data:', err);
      });
  }, [postId]);

  const checkIfLiked = async () => {
    if (!isAuthenticated() || !currentUser) {
      return;
    }
  
    try {
      const likedPosts = await get(`/favorite/${currentUser.id}`);
      console.log(likedPosts);
      const postIdNumber = parseInt(postId, 10); // Convert postId to a number
      const isPostLiked = likedPosts.some(fav => fav.post_id === postIdNumber);
      setIsLiked(isPostLiked);
    } catch (err) {
      console.error('Error checking like status:', err);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated()) {
      console.log('User is not authenticated.');
      return;
    }

    try {
      await post('/add_favorite', {
        user_id: currentUser.id,
        post_id: parseInt(postId, 10),
      });
      setIsLiked(true);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleUnlike = async () => {
    if (!isAuthenticated()) {
      console.log('User is not authenticated.');
      return;
    }

    try {
      await post('/delete_favorite', {
        user_id: currentUser.id,
        post_id: parseInt(postId, 10),
      });
      setIsLiked(false);
    } catch (err) {
      console.error('Error unliking post:', err);
    }
  };

  if (error) return <div>{error}</div>;
  if (!postDetails) return <div>Loading...</div>;

  return (
    <div>
      <h1>{postDetails.title}</h1>
      <p>{postDetails.description}</p>
      <p>Category: {postDetails.category_id}</p>
      <p>Makes: {postDetails.makes}</p>
      <p>Post Date: {new Date(postDetails.post_date).toLocaleDateString()}</p>
      <p>Is Traded: {postDetails.Is_Traded ? 'Yes' : 'No'}</p>
      <button onClick={isLiked ? handleUnlike : handleLike}>
        {isLiked ? 'Unlike' : 'Like'}
      </button>
    </div>
  );
};

export default PostPage;
