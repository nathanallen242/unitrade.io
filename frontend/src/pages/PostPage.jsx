import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import axios from 'axios';
import { get, post, del } from '../middleware/auth.js'; // Import your utility functions

import OfferModal from '../components/OfferModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const { isAuthenticated, currentUser } = useAuth();
const PostPage = () => {
  const { postId } = useParams();
  const { currentUser } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  //const [postDetails, setPostDetails] = useState(null);


  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [showOffersModal, setShowOffersModal] = useState(false);

  useEffect(() => {
    get(`/posts/${postId}`)
      .then(response => {
        setPostDetails(response);
        console.log(response)
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
  // Function to open modal
  const handleViewOffers = () => {
    setShowOffersModal(true);
  };

  if (error) return <div>{error}</div>;

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

  // Inline styles
  const containerStyles = {
    display: 'flex',
    alignItems: 'stretch', // Align items vertically
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'left',
    padding: '20px'
  };
  const imgStyles = {
    flex: 1,
  width: '100%', // Makes the image responsive
  height: 'auto', // Maintain aspect ratio
  objectFit: 'cover', // Cover the container without stretching the image
};

  

  const contentStyles = {
    flex: 2,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start' // Align content to the start of the column

  };

  const buttonStyles = {
    backgroundColor: '#ff4500',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    fontSize: '1em',
    cursor: 'pointer',
    margin: '10px',
    borderRadius: '5px'
  };




  const imageStyles = {
    flex: 1,
    background: 'url(/path-to-your-image.jpg) center center no-repeat',
    backgroundSize: 'cover',
  };
  if (error) return <div style={containerStyles}>{error}</div>;
  if (!postDetails) return <div style={containerStyles}>Loading...</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.description}</p>
      {/* Add more fields as needed */}
      <p>Category: {post.category_id}</p>
      <p>Makes: {post.makes}</p>
      <p>Post Date: {new Date(post.post_date).toLocaleDateString()}</p>
      <p>Is Traded: {post.Is_Traded ? 'Yes' : 'No'}</p>
      <button onClick={isLiked ? handleUnlike : handleLike}>
        {isLiked ? 'Unlike' : 'Like'}
      </button>
      {currentUser?.id === post.makes && (
        <button onClick={handleViewOffers}>View Offers</button>
      )}
      {showOffersModal && <OfferModal postId={postId} onClose={() => setShowOffersModal(false)} />}
    </div>
  );
};

export default PostPage;