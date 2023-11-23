import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../utilities/users.js';
import Header from '../components/Header.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password_hash, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isSignupSuccessful, setIsSignupSuccessful] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    let isValid = true;
    if (!username) {
      toast.error("Username is required.");
      isValid = false;
    }
    if (!email) {
      toast.error("Email is required.");
      isValid = false;
    }
    if (!password_hash) {
      toast.error("Password is required.");
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      const credentials = { username, password_hash, email };
      const response = await addUser(credentials);

      if (response.error) {
        console.error(response.error);
        setIsSignupSuccessful(false);
        toast.error(response.error);
      } else {
        console.log('Signup successful!');
        await login(credentials);
        setIsSignupSuccessful(true);
      }
    } catch (error) {
      console.error('Signup failed:', error);
      setIsSignupSuccessful(false);
      toast.error('Signup failed. Please try again.');
    }
  };

  if (isSignupSuccessful) {
    navigate('/');
  }

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
          <button type="submit" style={styles.submitButton}>Signup</button>
          <small>
            Already have an account? 
            <span 
              style={{ cursor: 'pointer', color: '#007bff', marginLeft: '5px' }} 
              onClick={() => navigate('/login')}
            >
              Log in.
            </span>
          </small>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default Signup;
