import React from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";


const NavBar = ({ onSelectCategory }) => {
  const handleCategoryClick = (category) => {
    onSelectCategory(category);
  };

  const styles = {
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#f8f8f8',
      padding: '10px 20px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    link: {
      margin: '0 10px',
      padding: '5px 10px',
      textDecoration: 'none',
      color: '#007bff',
      fontSize: '16px',
      cursor: 'pointer',
    },
    rightSection: {
      // Styles for the right section if needed
    },
  };

  return (
    <div className="navbar" style={styles.navbar}>
      <div>
        <a href="#" onClick={() => handleCategoryClick("ALL")} style={styles.link}>All</a>
        <a href="#" onClick={() => handleCategoryClick("Electronics")} style={styles.link}>Electronics</a>
        <a href="#" onClick={() => handleCategoryClick("Clothing")} style={styles.link}>Clothing</a>
        <a href="#" onClick={() => handleCategoryClick("Home")} style={styles.link}>Home</a>
        <a href="#" onClick={() => handleCategoryClick("Books")} style={styles.link}>Books</a>
        <a href="#" onClick={() => handleCategoryClick("Sports")} style={styles.link}>Sports</a>
        <a href="#" onClick={() => handleCategoryClick("ETC")} style={styles.link}>ETC</a>
      </div>
      <div style={styles.rightSection}>
        {/* <Link to="/chats" className="menuItem" style={styles.link}>CHATS</Link> */}
      </div>
    </div>
  );
};

export default NavBar;
