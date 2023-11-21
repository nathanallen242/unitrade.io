import { useState, useEffect } from 'react';
import './Admin.css';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import AdminHeader from '../components/AdminHeader';
import { get } from '../middleware/auth.js';

const AdminPage = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

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

  return (
    <div className='grid-container'>
      <AdminHeader openSidebar={openSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} openSidebar={openSidebar} 
               users={usersData.users} posts={postsData.posts} offers={offersData.offers} />
      <Dashboard users={usersData.users} posts={postsData.posts} offers={offersData.offers} />
    </div>
  );
}

export default AdminPage;
