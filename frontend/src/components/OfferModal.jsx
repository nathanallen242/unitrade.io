import React, { useEffect, useState } from 'react';
import { get } from '../middleware/auth.js';

const OffersModal = ({ postId, onClose }) => {
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filterUserId, setFilterUserId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const offersPerPage = 5;

  useEffect(() => {
    setIsLoading(true);
    get(`/offers/post/${postId}`)
      .then(response => {
        setOffers(response);
        setFilteredOffers(response); // Initialize with all offers
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching offers:', err);
        setIsLoading(false);
      });
  }, [postId]);

  useEffect(() => {
    const filtered = offers.filter(offer => {
      const offerDate = new Date(offer.offer_date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      return (!filterUserId || offer.user_id.toString() === filterUserId) &&
             (!start || offerDate >= start) &&
             (!end || offerDate <= end);
    });
    setFilteredOffers(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  }, [filterUserId, startDate, endDate, offers]);

  const indexOfLastOffer = currentPage * offersPerPage;
  const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
  const currentOffers = filteredOffers.slice(indexOfFirstOffer, indexOfLastOffer);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h2>Offers</h2>
      <div>
        <input type="text" placeholder="Filter by User ID" onChange={e => setFilterUserId(e.target.value)} />
        <input type="date" placeholder="Start Date" onChange={e => setStartDate(e.target.value)} />
        <input type="date" placeholder="End Date" onChange={e => setEndDate(e.target.value)} />
      </div>
      {isLoading && <p>Loading...</p>}
      {!isLoading && currentOffers.length === 0 && <p>No offers match the filters.</p>}
      {!isLoading && currentOffers.map((offer, index) => (
        <div key={index}>
          <p>Offer ID: {offer.post_id}-{offer.user_id}</p>
          <p>User ID: {offer.user_id}</p>
          <p>Offer Date: {new Date(offer.offer_date).toLocaleDateString()}</p>
        </div>
      ))}
      <div>
        {Array.from({ length: Math.ceil(filteredOffers.length / offersPerPage) }, (_, i) => i + 1).map(number => (
          <button key={number} onClick={() => paginate(number)}>
            {number}
          </button>
        ))}
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default OffersModal;
