import React, { useState, useEffect } from 'react';
import DoctorCard from "../components/DoctorCard";
import CustomMap from '../components/CustomMap';
import "./../styles/Doctors.css";
import GetAllOfficesFetchAsync from '../api/Offices.API/GetAllOfficesFetchAsync';
import GetAllDoctorsAtWorkFetchAsync from '../api/Profiles.API/GetAllDoctorsAtWorkFetchAsync';
import Loader from '../components/Loader';
import Toolbar from '../components/Toolbar';
import GetAllSpecializationFetchAsync from '../api/Services.API/GetAllSpecializationFetchAsync';

function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [offices, setOffices] = useState([]);
    const [specializations, setSpecializations] = useState([]); 

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [selectedAddresses, setSelectedAddresses] = useState([]);
    const [selectedSpecialization, setSelectedSpecialization] = useState("");
    const [showMap, setShowMap] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                const fetchedDoctors = await GetAllDoctorsAtWorkFetchAsync();
                setDoctors(fetchedDoctors);
                setFilteredDoctors(fetchedDoctors);

                const fetchedOffices = await GetAllOfficesFetchAsync();
                setOffices(fetchedOffices);

                const fetchedSpecializations = await GetAllSpecializationFetchAsync();
                setSpecializations(fetchedSpecializations);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                toggleLoader(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const filtered = doctors.filter(doctor => {
            // const experience = doctor.careerStartYear ? new Date().getFullYear() - new Date(doctor.careerStartYear).getFullYear() + 1 : 0;
            return (
                doctor.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
                doctor.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
                doctor.middleName.toLowerCase().includes(lowerCaseSearchTerm) //||
                // doctor.specialization?.specializationName.toLowerCase().includes(lowerCaseSearchTerm) ||
                // experience.toString().includes(lowerCaseSearchTerm) ||
                // doctor.office?.address.toLowerCase().includes(lowerCaseSearchTerm)
            );
        });
        setFilteredDoctors(filtered);
    }, [searchTerm]);

    const handleFilterDoctors = (filtered) => {
        setFilteredDoctors(filtered);
    };

    const handleShowMap = () => {
        setShowMap(!showMap);
    };

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    return (
        <div>
            {showMap &&
                <CustomMap
                    doctors={doctors}
                    offices={offices}
                    onClose={handleShowMap}
                    setFilteredDoctors={setFilteredDoctors}
                    setSelectedAddresses={setSelectedAddresses}
                />
            }
            {isLoading && <Loader />}
            <>
                <Toolbar
                    pageTitle={"Doctors"}
                    setSearchTerm={setSearchTerm}
                    doctors={doctors}
                    offices={offices}
                    specializations={specializations}
                    filteredDoctors={filteredDoctors}
                    onFilterDoctors={handleFilterDoctors}
                    selectedAddresses={selectedAddresses}
                    setSelectedAddresses={setSelectedAddresses}
                    selectedSpecialization={selectedSpecialization}
                    setSelectedSpecialization={setSelectedSpecialization}
                    onShowMap={handleShowMap}
                />
                <div className="doctors-container">
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors.map((doctor) => (
                            <DoctorCard
                                key={doctor.id}
                                doctorId={doctor.id}
                                name={`${doctor.firstName || ''} ${doctor.lastName || ''} ${doctor.middleName || ''}`}
                                specialization={doctor.specialization?.specializationName || "Not found"}
                                experience={doctor.careerStartYear ? new Date().getFullYear() - new Date(doctor.careerStartYear).getFullYear() + 1 : "N/A"}
                                officeAddress={doctor.office?.address || "Not found"}
                            />
                        ))
                    ) : (
                        !isLoading && <p>Nothing could be found.</p>
                    )}
                </div>
            </>
        </div>
    );
}

export default Doctors;