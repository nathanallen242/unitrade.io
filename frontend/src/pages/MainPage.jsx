import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../context/AuthContext.jsx';// Import AuthContext
import NavBar from '../components/NavBar';
import Products from '../components/Products';
import Header from '../components/Header';
import { getUnauthenticated, del } from '../middleware/auth.js';

const MainPage = () => {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    getUnauthenticated('/posts')
      .then(data => {
        setPosts(data);
      });
  }, []);

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

  return (
    <>
      <Header />
      <NavBar onSelectCategory={setSelectedCategory} />
      <Products posts={posts} category={selectedCategory} currentUserId={currentUser?.id} onDelete={handleDelete} />
    </>
  );
}

export default MainPage;
