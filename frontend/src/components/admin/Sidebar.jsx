import React from 'react';
import { FaTh, FaUser, FaEnvelopeOpenText, FaTag } from 'react-icons/fa';

function Sidebar({ openSidebarToggle, openSidebar, users, posts, offers, setActiveView }) {

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <span className='close-icon' onClick={openSidebar}>X</span>
        <h2>Admin Panel</h2>
      </div>

      <ul className='sidebar-list'>
        <li className='sidebar-list-item' onClick={() => setActiveView('dashboard')}>
          <a href="#"><FaTh className='icon'/> Dashboard</a>
        </li>
          <li className='sidebar-list-item' onClick={() => setActiveView('users')}>
          <a href="#"><FaUser className='icon'/> Users</a>
        </li>
        <li className='sidebar-list-item' onClick={() => setActiveView('posts')}>
          <a href="#"><FaEnvelopeOpenText className='icon'/> Posts</a>
        </li>
        <li className='sidebar-list-item' onClick={() => setActiveView('offers')}>
          <a href="#"><FaTag className='icon'/> Offers</a>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
