import React, { useState, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext'; // Adjust the path as necessary
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import { del } from '../../middleware/auth.js'; // Adjust the path as necessary

const OfferView = () => {
  const { offersData, setOffersData } = useContext(AdminContext);
  const [searchText, setSearchText] = useState('');

  const handleDelete = async (postName, offerorName) => {
    const offerToDelete = offersData.offers.find(offer => offer.post_name === postName && offer.offeror_name === offerorName);

    if (!offerToDelete) {
      console.error('Offer not found');
      return;
    }

    const { post_id: postId, user_id: userId } = offerToDelete;

    // Optimistically update the UI
    const updatedOffers = offersData.offers.filter(offer => offer !== offerToDelete);
    setOffersData({ ...offersData, offers: updatedOffers });

    try {
      const response = await del(`/remove_offer`, { post_id: postId, user_id: userId });

      if (response.status !== 200) {
        console.error('Failed to delete offer:', response.statusText);
        // Revert the change if deletion fails
        setOffersData({ ...offersData });
      }
    } catch (error) {
      console.error('Error deleting offer:', error);
      // Revert the change in case of error
      setOffersData({ ...offersData });
    }
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value.toLowerCase());
  };

  const filteredRows = offersData.offers.filter(offer =>
    offer.post_name.toLowerCase().includes(searchText) ||
    offer.offeror_name.toLowerCase().includes(searchText)
  );

  // Updated rows mapping
  const rows = filteredRows.map(offer => ({
    id: `${offer.post_id}-${offer.user_id}`, // Composite key
    post_name: offer.post_name,
    offeror_name: offer.offeror_name,
    offer_date: new Date(offer.offer_date).toLocaleString(),
    status: offer.status,
  }));

  // Updated columns
  const columns = [
    { field: 'post_name', headerName: 'Post', width: 150 },
    { field: 'offeror_name', headerName: 'Offeror', width: 150 },
    { field: 'offer_date', headerName: 'Offer Date', width: 200 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => handleDelete(params.row.post_name, params.row.offeror_name)}
        >
        </Button>
      ),
    },
  ];

  // Updated CSV export function
  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    const headers = 'Post Name, Offeror Name, Offer Date, Status\n';
    csvContent += headers;

    filteredRows.forEach(row => {
      const { post_name, offeror_name, offer_date, status } = row;
      csvContent += `"${post_name}", "${offeror_name}", ${offer_date}, ${status}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'offers_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ height: 400, width: '100%', marginBottom: '20px' }}>
      <div style={{ marginBottom: '10px' }}>
        <TextField
          label="Search Offers"
          variant="outlined"
          value={searchText}
          onChange={handleSearchChange}
          style={{ marginRight: '10px' }}
        />
        <Button variant="contained" color="primary" onClick={exportToCSV}>
          Export to CSV
        </Button>
      </div>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
};

export default OfferView;
