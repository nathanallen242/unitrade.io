import React, { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { get } from '../middleware/auth.js';


const Offers = () => {
  const [userOffers, setUserOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useAuth();

  const fetchUserOffers = async () => {
    if (currentUser) {
      try {
        setIsLoading(true);  // Set loading to true when starting to fetch
        const offers = await get(`/offers/user/${currentUser.id}`);
        setUserOffers(Array.isArray(offers) && offers.length ? offers : []);
      } catch (error) {
        console.error('Error fetching user offers:', error);
      } finally {
        setIsLoading(false);  // Set loading to false after fetching is complete
      }
    }
  };
  useEffect(() => {
    fetchUserOffers();
  }, [currentUser]);

  const styles = {
    offerContainer: {
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '15px',
      margin: '10px 0',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#f9f9f9',
      maxWidth: '600px', // Limiting width for better appearance
      marginLeft: 'auto', // Centering the box
      marginRight: 'auto',
    },
    offerList: {
      listStyleType: 'none',
      padding: 0,
    },
    offerDetail: {
      margin: '5px 0',
    },
    // Add other styles if needed
  };

  return (
    <div>
      <Header></Header>
      <h1>My Offers</h1>
      {isLoading ? (
        <p>Loading offers...</p> // Show a loading message or spinner
      ) : userOffers.length > 0 ? (
        <ul style={styles.offerList}>
          {userOffers.map(offer => (
            <li key={offer.post_id} style={styles.offerContainer}>
              <p style={styles.offerDetail}>Offer on Post: {offer.post_id}</p>
              <p style={styles.offerDetail}>Offer Date: {offer.offer_date}</p>
              <p style={styles.offerDetail}>Offer Status: {offer.completed ? "Completed" : "In Progress"}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No offers made yet!</p>
      )}
    </div>
  );
};

export default Offers;
