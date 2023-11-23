import React from 'react';
import { FaBars, FaHome } from 'react-icons/fa'; // FontAwesome icons
import { useNavigate } from 'react-router-dom';

function AdminHeader({ openSidebar }) {

  // navigate home upon button-click

  const navigate = useNavigate();

  const navigateHome = () => {
    navigate('/');
  };


  return (
    <header className='admin-header'>
        <div className='menu-icon' onClick={openSidebar}>
            <FaBars className='icon'/> {/* Menu icon */}
        </div>
        <div className='header-home' onClick={navigateHome}>
            <FaHome className='icon'/> {/* Home icon */}
        </div>
    </header>
  );
}

export default AdminHeader;
