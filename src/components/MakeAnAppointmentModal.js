import { useEffect, useState } from 'react';
import './../styles/MakeAnAppointmentModal.css';
import Cookies from 'js-cookie';
import GetAllSpecializationFetchAsync from '../api/Services.API/GetAllSpecializationFetchAsync';
import GetAllMedicalServiceFetchAsync from '../api/Services.API/GetAllMedicalServiceFetchAsync';
import GetAllOfficesFetchAsync from '../api/Offices.API/GetAllOfficesFetchAsync';
import GetAllDoctorsAtWorkFetchAsync from '../api/Profiles.API/GetAllDoctorsAtWorkFetchAsync';

const MakeAnAppointmentModal = ({ onClose, onOpenSignIn }) => {
    const [selectedSpecialization, setSelectedSpecialization] = useState('');
    const [selectedSpecializationId, setSelectedSpecializationId] = useState('');

    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    const [filtredDoctors, setFiltredDoctors] = useState([]);

    const [selectedService, setSelectedService] = useState('');
    const [selectedServiceId, setSelectedServiceId] = useState('');
    
    const [selectedOffice, setSelectedOffice] = useState('');
    const [selectedOfficeId, setSelectedOfficeId] = useState('');

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

    const [filterSpecialization, setFilterSpecialization] = useState('');
    const [filterDoctor, setFilterDoctor] = useState('');
    const [filterServices, setFilterServices] = useState('');

    const [specializations, setSpecializations] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]);
    const [offices, setOffices] = useState([]);

    // specializations = ['Specialization 1', 'Specialization 2', 'Specialization 3', 'Specialization 4', 'Specialization 5'];
    // doctors = ['Doctor 1', 'Doctor 2', 'Doctor 3', 'Doctor 4', 'Doctor 5'];
    // services = ['Service 1', 'Service 2', 'Service 3', 'Service 4', 'Service 5'];
    // offices = ['Office 1', 'Office 2', 'Office 3'];
    const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM'];

    let isUserLoggedIn = Cookies.get('refreshToken') !== undefined;

    useEffect(() => {
        const fetchData = async () => {
            // const fetchedSpecializations = await GetAllSpecializationFetchAsync();
            // setSpecializations(fetchedSpecializations);
            // console.log(fetchedSpecializations)
            const fetchedSpecializations = [
                {
                    "id": "a399b458-6f07-498c-b166-e96ad2cd3fce",
                    "specializationName": "test",
                    "isActive": true
                },

                {
                    "id": "a399b458-6f07-498c-b166-e96ad2cd3fc1",
                    "specializationName": "test1",
                    "isActive": true
                },
            ]
            setSpecializations(fetchedSpecializations);

            // const fetchedDoctors = await GetAllDoctorsAtWorkFetchAsync();
            // setDoctors(fetchedDoctors);
            // console.log(fetchedDoctors)

            const fetchedDoctors = [
                {
                    "id": "ae476167-8c6e-409b-be8b-4143040f1ae8",
                    "firstName": "Иванов",
                    "lastName": "Иван",
                    "middleName": "Иванович",
                    "dateOfBirth": "2025-01-31T13:45:21.888",
                    "account": {
                        "id": "c8ec10ea-fbc6-44af-73e7-08dd420ba51a",
                        "email": "test@gmail.com",
                        "phoneNumber": "+375(29)000-00-00",
                        "photoId": "00000000-0000-0000-0000-000000000000"
                    },
                    "specialization": {
                        "id": "a399b458-6f07-498c-b166-e96ad2cd3fce",
                        "specializationName": "test",
                        "isActive": true
                    },
                    "office": {
                        "id": "2aefd719-6a52-4d5b-9f77-b086ce6d7e7e",
                        "address": "гомель пушкина 3",
                        "registryPhoneNumber": "string",
                        "isActive": true
                    },
                    "careerStartYear": "2025-01-31T13:45:21.888",
                    "status": "At work"
                },

                {
                    "id": "ae476167-8c6e-409b-be8b-4143040f1ae9",
                    "firstName": "Иванов1",
                    "lastName": "Иван",
                    "middleName": "Иванович",
                    "dateOfBirth": "2025-01-31T13:45:21.888",
                    "account": {
                        "id": "c8ec10ea-fbc6-44af-73e7-08dd420ba51a",
                        "email": "test@gmail.com",
                        "phoneNumber": "+375(29)000-00-00",
                        "photoId": "00000000-0000-0000-0000-000000000000"
                    },
                    "specialization": {
                        "id": "a399b458-6f07-498c-b166-e96ad2cd3fc1",
                        "specializationName": "test",
                        "isActive": true
                    },
                    "office": {
                        "id": "2aefd719-6a52-4d5b-9f77-b086ce6d7e7e",
                        "address": "гомель пушкина 3",
                        "registryPhoneNumber": "string",
                        "isActive": true
                    },
                    "careerStartYear": "2025-01-31T13:45:21.888",
                    "status": "At work"
                },
            ]
            setDoctors(fetchedDoctors);

            // const fetchedServices = await GetAllMedicalServiceFetchAsync();
            // setServices(fetchedServices);
            // console.log(fetchedServices)
            const fetchedServices = [
                {
                    "id": "94d263f7-b8c5-485e-a1d7-a8f1664de81b",
                    "serviceCategory": {
                        "id": "063b4b1e-f634-4aa5-a4c6-0f8c18fb8007",
                        "categoryName": "Diagnostics",
                        "timeSlotSize": 30
                    },
                    "serviceName": "2",
                    "price": 0,
                    "specialization": {
                        "id": "a399b458-6f07-498c-b166-e96ad2cd3fce",
                        "specializationName": "test",
                        "isActive": true
                    },
                    "isActive": true
                },
            ]
            setServices(fetchedServices);

            // const fetchedOffices = await GetAllOfficesFetchAsync();
            // setOffices(fetchedOffices);

        };

        fetchData();
    }, []);

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

    const filteredSpecializations = specializations.filter(specialization =>
        specialization.specializationName.toLowerCase().includes(filterSpecialization.toLowerCase())
    );

    const filteredDoctors = filtredDoctors.filter(doctor =>
        doctor.firstName.toLowerCase().includes(filterDoctor.toLowerCase()) ||
        doctor.lastName.toLowerCase().includes(filterDoctor.toLowerCase()) ||
        doctor.middleName.toLowerCase().includes(filterDoctor.toLowerCase())
    );

    const filteredServices = services.filter(service =>
        service.serviceName.toLowerCase().includes(filterServices.toLowerCase())
    );

    const handleInputSpecializationChange = (e) => {
        setSelectedSpecialization(e.target.value);
        setFilterSpecialization(e.target.value);
    };

    const handleInputDoctorChange = (e) => {
        setSelectedDoctor(e.target.value);
        setFilterDoctor(e.target.value);
    };

    const handleInputServicesChange = (e) => {
        setSelectedService(e.target.value);
        setFilterServices(e.target.value);
    };

    const handleInputOfficesChange = (e) => {
        setSelectedOffice(e.target.value);
    };

    const handleTimeSlotChange = (e) => {
        setSelectedTimeSlot(e.target.value);
    };

    const handleListClick = (id, item, type) => {
        if (type === 'specialization') {
            setSelectedSpecialization(item);
            setSelectedSpecializationId(id);
            setFilterSpecialization('');

            const filteredDoctors = doctors.filter(doctor => doctor.specialization.id === id);
            setFiltredDoctors(filteredDoctors);

        } else if (type === 'doctor') {
            setSelectedDoctor(item);
            setSelectedDoctorId(id);
            setFilterDoctor('');
        } else if (type === 'services') {
            setSelectedService(item);
            setSelectedServiceId(id);
            setFilterServices('');
        }
    };

    const handleSpecializationBlur = (event) => {
        handleInputBlur(event, 'specialization', filteredSpecializations.specializationName, setFilterSpecialization, setSelectedSpecialization);
    };

    const handleDoctorBlur = (event) => {
        handleInputBlur(event, 'doctor', filteredDoctors.firstName + filteredDoctors.lastName + filteredDoctors.middleName, setFilterDoctor, setSelectedDoctor);
    };

    const handleServicesBlur = (event) => {
        handleInputBlur(event, 'services', filteredServices.serviceName, setFilterServices, setSelectedService);
    };

    const handleInputBlur = (event, type, filteredItems, setFilter, setSelected) => {
        const input = event.target;
        const label = document.getElementById(`appointment-${type}-label`);
    
        if (filteredItems && filteredItems.length === 1) {
            setSelected(filteredItems[0]);
            setFilter('');
        } else if (filteredItems && filteredItems.length === 0) {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = `Invalid ${type} name`;
        } else if (label) {
            label.textContent = type.charAt(0).toUpperCase() + type.slice(1);
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
        }
    };

    const handleInputDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleDateBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('appointment-date-label');

        if (!input.value) {
            input.classList.add('error-input-border');
            if (label) {
                label.classList.add('error-label');
                label.textContent = 'Invalid date';
            }
        } else {
            if (label) {
                label.textContent = 'Date';
                input.classList.remove('error-input-border');
                label.classList.remove('error-label');
            }
        }
    };

    const handleMakeAppointment = () => {
        if(!isUserLoggedIn) {
            alert('Sign in to make an appointment');
            onOpenSignIn();
        }
        console.log('Appointment Details:');
        console.log('Specialization:', selectedSpecializationId);
        console.log('Doctor:', selectedDoctorId);
        console.log('Service:', selectedServiceId);
        console.log('Office:', selectedOffice);
        console.log('Date:', selectedDate);
        console.log('Time Slot:', selectedTimeSlot);

        // onClose();
    };


    return (
        <div className="modal-overlay">
            <div className="appointment-container">
                <div className="appointment-top-content">
                    <button className="close-button" onClick={onClose}>X</button>
                    <h2>Make an Appointment</h2>
                </div>
                <div className="appointment-inputs">
                    <div className="appointment-input-wrapper">
                        <input
                            value={selectedSpecialization}
                            onChange={handleInputSpecializationChange}
                            onBlur={handleSpecializationBlur}
                            className="input default-input-border"
                            placeholder=" "
                            required
                        />
                        <label className="input-label" id="appointment-specialization-label">Specialization</label>
                        {filterSpecialization && (
                            <div className="filtred-list">
                                {filteredSpecializations.map(specialization => (
                                    <div key={specialization.id} onClick={() => handleListClick(specialization.id, specialization.specializationName, 'specialization')}>
                                        {specialization.specializationName}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="appointment-input-wrapper">
                        <input
                            value={selectedDoctor}
                            onChange={handleInputDoctorChange}
                            onBlur={handleDoctorBlur}
                            className="input default-input-border"
                            placeholder=" "
                            required
                        />
                        <label className="input-label" id="appointment-doctor-label">Doctor</label>
                        {filterDoctor && (
                            <div className="filtred-list">
                                {filteredDoctors.map(doctor => (
                                    <div key={doctor.id} onClick={() => handleListClick(doctor.id, doctor.firstName + doctor.lastName + doctor.middleName, 'doctor')}>
                                        {doctor.firstName + " " + doctor.lastName + " " + doctor.middleName}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="appointment-input-wrapper">
                        <input
                            value={selectedService}
                            onChange={handleInputServicesChange}
                            onBlur={handleServicesBlur}
                            className="input default-input-border"
                            placeholder=" "
                            required
                        />
                        <label className="input-label" id="appointment-services-label">Services</label>
                        {filterServices && (
                            <div className="filtred-list">
                                {filteredServices.map(service => (
                                    <div key={service.id} onClick={() => handleListClick(service.id, service.serviceName, 'services')}>
                                        {service.serviceName}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="appointment-input-wrapper">
                        <select
                            value={selectedOffice}
                            onChange={handleInputOfficesChange}
                            className="input default-input-border custom-select"
                            required
                        >
                            <option value="" disabled>Select an office</option>
                            {offices.map(office => (
                                <option key={office} value={office}>{office.address}</option>
                            ))}
                        </select>
                        <label className="input-label label-active" id="appointment-offices-label">Office</label>
                    </div>
                    <div className="appointment-input-wrapper">
                        <input
                            value={selectedDate}
                            onChange={handleInputDateChange}
                            onBlur={handleDateBlur}
                            className="input default-input-border"
                            placeholder=" "
                            type="date"
                            required
                        />
                        <label className="input-label" id="appointment-date-label">Date</label>
                    </div>
                    <div className="appointment-input-wrapper">
                        <select
                            value={selectedTimeSlot}
                            onChange={handleTimeSlotChange}
                            className="input default-input-border custom-select"
                            required
                        >
                            <option value="" disabled>Select a time slot</option>
                            {timeSlots.map(slot => (
                                <option key={slot} value={slot}>{slot}</option>
                            ))}
                        </select>
                        <label className="input-label label-active" id="appointment-time-slot-label">Time Slot</label>
                    </div>
                </div>
                <div className="btn-group">
                    <button className='appointment-btn' onClick={handleMakeAppointment}>Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default MakeAnAppointmentModal;