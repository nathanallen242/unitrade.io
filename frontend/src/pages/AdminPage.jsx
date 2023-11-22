import React, { useState, useContext } from 'react';
import './Admin.css';
import Sidebar from '../components/admin/Sidebar';
import Dashboard from '../components/admin/Dashboard';
import AdminHeader from '../components/admin/AdminHeader';
import UsersView from '../components/tables/UsersView';
import PostView from '../components/tables/PostView';
import OfferView from '../components/tables/OfferView';
import { AdminProvider, AdminContext } from '../context/AdminContext';

const AdminPage = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  const openSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const renderView = () => {
    switch (activeView) {
      case 'users':
        return <UsersView />;
      case 'posts':
        return <PostView />;
      case 'offers':
        return <OfferView />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <AdminProvider>
      <div className='grid-container'>
        <AdminHeader openSidebar={openSidebar} />
        <Sidebar 
          openSidebarToggle={openSidebarToggle} 
          openSidebar={openSidebar}
          setActiveView={setActiveView}
        />
        {renderView()}
      </div>
    </AdminProvider>
  );
}

export default AdminPage;
