import React, { useState, useEffect } from 'react';
import DoctorCard from "../components/DoctorCard";
import CustomMap from '../components/CustomMap';
import "./../styles/Doctors.css";
import GetAllOfficesFetchAsync from '../api/Offices.API/GetAllOfficesFetchAsync';
import GetAllDoctorsAtWorkFetchAsync from '../api/Profiles.API/GetAllDoctorsAtWorkFetchAsync';
import Loader from '../components/Loader'; 
import Toolbar from '../components/Toolbar';

function Doctors() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [selectedAddresses, setSelectedAddresses] = useState([]);
    const [selectedSpecialization, setSelectedSpecialization] = useState("");
    const [showMap, setShowMap] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [offices, setOffices] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                const fetchedDoctors = await GetAllDoctorsAtWorkFetchAsync();
                setDoctors(fetchedDoctors);

                const fetchedOffices = await GetAllOfficesFetchAsync();
                setOffices(fetchedOffices);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                toggleLoader(false);
            }
        };

        fetchData();
    }, []);

    const handleFilterDoctors = (filtered) => {
        setFilteredDoctors(filtered);
    };

    const handleShowMap = () => {
        setShowMap(!showMap);
    };

    const displayedDoctors = filteredDoctors.length > 0 ? filteredDoctors : doctors.filter(doctor => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return (
            doctor.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
            doctor.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
            doctor.middleName.toLowerCase().includes(lowerCaseSearchTerm)
        );
    });

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    return (
        <div>
            {isLoading && <Loader />}
            {!isLoading && (
                <>
                    <Toolbar
                        pageTitle={"Doctors"}
                        setSearchTerm={setSearchTerm}
                        items={doctors}
                        onFilterItems={handleFilterDoctors}
                        selectedAddresses={selectedAddresses}
                        setSelectedAddresses={setSelectedAddresses}
                        selectedSpecialization={selectedSpecialization}
                        setSelectedSpecialization={setSelectedSpecialization}
                        onShowMap={handleShowMap}
                    />
                    <div className="doctors-container">
                        {doctors.length < 1 ? (
                            <p className='no-doctors-message'>There are no doctors available.</p>
                        ) : (
                            displayedDoctors.length > 0 ? (
                                displayedDoctors.map((doctor) => (
                                    <DoctorCard
                                        key={doctor.id}
                                        name={`${doctor.firstName || ''} ${doctor.lastName || ''} ${doctor.middleName || ''}`}
                                        specialization={doctor.specialization?.specializationName || "Not found"}
                                        experience={doctor.careerStartYear ? new Date().getFullYear() - new Date(doctor.careerStartYear).getFullYear() + 1 : "N/A"}
                                        officeAddress={doctor.office?.address || "Not found"}
                                    />
                                ))
                            ) : (
                                <p className='no-doctors-message'>Nothing could be found.</p>
                            )
                        )}
                    </div>
                    {showMap && <CustomMap offices={offices} onClose={handleShowMap} />}
                </>
            )}
        </div>
    );
}

export default Doctors;