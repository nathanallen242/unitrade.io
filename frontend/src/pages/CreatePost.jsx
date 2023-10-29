import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { post } from '../middleware/auth.js';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    makes: '', 
    category_id: 'Electronics',
    description: '',
    imageUrl: null,
    title: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const { isAuthenticated, currentUser } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      // Set the makes attribute when the component mounts if the user is authenticated
      setFormData(prev => ({
        ...prev,
        makes: currentUser.id
      }));
    } else {
      console.log("User is not authenticated. Redirecting to login page...");
      navigate('/login');
    }
  }, [navigate, isAuthenticated, currentUser]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log(formData)
        const response = await post('/posts', formData);
        if (response.status === 201) {
            console.log("Post created successfully!");
            navigate('/'); // Redirect to the main page after post creation
        } else {
            console.log("Error creating post:", response);
        }
    } catch (error) {
        console.error("Error creating post:", error);
    }
  };

  return (
    <div>
      <h1>Create Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title: </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description: </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Image URL: </label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Category ID: </label>
          <input
            type="text"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
          />
        </div>
    
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
};

export default CreatePost;
