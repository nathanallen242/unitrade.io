import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch'; // Import Switch here
import { del } from '../../middleware/auth.js';

const UsersView = ({ users, setUsers }) => {

  const [searchText, setSearchText] = useState('');
  const [showAdminsOnly, setShowAdminsOnly] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Modal dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Dialog related state handling
  const handleOpenDialog = (username) => {
    setOpenDialog(true);
    setUserToDelete(username);
  };

  const handleDateChange = (userId, newDate) => {
    // Implement logic to update the user's join date
    console.log(`Update join date for user ID ${userId}:`, newDate);
    // Here you would typically make an API call to update the user's join date
  };

  const handleDelete = async (username) => {
    const userToDelete = users.find(user => user.username === username);
    
    if (!userToDelete) {
      console.error('No user found with username:', username);
      return;
    }
  
    const userId = userToDelete.user_id;
    try {
      const response = await del(`/users/${userId}`);
      console.log('Delete response:', response);  // Log the response for debugging
  
      if (response.status === 200) {
        console.log('User deleted successfully:', username);
        const updatedUsers = users.filter(user => user.user_id !== userId);
        setUsers(updatedUsers);
  
        console.log('Refreshing the page');  // Log to confirm this line is reached
        window.location.reload();  // Refresh the page
      } else {
        console.error('Failed to delete user:', username);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
    setOpenDialog(false); // Close the dialog
  };
  
  

  const handleToggleAdmin = (userId) => {
    // Implement logic to toggle admin status
    console.log('Toggle admin status for user ID:', userId);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleAdminFilterChange = (event) => {
    setShowAdminsOnly(event.target.checked);
  };

  // Filtering functionality
  const filteredRows = users
    .filter(user => 
      user.username.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter(user => !showAdminsOnly || user.isAdmin);

  const columns = [
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'join_date', 
        headerName: 'Join Date', 
        width: 180,
      renderCell: (params) => (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Join Date"
          value={selectedDate}
          onChange={(newDate) => handleDateChange(params.row.user_id, newDate)}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    ),
    editable: true,  },
    {
      field: 'isAdmin',
      headerName: 'Administrator',
      width: 120,
      renderCell: (params) => (
        <Button onClick={() => handleToggleAdmin(params.row.user_id)}>
          {params.row.isAdmin ? 'Yes' : 'No'}
        </Button>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button color="error" onClick={() => handleOpenDialog(params.row.username)}>
          Delete
        </Button>
      ),
    },
  ];

  // Altered rows based on filter functionality
  const rows = filteredRows.map(user => ({
    id: user.user_id,
    username: user.username,
    email: user.email,
    join_date: new Date(user.join_date).toLocaleDateString(),
    isAdmin: user.isAdmin,
  }));

  // Export to CSV functionality
  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    const headers = 'Username, Email, Join Date, Is Admin\n';
    csvContent += headers;

    filteredRows.forEach(row => {
      const { username, email, join_date, isAdmin } = row;
      csvContent += `${username}, ${email}, ${join_date}, ${isAdmin ? 'Yes' : 'No'}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'users_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div style={{ height: 400, width: '100%', marginBottom: '20px'  }}>
      <div style={{ marginBottom: '10px' }}>
      <TextField
        label="Search Users"
        variant="outlined"
        value={searchText}
        onChange={handleSearchChange}
        style={{ marginRight: '10px' }}
      />
      <FormControlLabel
        control={<Switch checked={showAdminsOnly} onChange={handleAdminFilterChange} />}
        label="Show Admins Only"
      />
      <Button variant="contained" color="primary" onClick={exportToCSV}>
          Export to CSV
      </Button>
    </div>
      <DataGrid
        key={users.length}
        rows={rows}
        columns={columns}
        pageSize={5}
        checkboxSelection
        disableSelectionOnClick
        // Enable sorting
        sortModel={[
          {
            field: 'username', // Sort by username or 'join_date' for date
            sort: 'asc', // 'asc' or 'desc'
          },
        ]}
      />
      {/* Dialog component */}
    <Dialog
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this user?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDialog(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={() => handleDelete(userToDelete)} color="primary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
    </div>
  );
};

export default UsersView;
