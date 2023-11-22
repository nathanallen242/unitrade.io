import React, { useContext } from 'react';
import { FaUserFriends, FaTags, FaBullhorn, FaChartLine } from 'react-icons/fa'; // New icon set
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';
import CountUp from 'react-countup';
import { AdminContext } from '../../context/AdminContext';

function processData(users, offers, posts) {
  const monthlyData = {};

  // Process users
  users.forEach(user => {
    const monthYear = new Date(user.join_date).toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = { users: 0, offers: 0, posts: 0 };
    }
    monthlyData[monthYear].users++;
  });

  // Process offers
  offers.forEach(offer => {
    const monthYear = new Date(offer.offer_date).toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = { users: 0, offers: 0, posts: 0 };
    }
    monthlyData[monthYear].offers++;
  });

  // Process posts
  posts.forEach(post => {
    const monthYear = new Date(post.post_date).toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = { users: 0, offers: 0, posts: 0 };
    }
    monthlyData[monthYear].posts++;
  });

  return Object.entries(monthlyData).map(([month, data]) => ({
    month,
    users: data.users,
    offers: data.offers,
    posts: data.posts
  }));
}

function Dashboard() {
  const { usersData, postsData, offersData } = useContext(AdminContext);

  const userCount = usersData.users.length;
  const postCount = postsData.posts.length;
  const offerCount = offersData.offers.length;

  const chartData = processData(usersData.users, offersData.offers, postsData.posts);

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
            <Line type="monotone" dataKey="posts" stroke="#709fb0" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="users" stroke="#a1c181" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="offers" stroke="#e1a692" activeDot={{ r: 8 }} />
            <Brush dataKey="month" height={30} stroke="#8884d8" />
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
          <p><CountUp end={count} duration={2.75} /></p> {/* Animate the count */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
