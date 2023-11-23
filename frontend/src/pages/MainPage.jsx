import React, { useState, useEffect} from 'react';
import { useAuth } from '../context/AuthContext.jsx';// Import AuthContext
import NavBar from '../components/NavBar';
import Products from '../components/Products';
import Header from '../components/Header';
import usePagination from '../hooks/usePagination';
import Pagination from '../components/Pagination';
import { getUnauthenticated, del, post, get } from '../middleware/auth.js';

const MainPage = () => {
  const [posts, setPosts] = useState([]);
  const [userOffers, setUserOffers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { currentUser } = useAuth();

  // Search functionality by tag, creator, and title
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('postName'); // 'postName', 'creator', or 'tag'

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
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
      // Filter posts based on search term and type
      const filteredPosts = data.filter(post => {
        if (searchType === 'postName') {
          return post.title.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchType === 'creator') {
          return post.author.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (searchType === 'tag') {
          // Check if tags exist and is an array
          return post.tags && Array.isArray(post.tags) && post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return true;
      });
  
      setPosts(filteredPosts);
    });
  }, [searchTerm, searchType]); // Add searchTerm and searchType as dependencies
  
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
      // Optimistically update the userOffers state
      const newOffer = { user_id: currentUser.id, post_id: postId };
      setUserOffers([...userOffers, newOffer]);
    } catch (error) {
      console.error('Error making an offer:', error.response?.data?.error || error);
    }
  };

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
      </div>
      <Products posts={posts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
      category={selectedCategory} 
      currentUserId={currentUser?.id} 
      onDelete={handleDelete}
      userOffers={userOffers}
      onMakeOffer={handleMakeOffer} 
      isTraded={(postId) => posts.some(post => post.post_id === postId && post.Is_Traded)} 
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
