import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUnauthenticated, post } from '../middleware/auth.js'; // Import your utility functions
import OfferModal from '../components/OfferModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const PostPage = () => {

  const { isAuthenticated } = useAuth();
  const { postId } = useParams();
  const { currentUser } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [postDetails, setPostDetails] = useState(null);
  const [error, setError] = useState(null);
  const [showOffersModal, setShowOffersModal] = useState(false);

  useEffect(() => {
    console.log(currentUser)
    getUnauthenticated(`/posts/${postId}`)
      .then(response => {
        setPostDetails(response);
        console.log(response)
        checkIfLiked();
      })
      .catch(err => {
        setError('An error occurred while fetching the data');
        console.error('Error fetching post data:', err);
      });
  }, [currentUser]);

  const checkIfLiked = async () => {
    if (!currentUser) {
      console.log("not curr user")
      return;
    }
  
    try {
      console.log("test")
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
    alignItems: 'center', // Align items in the center vertically
    justifyContent: 'center', // Center the items horizontally
    minHeight: '100vh', // Full viewport height
    fontFamily: 'Arial, sans-serif',
    textAlign: 'left',
    padding: '20px',
  };
  

  const imageContainerStyles = {
    flex: 1,
    maxWidth: '50%', // Limit the width of the image container
    marginRight: '20px', // Space between image and content
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
    <div style={containerStyles}>
      {/* Left side with image */}
      <div style={imageContainerStyles}>
        <img src={postDetails.image_url} style={imgStyles} alt="Post" />
      </div>

      {/* Right side with post details */}
      <div style={contentStyles}>
        <h1>{postDetails.title}</h1>
        <p>{postDetails.description}</p>
        <p>Category: {postDetails.category_id}</p>
        <p>Makes: {postDetails.makes}</p>
        <p>Post Date: {new Date(postDetails.post_date).toLocaleDateString()}</p>
        <p>Is Traded: {postDetails.Is_Traded ? 'Yes' : 'No'}</p>
        <button style={buttonStyles} onClick={isLiked ? handleUnlike : handleLike}>
          {isLiked ? 'Unlike' : 'Like'}
        </button>
        {currentUser?.id === postDetails.makes && (
          <button style={buttonStyles} onClick={handleViewOffers}>View Offers</button>
        )}
      </div>
      {showOffersModal && <OfferModal postId={postId} onClose={() => setShowOffersModal(false)} />}
    </div>
  );
};

export default PostPage;