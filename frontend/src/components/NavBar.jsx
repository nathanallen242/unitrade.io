import React from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";

const NavBar = ({ onSelectCategory }) => {
  const handleCategoryClick = (category) => {
    onSelectCategory(category);
  }

  return (
    <div className="navbar" style={{display:"flex", justifyContent:"space-between"}}>
      <div>
        <a href="#" onClick={() => handleCategoryClick("ALL")}>
          All
        </a>
        <a href="#" onClick={() => handleCategoryClick("Electronics")}>
          Electronics
        </a>
        <a href="#" onClick={() => handleCategoryClick("Clothing")}>
          Clothing
        </a>
        <a href="#" onClick={() => handleCategoryClick("Home")}>
          Home
        </a>
        <a href="#" onClick={() => handleCategoryClick("Books")}>
          Books
        </a>
        <a href="#" onClick={() => handleCategoryClick("Sports")}>
          Sports
        </a>
      </div>
      <div>
        <Link
          to={{
            pathname: "/chats",
          }}
          className="menuItem"
        >
          CHATS
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
