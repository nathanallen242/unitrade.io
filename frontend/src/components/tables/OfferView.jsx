import React, { useState, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext'; // Adjust the path as necessary
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { del } from '../../middleware/auth.js'; // Adjust the path as necessary

const OfferView = () => {
  const { offersData, setOffersData } = useContext(AdminContext);
  const [searchText, setSearchText] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);

  const handleOpenDialog = (postName, offerorName) => {
    setOpenDialog(true);
    setOfferToDelete({ post_name: postName, offeror_name: offerorName });
  };  


  const handleDelete = async () => {
    if (!offerToDelete) {
      console.error("No offer selected for deletion");
      return;
    }
  
    setOpenDialog(false);
  
    const updatedOffersBeforeDeletion = offersData.offers.filter(o => 
      !(o.post_name === offerToDelete.post_name && o.offeror_name === offerToDelete.offeror_name));
  
    // Optimistically update the UI
    setOffersData({ ...offersData, offers: updatedOffersBeforeDeletion });
  
    try {
      const offer = offersData.offers.find(o => o.post_name === offerToDelete.post_name && o.offeror_name === offerToDelete.offeror_name);
      if (!offer) {
        throw new Error(`Offer not found for post: ${offerToDelete.post_name} and offeror: ${offerToDelete.offeror_name}`);
      }
    
      const { post_id: postId, user_id: userId } = offer;
      const response = await del(`/remove_offer`, { post_id: postId, user_id: userId });
  
      if (response.status !== 200) {
        throw new Error('Failed to delete offer');
      }
    } catch (error) {
      console.error(error.message || 'Error deleting offer');
      // Revert to original state in case of error
      setOffersData({ ...offersData, offers: offersData.offers });
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
          onClick={() => handleOpenDialog(params.row.post_name, params.row.offeror_name)}
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
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this offer?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OfferView;
