import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password_hash, setPassword] = useState('');
  const [email, setEmail] = useState('');
  
  // Extract the login function from the AuthContext
  const { login, isAuthenticated } = useAuth();
  
  // Initialize the useNavigate hook
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
        console.log("User is already logged in. Redirecting to the main page...");
        navigate('/');
    }
}, [navigate]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const credentials = { username, password_hash, email };
      await login(credentials); // Use context's login function here
      console.log('Login successful!');

      // Redirecting to main page after successful login
      navigate('/'); 
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div style={{ width: '300px', margin: '100px auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            Password:
            <input
              type="password"
              value={password_hash}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Login;
