import React, { useState, useEffect } from 'react';
import DoctorCard from "../components/DoctorCard";
import NavBar from "../components/NavBar";
import CustomMap from '../components/CustomMap';
import "./../styles/Doctors.css";
import GetAllDoctorsFetchAsync from '../api/GetAllDoctorsFetchAsync';

function Doctors() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [selectedAddresses, setSelectedAddresses] = useState([]);
    const [selectedSpecialization, setSelectedSpecialization] = useState("");
    const [showMap, setShowMap] = useState(false);
    //const [doctors, setDoctors] = useState([]);

    const doctors = [
        { name: "Ivanov Ivan Ivanovich", specialization: "Pediatrician", experience: "1", officeAddress: "1", lat: "52.430140", lng: "31.013527" },
        { name: "Petrov Petr Petrovich", specialization: "Therapist", experience: "5", officeAddress: "2", lat: "52.418004", lng: "30.978483" },
        { name: "Sidorov Sidor Sidorovich", specialization: "Surgeon", experience: "3", officeAddress: "3", lat: "52.386910", lng: "31.031816" },
        { name: "Smirnov Sergey Sergeevich", specialization: "Pediatrician", experience: "2", officeAddress: "2", lat: "52.386910", lng: "31.031816" },
    ];

    useEffect(() => {
        const fetchDoctors = async () => {
            const fetchedDoctors = await GetAllDoctorsFetchAsync();
            //setDoctors(fetchedDoctors);
            console.log(fetchDoctors);
        };

        fetchDoctors();
    }, []);

    const handleFilterDoctors = (filtered) => {
        setFilteredDoctors(filtered);
    };

    const handleShowMap = () => {
        setShowMap(!showMap);
    }

    const displayedDoctors = filteredDoctors.length > 0 ? filteredDoctors : doctors.filter(doctor => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return (
            doctor.name.toLowerCase().includes(lowerCaseSearchTerm)
        );
    });

    return (
        <div>
            <NavBar 
                pageTitle={"Doctors"} 
                setSearchTerm={setSearchTerm} 
                doctors={doctors} 
                onFilterDoctors={handleFilterDoctors}
                selectedAddresses={selectedAddresses} 
                setSelectedAddresses={setSelectedAddresses}
                selectedSpecialization={selectedSpecialization}
                setSelectedSpecialization={setSelectedSpecialization}
                onShowMap={handleShowMap}
            />
            <div className="doctors-container">
                {displayedDoctors.length > 0 ? (
                    displayedDoctors.map((doctor, index) => (
                        <DoctorCard
                            key={index}
                            name={doctor.name}
                            specialization={doctor.specialization}
                            experience={doctor.experience}
                            officeAddress={doctor.officeAddress}
                        />
                    ))
                ) : (
                    <p>Ничего не удалось найти</p>
                )}
            </div>
            {showMap && <CustomMap doctors={displayedDoctors} onClose={handleShowMap} />}
        </div>
    );
}

export default Doctors;