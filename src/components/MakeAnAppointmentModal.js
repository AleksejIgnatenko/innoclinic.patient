import { useEffect, useState } from 'react';
import './../styles/MakeAnAppointmentModal.css';
import Cookies from 'js-cookie';
import GetAllDoctorsAtWorkFetchAsync from '../api/Profiles.API/GetAllDoctorsAtWorkFetchAsync';
import GetAllActiveOfficesFetchAsync from '../api/Offices.API/GetAllActiveOfficesFetchAsync';
import GetAllActiveSpecializationsFetchAsync from '../api/Services.API/GetAllActiveSpecializationsFetchAsync';
import GetAllActiveMedicalServicesFetchAsync from '../api/Services.API/GetAllActiveMedicalServicesFetchAsync';
import AppointmentModelRequest from '../models/AppointmentModelRequest';
import CreateAppointmentFetchAsync from '../api/Appointments.API/CreateAppointmentFetchAsync';
import Loader from './Loader';

const MakeAnAppointmentModal = ({ onClose, onOpenSignIn }) => {
    const [selectedSpecialization, setSelectedSpecialization] = useState('');
    const [selectedSpecializationId, setSelectedSpecializationId] = useState('');

    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedDoctorId, setSelectedDoctorId] = useState('');
    const [filtredDoctors, setFiltredDoctors] = useState([]);

    const [selectedService, setSelectedService] = useState('');
    const [selectedServiceId, setSelectedServiceId] = useState('');
    const [filtredServices, setFiltredServices] = useState([]);

    const [selectedOfficeId, setSelectedOfficeId] = useState('');
    const [filtredOffice, setFiltredOffice] = useState([]);

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

    const [filterSpecialization, setFilterSpecialization] = useState('');
    const [filterDoctor, setFilterDoctor] = useState('');
    const [filterServices, setFilterServices] = useState('');

    const [specializations, setSpecializations] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]);
    const [offices, setOffices] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    // specializations = ['Specialization 1', 'Specialization 2', 'Specialization 3', 'Specialization 4', 'Specialization 5'];
    // doctors = ['Doctor 1', 'Doctor 2', 'Doctor 3', 'Doctor 4', 'Doctor 5'];
    // services = ['Service 1', 'Service 2', 'Service 3', 'Service 4', 'Service 5'];
    // offices = ['Office 1', 'Office 2', 'Office 3'];
    const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM'];

    let isUserLoggedIn = Cookies.get('refreshToken') !== undefined;

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                const fetchedSpecializations = await GetAllActiveSpecializationsFetchAsync();
                setSpecializations(fetchedSpecializations);

                const fetchedDoctors = await GetAllDoctorsAtWorkFetchAsync();
                setDoctors(fetchedDoctors);

                const fetchedServices = await GetAllActiveMedicalServicesFetchAsync();
                setServices(fetchedServices);

                const fetchedOffices = await GetAllActiveOfficesFetchAsync();
                setOffices(fetchedOffices);
            } catch (error) {
                console.error('Error services:', error);
            } finally {
                toggleLoader(false);
            }
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

    const filteredServices = filtredServices.filter(service =>
        service.serviceName.toLowerCase().includes(filterServices.toLowerCase())
    );

    const handleSpecializationChange = (e) => {
        setSelectedSpecialization(e.target.value);
        setFilterSpecialization(e.target.value);
    };

    const handleDoctorChange = (e) => {
        setSelectedDoctor(e.target.value);
        setFilterDoctor(e.target.value);
    };

    const handleServicesChange = (e) => {
        setSelectedService(e.target.value);
        setFilterServices(e.target.value);
    };

    const handleOfficesChange = (e) => {
        setSelectedOfficeId(e.target.value);
        const label = document.getElementById('appointment-office-label');
        const input = e.target;
        input.classList.remove('error-input-border');
        label.classList.remove('error-label');
        label.textContent = 'Office';
    };

    const handleTimeSlotChange = (e) => {
        setSelectedTimeSlot(e.target.value);
    };

    const handleListClick = (id, item, type) => {
        const label = document.getElementById(`appointment-${type}-label`);
        const input = document.getElementById(`appointment-${type}-input`)
        if (type === 'specialization') {
            setSelectedSpecialization(item.specializationName);
            setSelectedSpecializationId(id);
            setFilterSpecialization('');

            const filteredDoctors = doctors.filter(doctor => doctor.specialization.id === id);
            setFiltredDoctors(filteredDoctors);

            const filtredServices = services.filter(service => service.specialization.id === id);
            setFiltredServices(filtredServices);

            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            label.textContent = `${type}`;
        } else if (type === 'doctor') {
            setSelectedDoctor(item.firstName + " " + item.lastName + " " + item.middleName);
            setSelectedDoctorId(id);
            setFilterDoctor('');

            const filteredOffice = offices.filter(office => office.id === item.office.id);
            setFiltredOffice(filteredOffice);
            // setSelectedOfficeId(filteredOffice[0].id);
            // setSelectedOffice(filterDoctor.address);

            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            label.textContent = `${type}`;
        } else if (type === 'service') {
            setSelectedService(item.serviceName);
            setSelectedServiceId(id);
            setFilterServices('');

            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            label.textContent = `${type}`;
        }
    };

    const handleSpecializationBlur = (event) => {
        handleInputBlur(event, 'specialization', filteredSpecializations.specializationName, setFilterSpecialization, setSelectedSpecialization);
    };

    const handleDoctorBlur = (event) => {
        handleInputBlur(event, 'doctor', filteredDoctors.firstName + filteredDoctors.lastName + filteredDoctors.middleName, setFilterDoctor, setSelectedDoctor);
    };

    const handleServicesBlur = (event) => {
        handleInputBlur(event, 'service', filteredServices.serviceName, setFilterServices, setSelectedService);
    };

    const handleOfficeBlur = (event) => {
        const label = document.getElementById('appointment-office-label');
        const input = event.target;

        if (!input.value) {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = 'Please, choose the office';
        } else {
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            label.textContent = 'Office';
        }
    };

    const handleInputBlur = (event, type, filteredItems, setFilter, setSelected) => {
        const input = event.target;
        const label = document.getElementById(`appointment-${type}-label`);

        const inputValue = input.value.trim();
        const itemsArray = Array.isArray(filteredItems) ? filteredItems : [];

        if (!inputValue) {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = `Please, choose the ${type}`;
        } else if (itemsArray.length === 1) {
            setSelected(itemsArray[0]);
            setFilter('');
        } else if (itemsArray.length === 0) {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = `Invalid ${type} name`;
        }

        if (inputValue && !itemsArray.includes(inputValue)) {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = `Invalid ${type} name`;
        }
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleDateBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('appointment-date-label');

        if (!input.value) {
            input.classList.add('error-input-border');
            if (label) {
                label.classList.add('error-label');
                label.textContent = 'Please, select the date';
            }
        } else {
            if (label) {
                label.textContent = 'Date';
                input.classList.remove('error-input-border');
                label.classList.remove('error-label');
            }
        }
    };

    const isFormValid = () => {
        return selectedSpecializationId !== '' && selectedDoctorId !== '' && selectedServiceId !== '' &&
            selectedOfficeId !== '' && selectedDate !== '' && selectedTimeSlot !== '';
    };

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    async function toggleCreateAppointmentAsync() {
        if (!isUserLoggedIn) {
            alert('Sign in to make an appointment');
            onOpenSignIn();
        }
        const appointmentModelRequest = new AppointmentModelRequest(selectedDoctorId, selectedServiceId, selectedDate, selectedTimeSlot, false);
        await CreateAppointmentFetchAsync(appointmentModelRequest);
    };

    return (
        <div className="modal-overlay">
            {isLoading ? (
                <div className="loader-container">
                    <Loader />
                </div>
            ) : (
                <div className="appointment-container">
                    <div className="appointment-top-content">
                        <button className="close-button" onClick={onClose}>X</button>
                        <h2>Make an Appointment</h2>
                    </div>
                    <div className="appointment-inputs">
                        <div className="appointment-input-wrapper">
                            <input
                                id="appointment-specialization-input"
                                value={selectedSpecialization}
                                onChange={handleSpecializationChange}
                                onBlur={handleSpecializationBlur}
                                className="input default-input-border"
                                placeholder=" "
                                required
                            />
                            <label className="input-label" id="appointment-specialization-label">Specialization</label>
                            {filterSpecialization && (
                                <div className="filtred-list">
                                    {filteredSpecializations.map(specialization => (
                                        <div key={specialization.id} onClick={() => handleListClick(specialization.id, specialization, 'specialization')}>
                                            {specialization.specializationName}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="appointment-input-wrapper">
                            <input
                                id="appointment-doctor-input"
                                value={selectedDoctor}
                                onChange={handleDoctorChange}
                                onBlur={handleDoctorBlur}
                                className="input default-input-border"
                                placeholder=" "
                                required
                            />
                            <label className="input-label" id="appointment-doctor-label">Doctor</label>
                            {filterDoctor && (
                                <div className="filtred-list">
                                    {filteredDoctors.map(doctor => (
                                        <div key={doctor.id} onClick={() => handleListClick(doctor.id, doctor, 'doctor')}>
                                            {doctor.firstName + " " + doctor.lastName + " " + doctor.middleName}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="appointment-input-wrapper">
                            <input
                                id="appointment-service-input"
                                value={selectedService}
                                onChange={handleServicesChange}
                                onBlur={handleServicesBlur}
                                className="input default-input-border"
                                placeholder=" "
                                required
                            />
                            <label className="input-label" id="appointment-service-label">Service</label>
                            {filterServices && (
                                <div className="filtred-list">
                                    {filteredServices.map(service => (
                                        <div key={service.id} onClick={() => handleListClick(service.id, service, 'service')}>
                                            {service.serviceName}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="appointment-input-wrapper">
                            <select
                                value={selectedOfficeId}
                                onChange={handleOfficesChange}
                                onBlur={handleOfficeBlur}
                                className="input default-input-border custom-select"
                                required
                            >
                                <option value="" disabled>Select an office</option>
                                {filtredOffice.map(office => (
                                    <option key={office.id} value={office.id}>{office.address}</option>
                                ))}
                            </select>
                            <label className="input-label label-active" id="appointment-office-label">Office</label>
                        </div>
                        <div className="appointment-input-wrapper">
                            <input
                                value={selectedDate}
                                onChange={handleDateChange}
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
                        <button
                            className={`appointment-btn ${!isFormValid() ? 'disabled-appointment-btn' : ''}`}
                            onClick={toggleCreateAppointmentAsync}
                            disabled={!isFormValid()}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MakeAnAppointmentModal;