import React, { useEffect, useState } from 'react';
import './ModalOverlay.css';
import './Modal.css';
import { get, post } from '../middleware/auth.js';

const OffersModal = ({ postId, onClose }) => {
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [filterUserId, setFilterUserId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [acceptingOfferId, setAcceptingOfferId] = useState(null);
  const [isOfferAccepted, setIsOfferAccepted] = useState(false); // New state to track if any offer is accepted


  const offersPerPage = 5;

  const fetchOffers = () => {
    setIsLoading(true);
    get(`/offers/post/${postId}`)
      .then(response => {
        setOffers(response);
        // Check if any offer is accepted
        const acceptedOffer = response.find(offer => offer.completed);
        setIsOfferAccepted(!!acceptedOffer);
        setFilteredOffers(response); 
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching offers:', err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchOffers();
  }, [postId]);

  const confirmAcceptOffer = (userId) => {
    const isConfirmed = window.confirm("Are you sure you want to accept this offer?");
    if (isConfirmed) {
      acceptOffer(userId);
    }
  };

  const acceptOffer = (userId) => {
    setIsLoading(true);
    post('/complete_offer', { user_id: userId, post_id: postId })
      .then(response => {
        console.log(response); 
        setAcceptingOfferId(userId);
        setIsOfferAccepted(true); // Set offer as accepted
        fetchOffers(); 
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error completing offer:', err);
        setIsLoading(false);
      });
  };

  const indexOfLastOffer = currentPage * offersPerPage;
  const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
  const currentOffers = filteredOffers.slice(currentPage * offersPerPage - offersPerPage, currentPage * offersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Offers</h2>
          <button onClick={onClose} className="modal-close-button">X</button>
        </div>
        <div className="modal-body">
          <div>
            <input type="text" placeholder="Filter by User ID" onChange={e => setFilterUserId(e.target.value)} className="modal-input" />
            <input type="date" onChange={e => setStartDate(e.target.value)} className="modal-input" />
            <input type="date" onChange={e => setEndDate(e.target.value)} className="modal-input" />
          </div>
          {isLoading && <p>Loading...</p>}
          {!isLoading && currentOffers.length === 0 && <p>No offers match the filters.</p>}
          {!isLoading && currentOffers.map((offer, index) => (
            <div key={index} className={offer.user_id === acceptingOfferId ? "offer-accepted" : ""}>
              <p>Offer ID: {offer.post_id}-{offer.user_id}</p>
              <p>User ID: {offer.user_id}</p>
              <p>Offer Date: {new Date(offer.offer_date).toLocaleDateString()}</p>
              {!isOfferAccepted && (
                <button onClick={() => confirmAcceptOffer(offer.user_id)} className="offer-accept-button">Accept Offer</button>
              )}
            </div>
          ))}
          <div className="modal-pagination">
            {Array.from({ length: Math.ceil(filteredOffers.length / offersPerPage) }, (_, i) => i + 1).map(number => (
              <button key={number} onClick={() => paginate(number)} className="modal-pagination-button">
                {number}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffersModal;
