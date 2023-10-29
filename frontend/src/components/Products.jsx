import React from 'react';
import Product from './Product';

const Products = ({ posts, category }) => {

  // Filtering the posts based on the category provided
  const filteredPosts = category && category !== "ALL" 
    ? posts.filter(post => post.category_id === category)
    : posts;

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
      {filteredPosts.map(post => (
        <Product key={post.post_id} post={post} />
      ))}
    </ul>
  );
};

export default Products;
