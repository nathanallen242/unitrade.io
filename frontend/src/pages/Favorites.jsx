import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { get, getUnauthenticated } from '../middleware/auth.js';
import Header from '../components/Header.jsx';
import Products from '../components/Products.jsx';

const Favorites = () => {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    // Fetch all posts
    getUnauthenticated('/posts')
      .then(data => {
        setPosts(data);
        //console.log(data)
      })
      .catch(error => console.error('Error fetching posts:', error));

    // Fetch liked (favorite) posts if user is authenticated
    if (currentUser) {
      get(`/favorite/${currentUser.id}`)
        .then(data => {
          setLikedPosts(data.map(fav => fav.post_id));
          //console.log(data.map(fav => fav.post_id))
        })
        .catch(error => console.error('Error fetching liked posts:', error));
    }
  }, [currentUser]);

  const handleMakeOffer = async (postId) => {
    try {
      await post(`/create_offer`, { postId: postId, userId: currentUser?.id });
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

  // Filter out the liked posts
  
  const likedFilteredPosts = posts.filter(post => likedPosts.includes(post.post_id));

  console.log("test", likedFilteredPosts)

  return (
    <div>
      <Header />
      <h1>My Likes</h1>
      {likedFilteredPosts.length > 0 ? (
        <Products
        posts={likedFilteredPosts}
        onDelete={handleDelete}
        onMakeOffer={handleMakeOffer}
        isTradedFilter='' 
        currentUserId={currentUser?.id}
        />
      ) : (
        <div>No liked posts found.</div>
      )}
    </div>
  );
};

export default Favorites;
