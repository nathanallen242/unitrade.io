import React from 'react';

const NavBar = ({ onSelectCategory }) => {
  const handleCategoryClick = (category) => {
    onSelectCategory(category);
  }

  return (
    <div className="navbar">
      <a href="#" onClick={() => handleCategoryClick('ALL')}>All</a>
      <a href="#" onClick={() => handleCategoryClick('Electronics')}>Electronics</a>
      <a href="#" onClick={() => handleCategoryClick('Clothing')}>Clothing</a>
      <a href="#" onClick={() => handleCategoryClick('Home')}>Home</a>
      <a href="#" onClick={() => handleCategoryClick('Books')}>Books</a>
      <a href="#" onClick={() => handleCategoryClick('Sports')}>Sports</a>
    </div>
  );
};

export default NavBar;
