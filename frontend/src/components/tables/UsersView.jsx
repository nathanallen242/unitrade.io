import React, { useState, useContext } from 'react';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import FormControlLabel from '@mui/material/FormControlLabel';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete'; // Import the delete icon
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch'; // Import Switch here
import { del, put } from '../../middleware/auth.js';
import { AdminContext } from '../../context/AdminContext'; // Adjust the path as necessary

const UsersView = () => {

  const { usersData, setUsersData } = useContext(AdminContext);
  const [searchText, setSearchText] = useState('');
  const [showAdminsOnly, setShowAdminsOnly] = useState(false);

  // Modal dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Dialog related state handling
  const handleOpenDialog = (username) => {
    setOpenDialog(true);
    setUserToDelete(username);
  };

  const handleDateChange = async (username, newDate) => {
    const userIndex = usersData.users.findIndex(user => user.username === username);
    if (userIndex === -1) {
      console.error(`User not found with username: ${username}`);
      return;
    }
  
    // Format the new date
    const formattedNewDate = newDate.toISOString().split('T')[0];
  
    // Optimistically update the user's join date in the UI
    const updatedUsers = [...usersData.users];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      join_date: formattedNewDate,
    };
    setUsersData({ ...usersData, users: updatedUsers });
  
    // Make API call
    try {
      const formData = new FormData();
      formData.append('join_date', formattedNewDate);
      const response = await put(`/users/${updatedUsers[userIndex].user_id}`, formData);
  
      if (response.status !== 200) {
        // Revert UI update on failure
        console.error(`Failed to update join date for username: ${username}`);
        setUsersData({ ...usersData }); // Reset to the original state
      }
    } catch (error) {
      console.error(`Error updating join date for username: ${username}:`, error);
      // Revert to original state in case of error
      setUsersData({ ...usersData }); // Reset to the original state
    }
  };
  

  const handleDelete = async (username) => {
    const userToDelete = usersData.users.find(user => user.username === username);
    
    if (!userToDelete) {
      console.error('No user found with username:', username);
      return;
    }
  
    const userId = userToDelete.user_id;
    try {
      const response = await del(`/users/${userId}`);
    
      if (response.status === 200) {
        console.log('User deleted successfully:', username);
        const updatedUsers = usersData.users.filter(user => user.user_id !== userId);
        setUsersData({ ...usersData, users: updatedUsers });
      } else {
        console.error('Failed to delete user:', username);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
    setOpenDialog(false); // Close the dialog
  };
  
  

  const handleToggleAdmin = async (username) => {
    const currentUserIndex = usersData.users.findIndex(user => user.username === username);
    if (currentUserIndex === -1) {
      console.error(`User not found with username: ${username}`);
      return;
    }
  
    // Optimistically update the admin status in UI
    const updatedUsers = [...usersData.users];
    updatedUsers[currentUserIndex] = {
      ...updatedUsers[currentUserIndex],
      isAdmin: !updatedUsers[currentUserIndex].isAdmin,
    };
  
    setUsersData({ ...usersData, users: updatedUsers });
  
    // Make API call
    try {
      const formData = new FormData();
      formData.append('isAdmin', updatedUsers[currentUserIndex].isAdmin);
      const response = await put(`/users/${updatedUsers[currentUserIndex].user_id}`, formData);
  
      if (response.status !== 200) {
        // If API call fails, revert the admin status
        console.error(`Failed to toggle admin status for user ID ${updatedUsers[currentUserIndex].user_id}`);
        updatedUsers[currentUserIndex].isAdmin = !updatedUsers[currentUserIndex].isAdmin;
        setUsersData({ ...usersData, users: updatedUsers });
      }
    } catch (error) {
      console.error('Error toggling admin status:', error);
      // Revert the admin status in case of error
      updatedUsers[currentUserIndex].isAdmin = !updatedUsers[currentUserIndex].isAdmin;
      setUsersData({ ...usersData, users: updatedUsers });
    }
  };
  

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleAdminFilterChange = (event) => {
    setShowAdminsOnly(event.target.checked);
  };

  // Filtering functionality
  const filteredRows = usersData.users
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
          value={params.row.join_date ? new Date(params.row.join_date) : null}
          onChange={(newDate) => handleDateChange(params.row.username, newDate)}
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
        <Button onClick={() => handleToggleAdmin(params.row.username)}>
          {params.row.isAdmin ? 'Yes' : 'No'}
        </Button>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Button
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => handleOpenDialog(params.row.username)}
        >
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
        key={usersData.length}
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
