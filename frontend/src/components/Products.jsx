import React, { useState, useEffect } from 'react';
import { getUnauthenticated } from '../middleware/auth.js';
import Product from './Product';

const Products = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getUnauthenticated('/posts')
      .then(data => {
        console.log(data);
        setPosts(data);
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
