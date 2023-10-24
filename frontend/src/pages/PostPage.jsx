import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}posts/${postId}`)
      .then(response => {
        setPost(response.data);
      })
      .catch(err => {
        setError('An error occurred while fetching the data');
        console.error('Error fetching post data:', err);
      });
  }, [postId]);

  if (error) return <div>{error}</div>;

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.description}</p>
      {/* Add more fields as needed */}
      <p>Category: {post.category_id}</p>
      <p>Makes: {post.makes}</p>
      <p>Post Date: {new Date(post.post_date).toLocaleDateString()}</p>
      <p>Is Traded: {post.Is_Traded ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default PostPage;
