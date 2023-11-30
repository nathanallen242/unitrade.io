import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Header from '../components/Header.jsx';
import { toast, ToastContainer } from 'react-toastify';
import LoadingButton from '../components/button/LoadingButton.jsx';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password_hash, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoginSuccessful, setIsLoginSuccessful] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Extract the login function from the AuthContext
  const { login, isAuthenticated } = useAuth();

  // Initialize the useNavigate hook
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated() || isLoginSuccessful) {
      console.log("Navigating to the main page...");
      navigate('/');
      window.location.reload();
    }
  }, [navigate, isLoginSuccessful]);

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
  
    setLoading(true);
    try {
      const credentials = { username, password_hash, email };
      await login(credentials); // Use context's login function here
      console.log('Login successful!');
  
      // Set states for successful login
      setIsLoginSuccessful(true);
      setSuccess(true);
      setLoading(false);
  
      // Navigate to a new route and then refresh the page
      navigate('/', { replace: true });
      setTimeout(() => window.location.reload(), 100);
  
    } catch (error) {
      console.error('Login failed:', error);
      // Set states for failed login
      setIsLoginSuccessful(false);
      setLoading(false);
      setSuccess(false);
      toast.error('Login failed. Please check your credentials.');
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
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center', // Center button horizontally
      alignItems: 'center', // Center button vertically (optional)
      marginTop: '20px', // Add some space above the button
    },
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
          <div style={styles.buttonContainer}>
            <LoadingButton
              onClick={handleSubmit}
              loading={loading}
              success={success}
              text="Login"
            />
          </div>
          <small>
            Don't have an account? 
            <span 
              style={{ cursor: 'pointer', color: '#007bff', marginLeft: '5px' }} 
              onClick={() => navigate('/signup')}
            >
              Sign up!
            </span>
          </small>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
