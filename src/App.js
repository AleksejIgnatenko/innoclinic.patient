import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Sidebar from './components/organisms/Sidebar';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Services from './pages/Services';
import CreatePatientProfile from './pages/CreatePatientProfile';
import Profile from './pages/Profile';
import Doctor from './pages/Doctor';
import AppointmentResults from './pages/AppointmentResults';
function App() {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
      <>
        <Router>
            <>
              <Sidebar currentTheme={currentTheme} toggleTheme={toggleTheme} />
              <div className="App">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/doctor/:id?" element={<Doctor />} />
                  <Route path="/doctors" element={<Doctors />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/create-patient-profile" element={<CreatePatientProfile />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/appointment-results/:appointmentId?" element={<AppointmentResults />} />
                </Routes>
              </div>
            </>
        </Router>
      </>
  );
}

export default App;