import React, { useEffect, useState } from 'react'; // Add useState and useEffect imports
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom'; 

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

  return (
    <div>
      <p>{greeting}</p> {/* Render the greeting */}
      {isAuthenticated() ? (
        <>
          <button onClick={createPost}>Create Post</button>
          <button onClick={viewPost}>View Your Posts</button>
          <button onClick={logout}>Logout</button>
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
