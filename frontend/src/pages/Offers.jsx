import React, { useState, useEffect } from 'react';
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

  return (
    <div>
      <h1>My Offers</h1>
      {isLoading ? (
        <p>Loading offers...</p>  // Show a loading message or spinner
      ) : userOffers.length > 0 ? (
        <ul>
          {userOffers.map(offer => (
            <li key={offer.post_id}>
              <p>Offer on Post: {offer.post_id}</p>
              <p>Offer Date: {offer.offer_date}</p>
              <p>Offer Status: {offer.completed ? "Completed" : "In Progress"}</p>
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
