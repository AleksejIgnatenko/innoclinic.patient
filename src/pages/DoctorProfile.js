import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./../styles/DoctorProfile.css";
import Loader from '../components/Loader';
import DoctorProfileCard from '../components/DoctorProfileCard';
import GetDoctorByIdFetchAsync from '../api/Profiles.API/GetDoctorByIdFetchAsync';
import GetServicesBySpecializationIdFethcAsync from '../api/Services.API/GetServicesByCategoryIdFethcAsync';

function DoctorProfile({
    showSignInModal,
    toggleSignInModal,
    showSignUpModal,
    toggleSignUpModal,
    showMakeAnAppointmentModel,
    toggleMakeAnAppointmentModel,
}) {
    const { doctorId } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [services, setServices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);
                const fetchDoctor = await GetDoctorByIdFetchAsync(doctorId);
                setDoctor(fetchDoctor);

                const fetchServices = await GetServicesBySpecializationIdFethcAsync(fetchDoctor.specialization.id);
                setServices(fetchServices);
            } catch (error) {
                console.error('Error fetching doctor:', error);
            } finally {
                toggleLoader(false);
            }
        };

        fetchData();
    }, [doctorId]);

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    return (
        <>
            {isLoading && <Loader />}
            {!isLoading && (
                <DoctorProfileCard
                    doctor={doctor}
                    services={services}
                    showSignInModal={showSignInModal}
                    toggleSignInModal={toggleSignInModal}
                    showSignUpModal={showSignUpModal}
                    toggleSignUpModal={toggleSignUpModal}
                    showMakeAnAppointmentModel={showMakeAnAppointmentModel}
                    toggleMakeAnAppointmentModel={toggleMakeAnAppointmentModel}
                />
            )}
        </>
    );
}

export default DoctorProfile;