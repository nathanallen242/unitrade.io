import React from 'react';
import { FaTh, FaUser, FaEnvelopeOpenText, FaTag } from 'react-icons/fa';

function Sidebar({ openSidebarToggle, openSidebar, users, posts, offers }) {
  
  const logUsers = () => {
    console.log('Users:', users);
  };

  const logPosts = () => {
    console.log('Posts:', posts);
  };

  const logOffers = () => {
    console.log('Offers:', offers);
  };

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <span className='close-icon' onClick={openSidebar}>X</span>
        <h2>Admin Panel</h2>
      </div>

      <ul className='sidebar-list'>
        <li className='sidebar-list-item'>
          <a href="#"><FaTh className='icon'/> Dashboard</a>
        </li>
        <li className='sidebar-list-item' onClick={logUsers}>
          <a href="#"><FaUser className='icon'/> Users</a>
        </li>
        <li className='sidebar-list-item' onClick={logPosts}>
          <a href="#"><FaEnvelopeOpenText className='icon'/> Posts</a>
        </li>
        <li className='sidebar-list-item' onClick={logOffers}>
          <a href="#"><FaTag className='icon'/> Offers</a>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
