import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Header from '../components/Header.jsx';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password_hash, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false); // New state variable
  
  // Extract the login function from the AuthContext
  const { login, isAuthenticated } = useAuth();
  
  // Initialize the useNavigate hook
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated() || isLoginSuccessful) {
        console.log("Navigating to the main page...");
        navigate('/');
    }
  }, [navigate, isLoginSuccessful]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const credentials = { username, password_hash, email };
      await login(credentials); // Use context's login function here
      console.log('Login successful!');
      setIsLoginSuccessful(true); // Update the login status
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoginSuccessful(false); // Reset login status on failure
    }
  };

  const styles = {
    formContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      backgroundColor: '#f4f4f4',
      padding: '20px',
    },
    form: {
      background: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px',
    },
    textarea: {
      width: '100%',
      padding: '12px 15px',
      marginTop: '6px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      boxSizing: 'border-box',
      minHeight: '100px', // Set a minimum height
      fontSize: '16px',
      resize: 'vertical', // Allowing vertical resize
    },
    input: {
      width: '100%',
      padding: '12px 15px', // Increased padding for better touch
      marginTop: '6px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      boxSizing: 'border-box',
      fontSize: '16px', // Making text a bit larger for readability
    },
    inputContainer: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
    },
    submitButton: {
      width: '100%',
      padding: '10px',
      marginTop: '10px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    submitButtonHover: {
      backgroundColor: '#0056b3',
    }
  };

  return (
    <>
      <Header />
      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputContainer}>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <label>Password:</label>
            <input
              type="password"
              value={password_hash}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.submitButton}>Login</button>
        </form>
      </div>
    </>
  );
};

export default Login;
