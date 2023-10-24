import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreatePost from './pages/CreatePost';
import Login from './pages/Login';
import MainPage from './pages/MainPage';
import PostPage from './pages/PostPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/post/:postId" element={<PostPage />} />
        <Route path="/login" element={<Login/>} />
        <Route path='/CreatePost' element = {<CreatePost/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
