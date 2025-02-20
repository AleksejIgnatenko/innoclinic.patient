import React, { useState } from 'react';
import './../styles/Toolbar.css';
import FilterDoctorModal from './FilterDoctorModal';

const Toolbar = ({ 
    pageTitle, 
    setSearchTerm, 
    doctors, 
    offices,
    specializations,
    onFilterDoctors, 
    selectedAddresses, 
    setSelectedAddresses, 
    selectedSpecialization, 
    setSelectedSpecialization, 
    onShowMap
}) => {
        
    const [showFilterDoctorModal, setFilterDoctorModal] = useState(false);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const toggleFilterDoctorModal = () => {
        setFilterDoctorModal(!showFilterDoctorModal);
    };

    return (
        <>
            {showFilterDoctorModal && (
                <FilterDoctorModal
                    onClose={toggleFilterDoctorModal}
                    doctors={doctors}
                    offices={offices}
                    specializations={specializations}
                    onFilterDoctors={onFilterDoctors}
                    selectedAddresses={selectedAddresses}
                    setSelectedAddresses={setSelectedAddresses}
                    selectedSpecialization={selectedSpecialization}
                    setSelectedSpecialization={setSelectedSpecialization}
                />
            )}
            <div className='toolbar'>
                <h2 className='pageName'>{pageTitle}</h2>
                <div className="filter-search-container">
                    <div className="search-bar">
                        <i className='bx bx-search'></i>
                        <input
                            type="search"
                            placeholder="Search..."
                            onChange={handleSearchChange}
                        />
                    </div>
                    <i className='bx bx-filter' onClick={toggleFilterDoctorModal}></i>
                    <i className='bx bx-map' onClick={onShowMap}></i>
                </div>
            </div>
        </>
    );
};

export default Toolbar;