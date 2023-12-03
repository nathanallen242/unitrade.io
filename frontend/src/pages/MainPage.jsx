import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx'; // Import AuthContext
import NavBar from '../components/NavBar';
import Products from '../components/Products';
import Header from '../components/Header';
import usePagination from '../hooks/usePagination';
import Pagination from '../components/Pagination';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import { getUnauthenticated, del, post, get } from '../middleware/auth.js';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const MainPage = () => {
  const [posts, setPosts] = useState([]);
  const [userOffers, setUserOffers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const { currentUser } = useAuth();

  // Search functionality by tag, creator, and title
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('postName'); // 'postName', 'creator', or 'tag'
  const [isTradedFilter, setIsTradedFilter] = useState(''); // null, 'traded', 'notTraded'

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleFilterChange = (e) => {
    setIsTradedFilter(e.target.value);
  };

  const {
    currentPage,
    itemsPerPage,
    totalPages,
    setCurrentPage,
    handleItemsPerPageChange,
  } = usePagination(posts.length);

  useEffect(() => {
    getUnauthenticated('/posts').then(data => {
      let filteredPosts = data.filter(post => {
        // Apply search filters
        let searchMatch = true;
        if (searchType === 'postName') {
          searchMatch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchType === 'creator') {
          searchMatch = post.author.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchType === 'tag') {
          searchMatch = post.tags && Array.isArray(post.tags) && post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        }
  
        // Apply traded status filters
        let tradedMatch = true; // Default for "All Posts"
        if (isTradedFilter === 'traded') {
          tradedMatch = post.Is_Traded === true;
        } else if (isTradedFilter === 'notTraded') {
          tradedMatch = post.Is_Traded === false;
        } else if (isTradedFilter === '') {
          tradedMatch = true; // Show all posts regardless of traded status
        }
  
        return searchMatch && tradedMatch;
      });
  
      setPosts(filteredPosts);
    });
  }, [searchTerm, searchType, isTradedFilter]);
  
  

  useEffect(() => {
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

  const handleMakeOffer = async (postId,creator_id) => {
    try {
      await post('/create_offer', { user_id: currentUser.id, post_id: postId });
      const newOffer = { user_id: currentUser.id, post_id: postId };
      setUserOffers([...userOffers, newOffer]);
      
      const url = `${BASE_URL}/chats`; // Replace with your actual API endpoint
      const token = localStorage.getItem("accessToken");

      const data = {
        from_user_id: currentUser.id,
        to_user_id: creator_id,
      };

      axios
        .post(url, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("POST request successful!", response.data);
        })
        .catch((error) => {
          console.error(
            "POST request failed:",
            error.response ? error.response.data : error.message
          );
        });

    } catch (error) {
      console.error('Error making an offer:', error.response?.data?.error || error);
    }
  };

  useEffect(() => {
    let socket;
    if (currentUser?.id) {
      // Establish a connection to the Socket.IO server
      socket = io('http://localhost:8900'); // Replace with your server URL
      socket.emit("addUser", { userId: currentUser?.id, username: currentUser.username });

      // Listen for notifications and log them
      socket.on('sendNotification', (notification) => {
        toast.info(`New message from ${notification.from}: ${notification.preview}`);
      });
      
    }

    // Clean up the socket connection on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [currentUser]);

  return (
    <>
      <Header />
      <NavBar onSelectCategory={setSelectedCategory} />
      {/* Search Input */}
      <div className="search-container">
        <input 
          className="search-input"
          type="text" 
          placeholder="Search..." 
          value={searchTerm} 
          onChange={handleSearchInputChange}
        />
        <select className="search-select" value={searchType} onChange={handleSearchTypeChange}>
          <option value="postName">Post Name</option>
          <option value="creator">Creator</option>
          <option value="tag">Tag</option>
        </select>
        {/* Filter Dropdown */}
        <select className="filter-select" value={isTradedFilter} onChange={handleFilterChange}>
          <option value="">All Posts</option>
          <option value="traded">Traded</option>
          <option value="notTraded">Not Traded</option>
        </select>
      </div>
      <Products posts={posts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
      category={selectedCategory} 
      currentUserId={currentUser?.id} 
      onDelete={handleDelete}
      userOffers={userOffers}
      onMakeOffer={handleMakeOffer}
      isTradedFilter={isTradedFilter}
      />
      <Pagination
        className="pagination-container"
        currentPage={currentPage}
        totalPages={totalPages}
        onNavigate={setCurrentPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        itemsPerPage={itemsPerPage}
      />
    </>
  );
}

export default MainPage;
