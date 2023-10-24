import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Product from './Product';
import { get } from '../middleware/auth';

const Products = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/posts`)
      .then(response => {
        console.log(response.data);
        setPosts(response.data);
      });
  }, []);




  

  const styles = {
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '16px',
      listStyleType: 'none',
      padding: '0',
    }
  };

  return (
    <ul style={styles.container}>
      {posts.map(post => (
        <Product key={post.post_id} post={post} />
      ))}
    </ul>
  );
};

export default Products;
