import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ArchitectureDetail from './pages/ArchitectureDetail.jsx';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/architecture/:styleId" element={<ArchitectureDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
