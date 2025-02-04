import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Sidebar from './components/Sidebar';
import Services from './pages/Services';
import CreateProfile from './pages/CreateProfile';

function App() {
      const [showSignInModal, setSignInModal] = useState(false);
      const [showSignUpModal, setShowSignUpModal] = useState(false);
      const [showMakeAnAppointmentModel, setShowMakeAnAppointmentModel] = useState(false);

  const toggleSignInModal = () => {
    setSignInModal(!showSignInModal);
    setShowSignUpModal(false);
    setShowMakeAnAppointmentModel(false);
};

const toggleSignUpModal = () => {
    setShowSignUpModal(!showSignUpModal);
    setSignInModal(false);
    setShowMakeAnAppointmentModel(false);
};

const toggleMakeAnAppointmentModel = () => {
    if (showMakeAnAppointmentModel) {
        const result = window.confirm('Do you really want to exit? Your appointment will not be saved.');
        if (result) {
            setShowMakeAnAppointmentModel(!showMakeAnAppointmentModel);
            setShowSignUpModal(false);
            setSignInModal(false);
        }
    } else {
        setShowMakeAnAppointmentModel(!showMakeAnAppointmentModel);
    }
};

  return (
    <Router>
      <Sidebar />
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/services" element={<Services />} />
          <Route path="/createProfile" element={<CreateProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;