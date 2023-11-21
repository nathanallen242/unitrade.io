import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import OfferModal from '../components/OfferModal.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const PostPage = () => {
  const { postId } = useParams();
  const { currentUser } = useAuth();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [showOffersModal, setShowOffersModal] = useState(false);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/posts/${postId}`)
      .then(response => {
        setPost(response.data);
      })
      .catch(err => {
        setError('An error occurred while fetching the data');
        console.error('Error fetching post data:', err);
      });
  }, [postId]);

  // Function to open modal
  const handleViewOffers = () => {
    setShowOffersModal(true);
  };

  if (error) return <div>{error}</div>;

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.description}</p>
      {/* Add more fields as needed */}
      <p>Category: {post.category_id}</p>
      <p>Makes: {post.makes}</p>
      <p>Post Date: {new Date(post.post_date).toLocaleDateString()}</p>
      <p>Is Traded: {post.Is_Traded ? 'Yes' : 'No'}</p>
      {currentUser?.id === post.makes && (
        <button onClick={handleViewOffers}>View Offers</button>
      )}
      {showOffersModal && <OfferModal postId={postId} onClose={() => setShowOffersModal(false)} />}
    </div>
  );
};

export default PostPage;
