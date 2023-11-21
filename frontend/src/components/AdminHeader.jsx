import React from 'react';
import { FaBars, FaHome } from 'react-icons/fa'; // FontAwesome icons

function AdminHeader({ openSidebar }) {
  return (
    <header className='admin-header'>
        <div className='menu-icon' onClick={openSidebar}>
            <FaBars className='icon'/> {/* Menu icon */}
        </div>
        <div className='header-home'>
            <FaHome className='icon'/> {/* Home icon */}
        </div>
    </header>
  );
}

export default AdminHeader;
