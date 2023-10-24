import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../middleware/auth';



const Login = () => {
  const [username, setUsername] = useState('');
  const [password_hash, setPassword] = useState('');
  const [email, setEmail] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const credentials = { username, password_hash, email };
      const token = await login(credentials);
      if (token) {
        console.log('Login successful! Token:', token);
        navigate('/');
      } else {
        console.error('Login failed: No token received');
      }
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
