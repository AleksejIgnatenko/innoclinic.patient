import React, { Profiler, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Sidebar from './components/Sidebar';
import Services from './pages/Services';
import CreateProfile from './pages/CreateProfile';
import Profile from './pages/Profile';

function App() {


  return (
    <Router>
      <Sidebar />
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/services" element={<Services />} />
          <Route path="/createProfile" element={<CreateProfile />} />
          <Route path="/profile" element={<Profile/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;