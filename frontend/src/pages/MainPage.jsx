import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Products from '../components/Products';
import NavBar from '../components/NavBar';

const MainPage = () => {
 

  return (
    <>
    <NavBar></NavBar>
    <Products></Products>
    </>
  );
}

export default MainPage;
