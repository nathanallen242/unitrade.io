import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../context/AuthContext.jsx';// Import AuthContext
import NavBar from '../components/NavBar';
import Products from '../components/Products';
import Header from '../components/Header';
import { getUnauthenticated, del, post, get } from '../middleware/auth.js';

const MainPage = () => {
  const [posts, setPosts] = useState([]);
  const [userOffers, setUserOffers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Fetch posts
    getUnauthenticated('/posts')
      .then(data => {
        setPosts(data);
      });
  }, []);  // This effect runs only once when the component mounts
  
  useEffect(() => {
    // Fetch user offers if a user is logged in
    if (currentUser?.id) {
      get(`/offers/user/${currentUser.id}`)
        .then(data => {
          setUserOffers(data);
        });
    }
  }, [currentUser]);

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await del(`/posts/${postId}`);
        setPosts(currentPosts => currentPosts.filter(post => post.post_id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleMakeOffer = async (postId) => {
    try {
      await post('/create_offer', { user_id: currentUser.id, post_id: postId });
      // Additional logic if needed
    } catch (error) {
      console.error('Error making an offer:', error.response?.data?.error || error);
    }
  };

  return (
    <>
      <Header />
      <NavBar onSelectCategory={setSelectedCategory} />
      <Products posts={posts} 
      category={selectedCategory} 
      currentUserId={currentUser?.id} 
      onDelete={handleDelete}
      userOffers={userOffers}
      onMakeOffer={handleMakeOffer} />
    </>
  );
}

export default MainPage;
