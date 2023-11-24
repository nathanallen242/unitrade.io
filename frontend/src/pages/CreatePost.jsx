import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { post } from '../middleware/auth.js';
import upload from '../utilities/upload.js';
import { readAndCompressImage } from 'browser-image-resizer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

// Image resize configuration
const resizeConfig = {
  quality: 0.7,
  maxWidth: 500,
  maxHeight: 500,
  autoRotate: true,
};


const CreatePost = () => {

  const [formData, setFormData] = useState({
    makes: '', 
    category_id: 'Electronics',
    description: '',
    imageUrl: null,
    title: '',
  });

  const [isLoading, setIsLoading] = useState(false);

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
        // Set the makes attribute when the component mounts if the user is authenticated and currentUser is not null
        setFormData(prev => ({
          ...prev,
          makes: currentUser.id
        }));
      } else {
        console.log("currentUser is null. Waiting for authentication details...");
        // Handle the case when currentUser is null (e.g., waiting for user data to be fetched)
        // You might want to show a loading spinner or some other indication to the user
      }
    } else {
      console.log("User is not authenticated. Redirecting to login page...");
      navigate('/login');
    }
  }, [navigate, isAuthenticated, currentUser]);
  

  
  // Handle image file selection and uploading
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // Resize the image
        const resizedImage = await readAndCompressImage(file, resizeConfig);
  
        // Upload the resized image to Cloudinary
        const imageUrl = await upload(resizedImage);
  
        if (imageUrl) {
          setFormData({ ...formData, imageUrl });
        }
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    // Check if title or image is missing
    if (!formData.title) {
      toast.error("Title is required.");
      setIsLoading(false);
      return;
    }
    if (!formData.imageUrl) {
        toast.error("Image is required.");
        setIsLoading(false);
        return;
    }
    if (!formData.description) {
        toast.error("Description is required.");
        setIsLoading(false);
        return;
    }
    
    if (formData.imageUrl) {
        try {
            const imageResponse = await axios.get(formData.imageUrl, { responseType: 'blob' });
            const imageBlob = imageResponse.data;
            const formDataForAPI = new FormData();
            formDataForAPI.append('image', imageBlob);

            const classificationResponse = await axios.post('http://localhost:5000/classify', formDataForAPI, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Extract tags array from the response object
            const tags = classificationResponse.data.tags; // Assuming the tags are in this structure

            // Update formData with tags before sending to your post creation API
            const updatedFormData = { ...formData, tags };
            console.log("Updated form data:", updatedFormData);

            const response = await post('/posts', updatedFormData);
            if (response.status === 201) {
                console.log("Post created successfully!");
                toast.success("Post created successfully!", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
                navigate('/');
            } else {
                console.error("Error creating post:", response);
                toast.error("Error creating post.");
                setIsLoading(false); // Stop loading after form submission or in catch block
            }
        } catch (error) {
            console.error("Error in image classification or post creation:", error);
            setIsLoading(false); // Stop loading after form submission or in catch block
        }
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
      <ToastContainer />
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
            />
          </div>
          <div style={styles.inputContainer}>
            <label>Description: </label>
            <textarea
              style={styles.textarea}
              name="description"
              value={formData.description}
              onChange={handleChange}
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
              <option value="ETC">Etc</option>
            </select>
          </div>
          <button type="submit" style={styles.submitButton} disabled={isLoading}>
          {isLoading ? <div className="loadingSpinner"></div> : 'Create Post'}
        </button>
        </form>
      </div>
    </>
  );
};

export default CreatePost;