import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Products from '../components/Products';
import Header from '../components/Header';
import { getUnauthenticated } from '../middleware/auth.js';

const MainPage = () => {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    getUnauthenticated('/posts')
      .then(data => {
        setPosts(data);
      });
  }, []);

  return (
    <>
      <Header />
      <NavBar onSelectCategory={setSelectedCategory} />
      <Products posts={posts} category={selectedCategory} />
    </>
  );
}

export default MainPage;
