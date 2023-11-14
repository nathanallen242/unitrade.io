import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import CreatePost from './pages/CreatePost';
import Login from './pages/Login';
import MainPage from './pages/MainPage';
import PostPage from './pages/PostPage';
import Signup from './pages/Signup';
import UserPosts from './pages/UserPosts';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/post/:postId" element={<PostPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login/>} />
          <Route path='/CreatePost' element={<CreatePost/>} />
          <Route path='/user/posts' element={<UserPosts/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}


export default App;
