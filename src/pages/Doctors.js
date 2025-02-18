import React, { useState, useEffect } from 'react';
import DoctorCard from "../components/DoctorCard";
import CustomMap from '../components/CustomMap';
import "./../styles/Doctors.css";
import GetAllOfficesFetchAsync from '../api/Offices.API/GetAllOfficesFetchAsync';
import GetAllDoctorsAtWorkFetchAsync from '../api/Profiles.API/GetAllDoctorsAtWorkFetchAsync';
import Loader from '../components/Loader'; 
import Toolbar from '../components/Toolbar';
import { Link } from 'react-router-dom';

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

                //const fetchedDoctors = await GetAllDoctorsAtWorkFetchAsync();
                const fetchedDoctors = 
                [
                  {
                    "id": "f5f43c43-7e46-4443-9d84-3d636136d169",
                    "firstName": "Петров1",
                    "lastName": "Петр",
                    "middleName": "Петрович",
                    "cabinetNumber": 1,
                    "dateOfBirth": "2025-01-01",
                    "account": {
                      "id": "52356f12-dfd7-4bc5-8836-1b13298cd141",
                      "email": "lehaignatenko989@gmail.com",
                      "password": "$2a$10$5nDXFgpS.RmIxlvpZY9/Guqlh/S.CJ5cWILe6w7tPMBtGz0cLCtOy",
                      "phoneNumber": "",
                      "role": 1
                    },
                    "specialization": {
                      "id": "d7e98a7d-cfee-4d3c-9512-24c986a3cabd",
                      "specializationName": "test",
                      "isActive": true
                    },
                    "office": {
                      "id": "a408a09a-1836-458e-8c17-2d1802d6ac10",
                      "address": "гомель пушкина 3",
                      "registryPhoneNumber": "string",
                      "isActive": true
                    },
                    "careerStartYear": "2025-01-01",
                    "status": "At work"
                  }
                ]
                setDoctors(fetchedDoctors);

                //const fetchedOffices = await GetAllOfficesFetchAsync();
                const fetchedOffices = [
                    {
                      "id": "a408a09a-1836-458e-8c17-2d1802d6ac10",
                      "address": "гомель пушкина 3",
                      "longitude": "52.43014",
                      "latitude": "31.013527",
                      "photoId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                      "registryPhoneNumber": "string",
                      "isActive": true
                    }
                  ]
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
                            <p className='no-doctors-message'>There are no doctors matching this filtration.</p>
                        ) : (
                            displayedDoctors.length > 0 ? (
                                    displayedDoctors.map((doctor) => (
                                        <Link to={`/doctorProfile/${doctor.id}`}>
                                            <DoctorCard
                                                key={doctor.id}
                                                name={`${doctor.firstName || ''} ${doctor.lastName || ''} ${doctor.middleName || ''}`}
                                                specialization={doctor.specialization?.specializationName || "Not found"}
                                                experience={doctor.careerStartYear ? new Date().getFullYear() - new Date(doctor.careerStartYear).getFullYear() + 1 : "N/A"}
                                                officeAddress={doctor.office?.address || "Not found"}
                                            />
                                        </Link>
                                    ))
                            ) : (
                                <p className='no-doctors-message'>Nothing could be found.</p>
                            )
                        )}
                    </div>
                    {showMap && <CustomMap offices={offices} onClose={handleShowMap} setSelectedAddresses={setSelectedAddresses}/>}
                </>
            )}
        </div>
    );
}

export default Doctors;