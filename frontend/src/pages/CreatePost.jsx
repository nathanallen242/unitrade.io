import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    categoryId: 'Electronics', // Default value set to 'Electronics'
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData)
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
            name="categoryId"
            value={formData.categoryId}
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
