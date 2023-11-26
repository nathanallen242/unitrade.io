import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import { Modal, Typography } from '@mui/material';
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
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const { currentUser } = useAuth();

  const unauthorizedModal = (
    <Modal
      open={isUnauthorized}
      onClose={() => setIsUnauthorized(false)}
      aria-labelledby="unauthorized-modal-title"
      aria-describedby="unauthorized-modal-description"
    >
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        outline: 'none',
        borderRadius: '10px',
      }}>
        <Typography id="unauthorized-modal-title" variant="h6" component="h2">
          Unauthorized Access
        </Typography>
        <Typography id="unauthorized-modal-description" sx={{ mt: 2 }}>
          You are not authorized to view this page. Redirecting to the main page...
        </Typography>
      </div>
    </Modal>
  );

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

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser || !currentUser.admin) {
      setIsUnauthorized(true);
      setTimeout(() => {
        navigate('/');
      }, 3000); // Redirect after 3 seconds
    }
  }, [currentUser, navigate]);


  return (
    <AdminProvider>
      {unauthorizedModal}
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
