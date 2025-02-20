import React from 'react';
import './../styles/OfficeInfoModal.css';

const OfficeInfoModal = ({ doctors, office, setFilteredDoctors, setSelectedAddresses, onClose }) => {
    const handleSelectAddress = () => {
        setSelectedAddresses(office.address);

        const filteredDoctors = doctors.filter(doctor => doctor.office?.id === office.id);
        setFilteredDoctors(filteredDoctors);

        onClose();
    };

    return (
        <div className="modal-overlay">
            <button className="close-button" onClick={onClose}>X</button>
            <div class="office-card">
                <div class="office-picture">
                    <img src="https://th.bing.com/th/id/OIP.audMX4ZGbvT2_GJTx2c4GgAAAA?rs=1&pid=ImgDetMain" alt="Profile Picture" class="office-image" />
                </div>
                <div class="office-details">
                    <span class="office-address">address: {office.address}</span>
                </div>
                <div class="office-action-button">
                    <button onClick={handleSelectAddress}>Select</button>
                </div>
            </div>
        </div>
    );
};

export default OfficeInfoModal;