import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import Sidebar from '../components/admin/Sidebar';
import Dashboard from '../components/admin/Dashboard';
import AdminHeader from '../components/admin/AdminHeader';
import UsersView from '../components/tables/UsersView';
import PostView from '../components/tables/PostView';
import OfferView from '../components/tables/OfferView';
import { AdminProvider } from '../context/AdminContext';
import { useAuth } from '../context/AuthContext';

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
