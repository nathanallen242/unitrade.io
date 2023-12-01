// EditModal.js
import React, { useState } from 'react';
import { readAndCompressImage } from 'browser-image-resizer';
import upload from '../../utilities/upload.js';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import './Modal.css';
import './ModalOverlay.css';

const EditModal = ({ isOpen, post, onClose, post_id }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    ...post, // Assuming post contains title, description, category_id, etc.
    image_url: post.image_url, // Assuming post has an image_url attribute
  });

   // Handle changes in form inputs
   const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null); // This is the image file selected by the user

  
  // Image resize configuration
  const resizeConfig = {
    quality: 0.7,
    maxWidth: 500,
    maxHeight: 500,
    autoRotate: true,
  };

  
  // Handle image file selection and uploading
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImageFile(selectedFile); // Store the file object
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

  const handleModalClick = (e) => {
    e.stopPropagation(); // This stops the click from propagating to parent elements
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      // If an image file was selected, process and upload it
      if (imageFile) {
        const resizedImage = await readAndCompressImage(imageFile, resizeConfig);
        const imageUrl = await upload(resizedImage);
        if (!imageUrl) {
          throw new Error("Failed to upload image.");
        }
        formData.image_url = imageUrl; // Ensure this matches the field name expected by your backend
      }
  
      // Assume image classification is required
      if (formData.image_url) {
        const imageResponse = await axios.get(formData.image_url, { responseType: 'blob' });
        const imageBlob = imageResponse.data;
        const formDataForAPI = new FormData();
        formDataForAPI.append('image', imageBlob);
  
        const classificationResponse = await axios.post('http://localhost:5000/classify', formDataForAPI, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
  
        formData.tags = classificationResponse.data.tags; // Update tags if your post model has such a field
      }
  
      // Send updated data to your backend
      const response = await axios.put(`http://localhost:5000/posts/${post_id}`, JSON.stringify(formData), {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // assuming you store the token in localStorage
        }
      });
  
      if (response.status === 200) {
        toast.success("Post updated successfully!");
        onClose(); // Close the modal after successful update
        window.location.reload();
      } else {
        throw new Error(`Failed to update post: ${response.status}`);
      }
    } catch (error) {
      console.error("Error in updating post:", error);
      toast.error("Error updating post: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  return (
    <>
    <ToastContainer />
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={handleModalClick}>
        <div className="modal-header">
          <h2>Edit Post</h2>
          <button onClick={onClose} className="modal-close-button">&times;</button>
        </div>
        <div className="modal-body">
          {/* Form fields */}
          <div style={styles.inputContainer}>
            <label style={styles.label}>Title: </label>
            <input
              style={styles.input}
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Description: </label>
            <textarea
              style={styles.textarea}
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Image: </label>
            <input
              type="file"
              onChange={handleImageChange}
            />
          </div>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Category ID: </label>
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
          <button type="submit" onClick={handleSubmit} style={styles.submitButton} disabled={isLoading}>
          {isLoading ? <div className="loadingSpinner"></div> : 'Modify Post'}
        </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default EditModal;
