import { useEffect, useState } from "react";
import Toolbar from '../components/organisms/Toolbar';
import Loader from '../components/organisms/Loader';
import { ButtonBase } from '../components/atoms/ButtonBase';
import FilterModal from "../components/organisms/FilterModal";
import CheckboxWrapper from "../components/molecules/CheckboxWrapper";
import '../styles/pages/Doctors.css';
import { useNavigate, useLocation } from "react-router-dom";

import GetAllSpecializationFetchAsync from "../api/Services.API/GetAllSpecializationFetchAsync";
import GetAllOfficesFetchAsync from "../api/Offices.API/GetAllOfficesFetchAsync";
import GetAllDoctorsFetchAsync from "../api/Profiles.API/GetAllDoctorsFetchAsync";
import ProfileCard from "../components/organisms/ProfileCard";
import GetPhotoByIdAsync from "../api/Documents.API/GetPhotoByIdAsync";
import CustomMap from "../components/organisms/CustomMap";
import FormModal from "../components/organisms/FormModal";

export default function Doctors() {
    const navigate = useNavigate();
    const location = useLocation();

    const [doctors, setDoctors] = useState([]);
    const [editableDoctors, setEditableDoctors] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [offices, setOffices] = useState([]);

    const [isOfficeModalOpen, setIsOfficeModalOpen] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState(null);
    const [selectedOfficePhoto, setSelectedOfficePhoto] = useState(null);

    const [isShowMap, setIsShowMap] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [selectedOffices, setSelectedOffices] = useState([]);
    const [selectedSpecializations, setSelectedSpecializations] = useState([]);

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                const fetchedSpecializations = await GetAllSpecializationFetchAsync()
                setSpecializations(fetchedSpecializations);

                const fetchedOffices = await GetAllOfficesFetchAsync();
                setOffices(fetchedOffices);

                const fetchedDoctors = await GetAllDoctorsFetchAsync();

                const doctorsWithPhotos = await Promise.all(fetchedDoctors.map(async (doctor) => {
                    if (doctor.account.photoId) {
                        const fetchedPhoto = await GetPhotoByIdAsync(doctor.account.photoId);
                        doctor.photoUrl = fetchedPhoto;
                    }
                    return doctor;
                }));

                setDoctors(doctorsWithPhotos);
                const formattedDoctors = formatDoctors(doctorsWithPhotos);
                setEditableDoctors(formattedDoctors);
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
        const filteredDoctors = doctors.filter(item => {
            const fullName = `${item.firstName} ${item.middleName} ${item.lastName}`.toLowerCase();
            
            return fullName.includes(lowerCaseSearchTerm) || 
                   item.firstName.toLowerCase().includes(lowerCaseSearchTerm) ||
                   item.lastName.toLowerCase().includes(lowerCaseSearchTerm) ||
                   item.middleName.toLowerCase().includes(lowerCaseSearchTerm);
        });
    
        const formattedDoctors = formatDoctors(filteredDoctors);
        setEditableDoctors(formattedDoctors);
    
        const currentPath = location.pathname;
        const params = new URLSearchParams(location.search);
        
        if (searchTerm) {
            params.set('search', searchTerm);
        } else {
            params.delete('search');
        }
    
        const updatedPath = `${currentPath}?${params.toString()}`;
        navigate(updatedPath);
    }, [searchTerm, doctors]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const modalParam = queryParams.get('modal');
        const searchParam = queryParams.get('search');

        if (searchParam) {
            setSearchTerm(searchParam);
        } else {
            setSearchTerm('');
        }

        if (modalParam === 'filter') {
            setIsFilterModalOpen(true);
        } else if (modalParam === 'map') {
            setIsShowMap(true);
        }
    }, [location.search]);

    const formatDoctors = (doctors) => {
        return doctors.map(({ id, photoUrl, firstName, lastName, middleName, cabinetNumber, specialization, careerStartYear, office }) => ({
            id,
            photoUrl,
            doctorFullName: `${firstName} ${lastName} ${middleName}`,
            cabinetNumber,
            specialization: specialization.specializationName,
            experience: careerStartYear ? new Date().getFullYear() - new Date(careerStartYear).getFullYear() + 1 : "N/A",
            address: `${office.city} ${office.street} ${office.houseNumber} ${office.officeNumber}`,
        }));
    };

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    const toggleFilterModalClick = () => {
        const newModalState = !isFilterModalOpen;
        const currentPath = location.pathname;
        const params = new URLSearchParams(location.search);
    
        if (newModalState) {
            params.set('modal', 'filter');
        } else {
            params.delete('modal');
        }
    
        const updatedPath = `${currentPath}?${params.toString()}`;
        setIsFilterModalOpen(newModalState);
        navigate(updatedPath);
    };

    const toggleMapModalClick = () => {
        const newModalState = !isShowMap;
        const currentPath = location.pathname;
        const params = new URLSearchParams(location.search);

        if (newModalState) {
            params.set('modal', 'map');
        } else {
            params.delete('modal');
        }

        const updatedPath = `${currentPath}?${params.toString()}`;
        setIsShowMap(newModalState);
        navigate(updatedPath);
    };

    const handleFilterOfficeChange = (office) => {
        setSelectedOffices(prevSelectedOffices => {
            if (prevSelectedOffices.some(selectedOffice => selectedOffice.id === office.id)) {
                return prevSelectedOffices.filter(selectedOffice => selectedOffice.id !== office.id);
            } else {
                return [...prevSelectedOffices, office];
            }
        });
    };

    const handleFilterSpecializationChange = (specialization) => {
        setSelectedSpecializations(prevSelectedSpecializations => {
            if (prevSelectedSpecializations.some(selectedSpecialization => selectedSpecialization.id === specialization.id)) {
                return prevSelectedSpecializations.filter(selectedSpecialization => selectedSpecialization.id !== specialization.id);
            } else {
                return [...prevSelectedSpecializations, specialization];
            }
        });
    };

    const handleApplyFilter = () => {
        const filteredDoctors = doctors.filter(doctor =>
            selectedOffices.some(selectedOffice => selectedOffice.id === doctor.office.id) ||
            selectedSpecializations.some(selectedSpecialization => selectedSpecialization.id === doctor.specialization.id)
        );
        const formattedDoctors = formatDoctors(filteredDoctors);
        setEditableDoctors(formattedDoctors);
        setIsFilterModalOpen(!isFilterModalOpen);
        
        const currentPath = location.pathname;
        const params = new URLSearchParams(location.search);
        params.delete('modal');
        const updatedPath = `${currentPath}?${params.toString()}`;
        navigate(updatedPath);
    };

    const handleClearFilter = () => {
        const formattedDoctors = formatDoctors(doctors);
        setEditableDoctors(formattedDoctors);
        setSelectedOffices([]);
        setSelectedSpecializations([]);
        setIsFilterModalOpen(!isFilterModalOpen);

        const currentPath = location.pathname;
        const params = new URLSearchParams(location.search);
        params.delete('modal');
        const updatedPath = `${currentPath}?${params.toString()}`;
        navigate(updatedPath);
    }

    const handleSelectOfficeClick = async (office) => {
        setIsShowMap(!isShowMap);
        setIsOfficeModalOpen(!isOfficeModalOpen);
        setSelectedOffice(office);
        if (office.photoId) {
            const officePhoto = await GetPhotoByIdAsync(office.photoId);
            setSelectedOfficePhoto(officePhoto);
        }
    };

    const toggleOfficeModalClick = () => {
        setIsOfficeModalOpen(!isOfficeModalOpen);
        setIsShowMap(!isShowMap);
    }

    const handleSelectOffice = (event) => {
        event.preventDefault();
        handleFilterOfficeChange(selectedOffice);
    };

    return (
        <>
            <Toolbar
                pageTitle="Doctors"
                showFilterIcon={true}
                toggleFilterModalClick={toggleFilterModalClick}
                showSearch={true}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                showMapIcon={true}
                toggleMapModalClick={toggleMapModalClick}

            />
            {isLoading ? (<Loader />
            ) : (
                <div className="page">
                    {doctors.length === 0 ? (
                        <p className="no-items">Doctors not found</p>
                    ) : (
                        <>
                            {editableDoctors.length === 0 && (
                                <p className="no-items">Nothing was found</p>
                            )}
                            <div className="card-wrapper">
                                <div className="card-container">
                                    {editableDoctors.map((editableDoctor, index) => (
                                        <ProfileCard key={index} className="card" id={editableDoctor.id} onClick={() => navigate(`/doctor/${editableDoctor.id}`)}>
                                            <div class="img-container">
                                                <img src={editableDoctor.photoUrl} alt="" className={editableDoctor.photoUrl ? '' : 'img-area'} />
                                            </div>
                                            <div className="profile-content">
                                                <p>Full name: {editableDoctor.doctorFullName}</p>
                                                <p>Cabinet number: {editableDoctor.cabinetNumber}</p>
                                                <p>Specialization: {editableDoctor.specialization}</p>
                                                <p>Experience: {editableDoctor.experience}</p>
                                                <p>Office address: {editableDoctor.address}</p>
                                            </div>
                                        </ProfileCard>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

{isFilterModalOpen && (
    <FilterModal onClose={toggleFilterModalClick}>
        <div className="filter-section">
            <h2 className="filter-modal-title">Offices</h2>
            <div className="filter-checkbox-container">
                {offices && offices.length > 0 ? (
                    offices.map(office => (
                        <div className="filter-checkbox-group" key={office.id}>
                            <CheckboxWrapper
                                id={office.id}
                                name="office-address"
                                value={office.address}
                                checked={selectedOffices && selectedOffices.some(selectedOffice => selectedOffice.id === office.id)}
                                onChange={() => handleFilterOfficeChange(office)}
                                label={office.city}
                            />
                        </div>
                    ))
                ) : (
                    <p>Offices not found.</p>
                )}
            </div>
        </div>
        <div className="filter-section">
            <h2 className="filter-modal-title">Specializations</h2>
            <div className="filter-checkbox-container">
                {specializations && specializations.length > 0 ? (
                    specializations.map(specialization => (
                        <div className="filter-checkbox-group" key={specialization.id}>
                            <CheckboxWrapper
                                id={specialization.id}
                                name="specialization-name"
                                value={specialization.specializationName}
                                checked={selectedSpecializations && selectedSpecializations.some(selectedSpecialization => selectedSpecialization.id === specialization.id)}
                                onChange={() => handleFilterSpecializationChange(specialization)}
                                label={specialization.specializationName}
                            />
                        </div>
                    ))
                ) : (
                    <p>Specializations not found.</p>
                )}
            </div>
        </div>
        <div className="form-actions">
            <ButtonBase type="button" onClick={handleApplyFilter}>
                Apply
            </ButtonBase>
            <ButtonBase type="button" variant="secondary" onClick={handleClearFilter}>
                Clear
            </ButtonBase>
        </div>
    </FilterModal>
)}
                </div>
            )}

            {isOfficeModalOpen && (
                <FormModal title={"Office"} showCloseButton={true} onClose={toggleOfficeModalClick}>
                    <div className="img-container">
                        <img src={selectedOfficePhoto} alt="" className={selectedOfficePhoto ? '' : 'img-area'} />
                    </div>
                    <div className="profile-content">
                        {selectedOffice ? (
                            <>
                                <p>City: {selectedOffice.city}</p>
                                <p>Street: {selectedOffice.street}</p>
                                <p>House Number: {selectedOffice.houseNumber}</p>
                                <p>Office Number: {selectedOffice.officeNumber}</p>
                                <ButtonBase onClick={handleSelectOffice} type="button">
                                    Select
                                </ButtonBase>
                            </>
                        ) : (
                            <p>No office information available</p>
                        )}
                    </div>
                </FormModal>
            )}

            {isShowMap && 
                <CustomMap
                    items={offices || []}
                    handleMarkerClick={handleSelectOfficeClick}
                    onClose={toggleMapModalClick}
                />
            }
        </>
    );
} 