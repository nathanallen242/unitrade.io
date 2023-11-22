import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const OfferView = ({ offers }) => {
  const [searchText, setSearchText] = useState('');

  const handleDelete = (offerId) => {
    console.log('Delete offer with ID:', offerId);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value.toLowerCase());
  };

  // Updated filter logic
  const filteredRows = offers.filter(offer =>
    offer.post_name.toLowerCase().includes(searchText) ||
    offer.offeror_name.toLowerCase().includes(searchText)
  );

  // Updated rows mapping
  const rows = filteredRows.map(offer => ({
    id: `${offer.post_id}-${offer.user_id}`, // Composite key
    post_name: offer.post_name,
    offeror_name: offer.offeror_name,
    offer_date: new Date(offer.offer_date).toLocaleString(),
    completed: offer.completed ? 'Yes' : 'No',
  }));

  // Updated columns
  const columns = [
    { field: 'post_name', headerName: 'Post', width: 150 },
    { field: 'offeror_name', headerName: 'Offeror', width: 150 },
    { field: 'offer_date', headerName: 'Offer Date', width: 200 },
    { field: 'completed', headerName: 'Status', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button color="error" onClick={() => handleDelete(params.id)}>
          Delete
        </Button>
      ),
    },
  ];

  // Updated CSV export function
  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    const headers = 'Post Name, Offeror Name, Offer Date, Completed\n';
    csvContent += headers;

    filteredRows.forEach(row => {
      const { post_name, offeror_name, offer_date, completed } = row;
      csvContent += `"${post_name}", "${offeror_name}", ${offer_date}, ${completed}\n`;
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
