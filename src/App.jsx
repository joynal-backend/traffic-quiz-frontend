import React from 'react';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Navbar from './pages/Navbar';
import Topics from './pages/Topics';
import Footer from './pages/Footer';

function App() {

  return (
    <>
      <div className='max-w-7xl mx-auto'>
        <Navbar />
        <Topics />
        <Footer />
 
      </div>
    </>
  )
}

export default App
