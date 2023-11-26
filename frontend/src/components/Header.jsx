import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@mui/material/Button'
import { faUserShield, faClipboard, faPlus, faReceipt, faRightFromBracket, faMessage, faHouse, faHeart } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const greeting = isAuthenticated() ? `Hello, ${currentUser?.username || 'User'}!` : 'Hello, Guest!';

  const handleLoginClick = () => navigate('/login');
  const handleSignupClick = () => navigate('/signup');
  const createPost = () => navigate('/CreatePost');
  const viewPost = () => navigate('/user/posts');
  const viewOffers = () => navigate('/user/offers');
  const viewChats = () => navigate("/chats");
  const goHome = () => navigate("/");
  const viewFavorites = () => navigate("/favorites");

  const styles = {
    bar: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center', 
      justifyContent: 'space-around',
      backgroundColor: "lightgray"
    },
    posts:{
      display: "flex",
      flexDirection: "row",
      alignItems: 'center', 
      justifyContent: 'space-around',
    },
    iconStyle:{
      margin: '0 10px'
    }
  };

  return (
    <div style={styles.bar}>
      <div style={styles.iconStyle} onClick={goHome}><FontAwesomeIcon icon={faHouse} /></div>
      <p>{greeting}</p> {/* Render the greeting */}
      {isAuthenticated() ? (
        <>
          <div style={styles.posts}>
            <div style={styles.iconStyle} onClick={createPost}><FontAwesomeIcon icon={faPlus} /></div>
            <div style={styles.iconStyle} onClick={viewPost}><FontAwesomeIcon icon={faClipboard} /></div>
            <div style={styles.iconStyle} onClick={viewOffers}> <FontAwesomeIcon icon={faReceipt} /></div>
            <div style={styles.iconStyle} onClick={viewFavorites}> <FontAwesomeIcon icon={faHeart} /></div>
            {currentUser?.admin && (
            <div style={styles.iconStyle} onClick={() => navigate('/admin')}>
              <FontAwesomeIcon icon={faUserShield} />
            </div>
          )}
          </div>
          <div onClick={viewChats}><FontAwesomeIcon icon={faMessage} /></div>
          <div onClick={logout}><FontAwesomeIcon icon={faRightFromBracket} /></div>
        </>
      ) : (
        <>
          <Button variant="contained" color="primary" onClick={handleSignupClick}>
            Signup
          </Button>
          <Button variant="contained" color="primary" onClick={handleLoginClick}>
            Login
          </Button>
        </>
      )}
    </div>
  );
}

export default Header;
