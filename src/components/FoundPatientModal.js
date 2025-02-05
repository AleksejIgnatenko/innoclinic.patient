import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './../styles/FoundPatientModal.css';
import AccountConnectionWithThePatientFetchAsync from '../api/Profiles.API/AccountConnectionWithThePatientFetchAsync';
import ForceCreatePatientAsyncFetch from '../api/Profiles.API/ForceCreatePatientAsyncFetch';

const FoundPatientModal = ({ onClose, foundPatients, patient }) => {
    const navigate = useNavigate();

    const [patientList, setPatientList] = useState(foundPatients || []);

    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [onClose]);

    async function handleCancelClick(id) {
        const updatedList = patientList.filter(patient => patient.Id !== id);

        if (updatedList.length === 0) {
            await ForceCreatePatientAsyncFetch(patient);
            navigate('/');
        }
        
        setPatientList(updatedList);
    }

    async function handleConfirmClick (id) {
        await AccountConnectionWithThePatientFetchAsync(id);
        navigate('/');
    };

    return (
        <div className="modal-overlay">
            <div className="foundPatientModal-container">
                <div className="foundPatientModal-top-content">
                    <h2>A similar profile has been found, you might have already visited one of our clinics?</h2>
                </div>
                <div className="foundPatients-list">
                    {patientList.map(patient => (
                        <div key={patient.Id} className="patient-info">
                            <p>Name: {patient.FirstName} {patient.LastName} {patient.MiddleName}</p>
                            <p>Date of Birth: {patient.DateOfBirth}</p>
                            <div className="foundPatients-actions">
                                <button
                                    className="foundPatients-confirm-btn"
                                    onClick={() => handleConfirmClick(patient.Id)}
                                >
                                    Yes, it’s me
                                </button>
                                <button
                                    className="foundPatients-cancel-btn"
                                    onClick={() => handleCancelClick(patient.Id)}
                                >
                                    No, it’s not me
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FoundPatientModal;