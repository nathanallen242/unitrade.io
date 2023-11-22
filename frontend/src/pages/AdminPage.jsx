import { useState, useEffect } from 'react';
import './Admin.css';
import Sidebar from '../components/admin/Sidebar';
import Dashboard from '../components/admin/Dashboard';
import AdminHeader from '../components/admin/AdminHeader';
import UsersView from '../components/tables/UsersView'; // Example component for users view
import PostView from '../components/tables/PostView'; // Example component for posts view
import OfferView from '../components/tables/OfferView.jsx';
import { get } from '../middleware/auth.js';

const AdminPage = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [usersData, setUsersData] = useState({ users: [], count: 0 });
  const [postsData, setPostsData] = useState({ posts: [], count: 0 });
  const [offersData, setOffersData] = useState({ offers: [], count: 0 });
  

  useEffect(() => {
    async function fetchData() {
      try {
        const usersResponse = await get('/admin/users');
        const postsResponse = await get('/admin/posts');
        const offersResponse = await get('/admin/offers');

        if (usersResponse) setUsersData(await usersResponse);
        if (postsResponse) setPostsData(await postsResponse);
        if (offersResponse) setOffersData(await offersResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const openSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const renderView = () => {
    switch (activeView) {
      case 'users':
        return <UsersView users={usersData.users} setUsers={setUsersData} />;
      case 'posts':
        return <PostView posts={postsData.posts} />;
      case 'offers':
        return <OfferView offers={offersData.offers} />;
      case 'dashboard':
      default:
        return <Dashboard users={usersData.users} posts={postsData.posts} offers={offersData.offers} />;
    }
  };

  return (
    <div className='grid-container'>
      <AdminHeader openSidebar={openSidebar} />
      <Sidebar 
        openSidebarToggle={openSidebarToggle} 
        openSidebar={openSidebar}
        setActiveView={setActiveView}
        users={usersData.users} 
        posts={postsData.posts} 
        offers={offersData.offers}  
      />
      {renderView()}
    </div>
  );

}

export default AdminPage;
