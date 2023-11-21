import React from 'react';
import { FaUserFriends, FaTags, FaBullhorn, FaChartLine } from 'react-icons/fa'; // New icon set
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { get, post, put, del } from '../middleware/auth.js';
import { useState, useEffect } from 'react';

function Dashboard({ users, posts, offers }) {
  // Assuming users, posts, and offers are arrays
  const userCount = users.length;
  const postCount = posts.length;
  const offerCount = offers.length;

  // Modify or remove this based on your actual data structure
  const chartData = [
    { posts: postCount, users: userCount, offers: offerCount },
    // More data...
  ];

  return (
    <div className='dashboard'>
      <h2 className='dashboard-title'>Admin Dashboard</h2>

      <section className='dashboard-cards'>
        <DashboardCard title="Users" count={userCount} icon={<FaUserFriends />} />
        <DashboardCard title="Posts" count={postCount} icon={<FaBullhorn />} />
        <DashboardCard title="Offers" count={offerCount} icon={<FaChartLine />} />
      </section>

      <section className='dashboard-charts'>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="posts" stroke="#709fb0" />
            <Line type="monotone" dataKey="users" stroke="#a1c181" />
            <Line type="monotone" dataKey="offers" stroke="#e1a692" />
          </LineChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}

// DashboardCard component for individual cards
function DashboardCard({ title, count, icon }) {
  return (
    <div className='dashboard-card'>
      <div className='card-content'>
        <span className='card-icon'>{icon}</span>
        <div className='card-info'>
          <h3>{title}</h3>
          <p>{count}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
