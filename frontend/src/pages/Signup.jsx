import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom'; 
import { addUser } from '../utilities/users.js';
import { useAuth } from '../context/AuthContext.jsx';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password_hash, setPassword] = useState('');
  const [email, setEmail] = useState('');

  // Extract the login function from the AuthContext
  const { login } = useAuth();

  // Initialize the useNavigate hook
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const credentials = { username, password_hash, email };
      const response = await addUser(credentials);
      if (response.error) {
        console.error(response.error);
      } else {
        console.log('Signup successful!');
        // Login the user after successful signup
        await login(credentials);
        // Redirecting to main page after successful signup
        navigate('/');
      }
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <div style={{ width: '300px', margin: '100px auto' }}>
      <h2>Sign up</h2>
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

export default Signup;