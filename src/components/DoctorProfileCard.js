import React from 'react';
import './../styles/DoctorProfileCard.css';
import { Link } from 'react-router-dom';
import MakeAnAppointmentModal from './MakeAnAppointmentModal';
import SignUpModal from './SignUpModal';
import SignInModal from './SignInModal';

const DoctorProfileCard = ({ 
    doctor, 
    services,
    showSignInModal,
    toggleSignInModal,
    showSignUpModal,
    toggleSignUpModal,
    showMakeAnAppointmentModel,
    toggleMakeAnAppointmentModel,
 }) => {
    const experience = doctor.careerStartYear
        ? new Date().getFullYear() - new Date(doctor.careerStartYear).getFullYear() + 1
        : "N/A";

    return (
        <>
            {showSignInModal && <SignInModal onClose={toggleSignInModal} onOpenSignUp={toggleSignUpModal} />}
            {showSignUpModal && <SignUpModal onClose={toggleSignUpModal} onOpenSignIn={toggleSignInModal} />}
            {showMakeAnAppointmentModel && <MakeAnAppointmentModal onClose={toggleMakeAnAppointmentModel} onOpenSignIn={toggleSignInModal} doctorId={doctor.id} />}
            <div className="doctor-profile-wrapper">
                <div className="doctor-profile-card active">
                    <div className="doctor-profile-card-header">
                        <img src="https://th.bing.com/th/id/OIP.audMX4ZGbvT2_GJTx2c4GgAAAA?rs=1&pid=ImgDetMain" alt="" />
                    </div>
                    <div className="doctor-profile-card-content">
                        <h3>First name: {doctor?.firstName || ''}</h3>
                        <h3>Last name: {doctor?.lastName || ''}</h3>
                        <h3>Middle name: {doctor?.middleName || ''}</h3>
                        <h3>Address: {doctor?.office?.address || ''}</h3>
                        <h3>Experience: {experience}</h3>
                        <h3>List of services according to specialization:</h3>
                        {services.map((service) => (
                            <h4 key={service.id}>{service.serviceName}</h4>
                        ))}
                        <button className='doctor-profile-btn' onClick={toggleMakeAnAppointmentModel} >Make an appointment with the doctor</button>
                        <Link to="/doctors">
                            <button className='doctor-profile-btn'>Back</button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DoctorProfileCard;