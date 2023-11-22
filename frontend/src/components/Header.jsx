import React, { useEffect, useState } from 'react'; // Add useState and useEffect imports
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboard } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { post } from '../middleware/auth.js';
import { faReceipt } from '@fortawesome/free-solid-svg-icons';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faMessage } from '@fortawesome/free-solid-svg-icons';
import { faHouse } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';



const Header = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // State to handle greeting
  const [greeting, setGreeting] = useState('Hello, Guest!'); // Initial greeting

  useEffect(() => {
    if (isAuthenticated()) {
      setGreeting(`Hello, ${currentUser?.username || 'User'}!`); // Update greeting if authenticated
    } else {
      setGreeting('Hello, Guest!'); // Default greeting for unauthenticated users
    }
  }, [currentUser, isAuthenticated]); // Dependencies for the effect

  const handleLoginClick = () => {
    navigate('/login');
  }

  const handleSignupClick = () => {
    navigate('/signup');
  }

  const createPost = () => {
    navigate('/CreatePost');
  }

  const viewPost = () => {
    navigate('/user/posts');
  }

  const viewOffers = () => {
    navigate('/user/offers');
  }
  const viewChats = () =>{
    navigate("/chats")
  }

  const goHome = () =>[
    navigate("/")
  ]

  const viewFavorites = () =>{
    navigate("/favorites")
  }

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
    }
  return (
    <div style={styles.bar}>
      <div style={styles.iconStyle} onClick={goHome}><FontAwesomeIcon icon={faHouse} /></div>

      <p>{greeting}</p> {/* Render the greeting */}
      {isAuthenticated() ? (
        <>

        <div style={styles.posts}>

          <div style={styles.iconStyle} onClick={createPost}><FontAwesomeIcon icon={faPlus} /></div>
          <div style={styles.iconStyle} onClick={viewPost}><FontAwesomeIcon icon={faClipboard}></FontAwesomeIcon> </div>
          <div style={styles.iconStyle} onClick={viewOffers}> <FontAwesomeIcon icon={faReceipt} ></FontAwesomeIcon> </div>
          <div style={styles.iconStyle} onClick={viewFavorites}> <FontAwesomeIcon icon={faHeart} ></FontAwesomeIcon> </div>


        </div>
        
          <div onClick={viewChats}>          <FontAwesomeIcon icon={faMessage} /></div>

          
          <div onClick={logout}>    <FontAwesomeIcon icon={faRightFromBracket}></FontAwesomeIcon></div>
          
        </>
      ) : (
        <>
        <button onClick={handleSignupClick}>Signup</button>
        <button onClick={handleLoginClick}>Login</button>
        </>
      )}
    </div>
  );
}

export default Header;
