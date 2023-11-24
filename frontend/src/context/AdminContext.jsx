import React, { createContext, useState, useEffect } from 'react';
import { get } from '../middleware/auth.js';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [usersData, setUsersData] = useState({ users: [], count: 0 });
  const [postsData, setPostsData] = useState({ posts: [], count: 0 });
  const [offersData, setOffersData] = useState({ offers: [], count: 0 });

  useEffect(() => {
    async function fetchData() {
      try {
        const usersResponse = await get('/admin/users');
        const postsResponse = await get('/admin/posts');
        const offersResponse = await get('/admin/offers');

        if (usersResponse) setUsersData(usersResponse);
        if (postsResponse) setPostsData(postsResponse);
        if (offersResponse) setOffersData(offersResponse);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <AdminContext.Provider value={{ usersData, setUsersData, postsData, setPostsData, offersData, setOffersData }}>
      {children}
    </AdminContext.Provider>
  );
};
