import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import EditModal from '../components/modal/EditModal.jsx';

const Product = ({ post, currentUserId, onDelete, onMakeOffer, userOffers }) => {
  const styles = {
    postBox: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between', // This will push the delete button to the bottom
      border: '1px solid #e1e1e1',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
      height: '100%' // Ensure the height is set to stretch the box if needed
    },
    postTitle: {
      fontSize: '1.5em',
      marginBottom: '8px'
    },
    postDescription: {
      color: '#555',
      marginBottom: '8px'
    },
    postImage: {
      maxWidth: '100%',
      maxHeight: '200px',
      width: 'auto',
      height: 'auto',
      objectFit: 'cover',
      borderRadius: '4px',
      marginBottom: '8px'
    },
    postDetails: {
      color: '#777'
    },
    postDate: {
      color: '#777'
    },
    isTraded: {
      fontWeight: 'bold',
      color: '#c00'
    }
  };

  const isTraded = post.Is_Traded;
  const isPostCreator = currentUserId && post.makes === currentUserId;

  // Apply traded style only if the post is traded and the current user is not the post creator
  const tradedStyle = isTraded && !isPostCreator ? {
    opacity: 0.5,
    pointerEvents: 'none',
    backgroundColor: '#f0f0f0'
  } : {};

  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(`/post/${post.post_id}`);
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    post_id: post.post_id,
    title: '',
    description: '',
    category_id: '',
    image_url: '',
    // Add other fields as necessary
  });

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (!post.post_id) {
      console.error("Post ID is undefined");
      // You can handle this situation appropriately, perhaps by showing an error message
      return;
    }

    setEditFormData({
      title: post.title,
      description: post.description,
      category_id: post.category_id,
      image_url: post.image_url,
    });
    setIsEditModalOpen(true);
  };


  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const hasMadeOffer = userOffers ? userOffers.some(offer => offer.post_id === post.post_id) : false;

  return (
    <li style={{ ...styles.postBox, ...tradedStyle }} onClick={handleNavigation}>
      {isPostCreator && (
      <div style={{ textAlign: 'right'}}>
        <FontAwesomeIcon icon={faEdit} onClick={handleEditClick} />
      </div>
      )}
      <h2 style={styles.postTitle}>{post.title}</h2>
      <p style={styles.postDescription}>{post.description}</p>
      {post.image_url && <img src={post.image_url} alt={post.title} style={styles.postImage} />}
      {post.tags && post.tags.length > 0 && (
        <div className="tagContainer">
          {post.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      )}
      <p style={styles.postDetails}>Category: {post.category_id}</p>
      <p style={styles.postDetails}>Author: {post.author}</p>
      <p style={styles.postDate}>Post Date: {new Date(post.post_date).toLocaleDateString()}</p>
      <p style={styles.isTraded}>Is Traded: {isTraded ? 'Yes' : 'No'}</p>
      {!isPostCreator && !isTraded && (
        <button 
          onClick={(e) => { e.stopPropagation(); onMakeOffer(post.post_id,post.makes); }}
          disabled={hasMadeOffer}
          style={hasMadeOffer ? { backgroundColor: 'grey' } : {}}
        >
          {hasMadeOffer ? 'Offer Made' : 'Make Offer'}
        </button>
      )}
      {!isPostCreator && isTraded && (
        <button style={{ backgroundColor: 'red', cursor: 'not-allowed' }} disabled>
          Post Traded
        </button>
      )}
      {isPostCreator && (
        <button onClick={(e) => { e.stopPropagation(); onDelete(post.post_id); }}>
          Delete
        </button>
      )}
      <EditModal
        isOpen={isEditModalOpen}
        post={editFormData}
        onClose={closeEditModal}
        post_id={post.post_id}
      >
        {/* Form fields and logic for editing the post go here */}
      </EditModal>
    </li>
  );
};

export default Product;
