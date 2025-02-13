import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./../styles/PatientProfile.css";
import Loader from '../components/Loader';
import GetPatientByAccountIdFromTokenFetchAsync from '../api/Profiles.API/GetPatientByAccountIdFromTokenFetchAsync';
import PatientProfileCard from '../components/PatientProfileCard';

function PatientProfile() {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('PersonalInformation');
    const [profile, setProfile] = useState(null);
    const [appointmentResults, setAppointmentResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                const fetchProfile = await GetPatientByAccountIdFromTokenFetchAsync();
                setProfile(fetchProfile);

                //add get appoiment result
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                toggleLoader(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const tab = new URLSearchParams(location.search).get('tab');
        if (tab) {
            setActiveTab(tab);
        }
    }, [location]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        navigate(`/profile?tab=${tab}`);
    };

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    return (
        <div className="tabs">
            {isLoading && <Loader />}
            <ul className="tabs-content">
                <button
                    className={`tabs__button ${activeTab === 'PersonalInformation' ? 'is-active' : ''}`}
                    onClick={() => handleTabClick('PersonalInformation')}
                >
                    Personal information
                </button>
                <button
                    className={`tabs__button ${activeTab === 'AppointmentResults' ? 'is-active' : ''}`}
                    onClick={() => handleTabClick('AppointmentResults')}
                >
                    Appointment results
                </button>
            </ul>

            {!isLoading && (
                <div className='tabs-container'>
                    <div data-content className={activeTab === 'PersonalInformation' ? 'is-active' : ''} id="personalInformation">
                        <div className='container-profile-card'>
                           <PatientProfileCard profile={profile} />
                        </div>
                    </div>

                    <div data-content className={activeTab === 'AppointmentResults' ? 'is-active' : ''} id="appointmentResults">
                        <h2 className='profile-card-title'>Appointment results</h2>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PatientProfile;