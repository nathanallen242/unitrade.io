import React from 'react';
import { useNavigate } from 'react-router-dom';

const Product = ({ post }) => {
  const styles = {
    postBox: {
      border: '1px solid #ccc',
      padding: '16px',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      width: 'calc(33.333% - 16px)' 
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

  

  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(`/post/${post.post_id}`); 
  };

  return (
    <li style={styles.postBox} onClick={handleNavigation}  >
      <h2 style={styles.postTitle}>{post.title}</h2>
      <p style={styles.postDescription}>{post.description}</p>
      {post.image_url && <img src={post.image_url} alt={post.title} style={styles.postImage} />}
      <p style={styles.postDetails}>Category: {post.category_id}</p>
      <p style={styles.postDetails}>Makes: {post.makes}</p>
      <p style={styles.postDate}>Post Date: {new Date(post.post_date).toLocaleDateString()}</p>
      <p style={styles.isTraded}>Is Traded: {post.Is_Traded ? 'Yes' : 'No'}</p>
    </li>
  );
};

export default Product;
