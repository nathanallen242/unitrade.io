import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { post } from '../middleware/auth.js';
import upload from '../utilities/upload.js';
const CreatePost = () => {

  const [formData, setFormData] = useState({
    makes: '', 
    category_id: 'Electronics',
    description: '',
    imageUrl: null,
    title: '',
  });

  useEffect(() => {
    console.log('FormData updated:', formData);
  }, [formData]);
  

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
      if (currentUser) {
        // Set the makes attribute when the component mounts if the user is authenticated
        setFormData(prev => ({
          ...prev,
          makes: currentUser.id
        }));
      }
    } else {
      console.log("User is not authenticated. Redirecting to login page...");
      navigate('/login');
    }
  }, [navigate, isAuthenticated, currentUser]);
  

  // Handle image file selection
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      
      const imageUrl = await upload(file); // Upload the file and get the URL
      console.log("imagurl:", imageUrl)

      if (imageUrl) {
        setFormData({ ...formData, imageUrl }); // Update the formData state with the new image URL
        console.log(formData)
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log(formData);
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
      <Header></Header>
      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputContainer}>
            <label>Title: </label>
            <input
              style={styles.input}
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.inputContainer}>
            <label>Description: </label>
            <textarea
              style={styles.textarea}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.inputContainer}>
            <label>Image: </label>
            <input
              type="file"
              onChange={handleImageChange}
            />
          </div>
          <div style={styles.inputContainer}>
            <label>Category ID: </label>
            <select
              style={styles.input}
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing</option>
              <option value="Home">Home</option>
              <option value="Books">Books</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
          <button type="submit" style={styles.submitButton}>Create Post</button>
        </form>
      </div>
    </>
  );
};

export default CreatePost;