import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';
import Button from '@mui/material/Button';

const LoadingButton = ({ onClick, loading, success, text }) => {
  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      },
    }),
  };

  return (
    <div style={{ position: 'relative' }}>
      <Button
        variant="contained"
        sx={buttonSx}
        disabled={loading}
        onClick={onClick}
      >
        {text}
      </Button>
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            color: green[500],
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      )}
    </div>
  );
};

export default LoadingButton;
