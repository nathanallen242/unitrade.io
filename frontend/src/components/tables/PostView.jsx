import React, { useState, useContext } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete'; // Import the delete icon
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { AdminContext } from '../../context/AdminContext'; 
import { del } from '../../middleware/auth';

const PostView = () => {
  const { postsData, setPostsData } = useContext(AdminContext);
  const [searchText, setSearchText] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);


  const handleOpenDialog = (postTitle) => {
    setOpenDialog(true);
    setPostToDelete(postTitle);
  };
  

  const handleSearchChange = (event) => {
    setSearchText(event.target.value.toLowerCase());
  };

  const handleDelete = async () => {
    if (!postToDelete) {
      console.error("No post selected for deletion");
      return;
    }
  
    setOpenDialog(false);
  
    // Find the post ID using the title
    const post = postsData.posts.find(post => post.title === postToDelete);
    if (!post) {
      console.error(`Post not found with title: ${postToDelete}`);
      return;
    }
  
    const postId = post.post_id;

    // Optimistically update the UI
    const updatedPostsBeforeDeletion = postsData.posts.filter(p => p.post_id !== postId);
    setPostsData({ ...postsData, posts: updatedPostsBeforeDeletion });
  
    try {
      const response = await del(`/posts/${postId}`);
      if (response.status !== 200) {
        // Revert the change if deletion fails
        console.error(`Failed to delete post with title: ${postToDelete}`);
        setPostsData({ ...postsData }); // Reset to the original state
      }
    } catch (error) {
      console.error(`Failed to delete post with title: ${postToDelete}`, error);
      // Revert to original state in case of error
      setPostsData({ ...postsData }); // Reset to the original state
    }
  };
  

  const handleRowClick = (params) => {
    const postUrl = `/post/${params.row.id}`;
    window.open(postUrl, '_blank');
  };


  const filteredRows = postsData.posts.filter(post => 
    post.title.toLowerCase().includes(searchText) ||
    post.description.toLowerCase().includes(searchText)
  );

  const rows = filteredRows.map(post => ({
    id: post.post_id,
    title: post.title,
    category: post.category_id,
    description: post.description,
    post_date: new Date(post.post_date).toLocaleString(),
    is_traded: post.Is_Traded ? 'No' : 'Yes',
    makes: post.username,
  }));

  const columns = [
    { field: 'title',
    headerName: 'Title',
    width: 200,
    renderCell: (params) => (
      <div
        style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
        onClick={(e) => {
          e.stopPropagation(); // Prevents row click event
          const postUrl = `/post/${params.row.id}`;
          window.open(postUrl, '_blank');
        }}
      >
        {params.row.title}
      </div>
    ), },
    { field: 'category', headerName: 'Category', width: 130 },
    { field: 'description', headerName: 'Description', width: 200 },
    { field: 'post_date', headerName: 'Post Date', width: 180 },
    { field: 'is_traded', headerName: 'Available?', width: 120 },
    { field: 'makes', headerName: 'Creator', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <Button
          color="error"
          startIcon={<DeleteIcon />}
          onClick={(e) => {
            e.stopPropagation();
            handleOpenDialog(params.row.title); // Pass the post title
          }}
        >
        </Button>
      ),
    },
  ];

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    const headers = 'Title, Category, Description, Post Date, Available?, Creator\n';
    csvContent += headers;

    filteredRows.forEach(row => {
      const { title, category, description, post_date, is_traded, makes } = row;
      csvContent += `${title}, ${category}, ${description}, ${post_date}, ${is_traded}, ${makes}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'posts_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ height: 400, width: '100%', marginBottom: '20px' }}>
      <div style={{ marginBottom: '10px' }}>
        <TextField
          label="Search Posts"
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
        onRowClick={handleRowClick}
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
            Are you sure you want to delete this post?
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

export default PostView;
