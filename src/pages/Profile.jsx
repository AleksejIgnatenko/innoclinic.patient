import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import usePatientForm from "../hooks/usePatientForm";
import Loader from "../components/organisms/Loader";
import ProfileCard from "../components/organisms/ProfileCard";
import "./../styles/pages/Profile.css";
import "./../styles/organisms/Tab.css";
import Toolbar from "../components/organisms/Toolbar";
import Table from "../components/organisms/Table";
import FieldNames from "../enums/FieldNames";

import GetPhotoByIdAsync from "../api/Documents.API/GetPhotoByIdAsync";
import GetPatientByAccountIdFromTokenFetchAsync from "../api/Profiles.API/GetPatientByAccountIdFromTokenFetchAsync";
import GetAllAppointmentsByPatientIdFetchAsync from "../api/Appointments.API/GetAllAppointmentsByPatientIdFetchAsync";
import { IconBase } from "../components/atoms/IconBase";
import FormModal from "../components/organisms/FormModal";
import useAppointmentForm from "../hooks/useAppointmentForm";
import { InputWrapper } from "../components/molecules/InputWrapper";
import GetAllActiveSpecializationsFetchAsync from "../api/Services.API/GetAllActiveSpecializationsFetchAsync";
import GetAllDoctorsAtWorkFetchAsync from "../api/Profiles.API/GetAllDoctorsAtWorkFetchAsync";
import GetAllActiveMedicalServicesFetchAsync from "../api/Services.API/GetAllActiveMedicalServicesFetchAsync";
import GetAllOfficesFetchAsync from "../api/Offices.API/GetAllOfficesFetchAsync";
import { SelectWrapper } from "../components/molecules/SelectWrapper";
import GetAllAvailableTimeSlotsFetchAsync from "../api/Appointments.API/GetAllAvailableTimeSlotsFetchAsync";
import { ButtonBase } from "../components/atoms/ButtonBase";
import UpdatePatientFecthAsync from "../api/Profiles.API/UpdatePatientFecthAsync";
import CreatePhotoFetchAsync from "../api/Documents.API/CreatePhotoFetchAsync";
import UpdatePhotoFetchAsync from "../api/Documents.API/UpdatePhotoFetchAsync";
import ImageUploader from "../components/organisms/ImageUploader";
import UpdateAppointmentFetchAsync from "../api/Appointments.API/UpdateAppointmentFetchAsync";

function Profile() {
    const location = useLocation();
    const navigate = useNavigate();

    const [isUpdateAppointmentModalOpen, setIsUpdateAppointmentModalOpen] = useState(false);

    const [patient, setPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [editingEppointments, setEditingAppointments] = useState([]);

    const [specializations, setSpecializations] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]);
    const [officeOptions, setOfficeOptions] = useState([]);

    const [photo, setPhoto] = useState(null);
    const [editingPhoto, setEditingPhoto] = useState(null);

    const [activeTab, setActiveTab] = useState('personal-information');

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [selectDoctorName, setSelectDoctorName] = useState('');

    const [filteredSpecializations, setFilteredSpecializations] = useState([]);
    const [selectSpecializationName, setSelectSpecializationName] = useState('');

    const [filteredMedicalServices, setFilteredMedicalServices] = useState([]);
    const [selectMedicalServiceName, setSelectMedicalServiceName] = useState('');

    const [timeSlots, setTimeSlots] = useState([]);

    const { formData, setFormData, errors, setErrors, handleChange, handleBlur, handlePhoneNumberKeyDown, resetForm, isFormValid } = usePatientForm({
        firstName: '',
        lastName: '',
        middleName: '',
        phoneNumber: '',
        dateOfBirth: '',
    });

    const { appointmentFormData, setAppointmentFormData, appointmentErrors, setAppointmentErrors, handleAppointmentChange, handleAppointmentBlur, resetAppointmentForm, isAppointmentFormValid } = useAppointmentForm({
        doctorId: '',
        medicalServiceId: '',
        officeId: '',
        date: '',
        time: '',
        isApproved: false,
    });

    const columnNames = [
        'date',
        'time',
        'doctorFullName',
        'medicalServiceName',
    ];

    const fetchData = async () => {
        try {
            toggleLoader(true);

            const fetchedSpecializations = await GetAllActiveSpecializationsFetchAsync();
            setSpecializations(fetchedSpecializations);

            const fetchedDoctors = await GetAllDoctorsAtWorkFetchAsync();
            setDoctors(fetchedDoctors);

            const fetchedServices = await GetAllActiveMedicalServicesFetchAsync();
            setServices(fetchedServices);

            const fetchedOffices = await GetAllOfficesFetchAsync();
            const officeOptions = fetchedOffices.map(({ id, city, street, houseNumber, officeNumber }) => ({
                id,
                value: id,
                displayValue: `${city} ${street} ${houseNumber} ${officeNumber}`
            }))
            setOfficeOptions(officeOptions);

            const fetchedPatient = await GetPatientByAccountIdFromTokenFetchAsync();

            if (fetchedPatient.account.photoId) {
                const fetchedPhoto = await GetPhotoByIdAsync(fetchedPatient.account.photoId);
                setPhoto(fetchedPhoto);
                setEditingPhoto(fetchedPhoto);
            }

            const fetchedAppointments = await GetAllAppointmentsByPatientIdFetchAsync(fetchedPatient.id);
            setAppointments(fetchedAppointments);

            const formattedAppointments = formatAppointment(fetchedAppointments);
            setEditingAppointments(formattedAppointments);

            setPatient(fetchedPatient);

            const formattedPatient = formatPatient(fetchedPatient);
            setFormData(formattedPatient);

        } catch (error) {
            console.error('Error fetching patient:', error);
        } finally {
            toggleLoader(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const fetchAllAvailableTimeSlotsFetch = async () => {
            try {
                const findService = services.find(s => s.id === appointmentFormData.medicalServiceId);

                if (findService) {
                    const timeSlotSize = findService.serviceCategory.timeSlotSize;
                    const fetchedTimeSlots = await GetAllAvailableTimeSlotsFetchAsync(appointmentFormData.date, timeSlotSize, appointmentFormData.doctorId);
                    const timeSlots = fetchedTimeSlots.map((timeSlot) => {
                        const [startTime, endTime] = timeSlot.split(' - ');
                        const id = `${startTime.replace(':', '')}${endTime.replace(':', '')}`;
                        return {
                            id: id,
                            value: timeSlot,
                            displayValue: timeSlot
                        };
                    });
                    setTimeSlots(timeSlots);
                } else {
                    console.error('Service not found');
                }

            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        if (appointmentFormData.medicalServiceId && appointmentFormData.date && appointmentFormData.doctorId) {
            fetchAllAvailableTimeSlotsFetch();
        }
    }, [appointmentFormData.medicalServiceId, appointmentFormData.date, appointmentFormData.doctorId]);

    useEffect(() => {
        const tab = new URLSearchParams(location.search).get('tab');
        if (tab) {
            setActiveTab(tab);
        }
    }, [location]);

    const formatPatient = (patient) => {
        const {
            id,
            firstName,
            lastName,
            middleName,
            account,
            dateOfBirth,
        } = patient;

        return {
            id,
            firstName,
            lastName,
            middleName,
            phoneNumber: account.phoneNumber,
            dateOfBirth,
        };
    };

    const formatAppointment = (appointments) => {
        return appointments.map(({ id, date, time, doctor, medicalService, isApproved }) => ({
            id,
            date: date,
            time: time,
            doctorFullName: `${doctor.firstName} ${doctor.lastName} ${doctor.middleName}`,
            medicalServiceName: medicalService.serviceName,
            isApproved,
        }));
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        navigate(`/profile?tab=${tab}`);
    };

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    const handleSpecializationSelect = (specialization) => {
        appointmentFormData.specializationId = specialization.id;
        setFilteredSpecializations([]);
        setSelectSpecializationName(specialization.specializationName);
        appointmentErrors.specializationId = true;
    };

    const handleDoctorSelect = (doctor) => {
        appointmentFormData.doctorId = doctor.id;
        setFilteredDoctors([]);
        setSelectDoctorName(doctor.firstName + ' ' + doctor.lastName + ' ' + doctor.middleName);

        const office = officeOptions.filter(office => office.id === doctor.office.id);
        setOfficeOptions(office);

        appointmentErrors.doctorId = true;
    };

    const handleMedicalServiceSelect = (medicalService) => {
        appointmentFormData.medicalServiceId = medicalService.id;
        setFilteredMedicalServices([]);
        setSelectMedicalServiceName(medicalService.serviceName);
        appointmentErrors.medicalServiceId = true;
    };

    const handleSpecializationChange = (value) => {
        if (value === '') {
            setFilteredSpecializations([]);
        } else {
            const filtered = specializations.filter(spec => spec.specializationName.toLowerCase().includes(value.toLowerCase()));
            setFilteredSpecializations(filtered);
        }
        setSelectSpecializationName(value);
    };

    const handleDoctorChange = (value) => {
        if (value === '') {
            setFilteredDoctors([]);
        } else {
            const filtered = doctors.filter(doc => doc.firstName.toLowerCase().includes(value.toLowerCase()) ||
                doc.lastName.toLowerCase().includes(value.toLowerCase()) ||
                doc.middleName.toLowerCase().includes(value.toLowerCase()));
            setFilteredDoctors(filtered);
        }
        setSelectDoctorName(value);
    };

    const handleMedicalServiceChange = (value) => {
        if (value === '') {
            setFilteredMedicalServices([]);
        } else {
            const filtered = services.filter(service => service.serviceName.toLowerCase().includes(value.toLowerCase()));
            setFilteredMedicalServices(filtered);
        }
        setSelectMedicalServiceName(value);
    };

    const toggleUpdateAppointmentModal = (appointmentId) => {
        resetAppointmentForm();
        if(appointmentId) {
            const appointment = appointments.find(appointment => appointment.id == appointmentId);
            const doctor = doctors.find(doctor => doctor.id === appointment.doctor.id);
            const office = officeOptions.filter(office => office.id === doctor.office.id);
            setOfficeOptions(office);

            setSelectSpecializationName(doctor.specialization.specializationName);
            setSelectDoctorName(`${doctor.firstName} ${doctor.lastName} ${doctor.middleName}`);
            setSelectMedicalServiceName(appointment.medicalService.serviceName);

            setAppointmentFormData({
                id: appointment.id,
                doctorId: doctor.id,
                medicalServiceId: appointment.medicalService.id,
                officeId: doctor.office.id,
                date: appointment.date,
                time: appointment.time,
            });

            setAppointmentErrors({
                doctorId: true,
                medicalServiceId: true,
                date: true,
                time: true,
            })
        }

        setIsUpdateAppointmentModalOpen(!isUpdateAppointmentModalOpen);
    };

    const handleUpdateAppointment = async (e) => {
        e.preventDefault();
        const updateAppointmentRequest = {
            id: appointmentFormData.id,
            doctorId: appointmentFormData.doctorId,
            medicalServiceId: appointmentFormData.medicalServiceId,
            date: appointmentFormData.date,
            time: appointmentFormData.time,
            isApproved: false
        };
        
        await UpdateAppointmentFetchAsync(updateAppointmentRequest);
    };

    const toggleEditClick = () => {
        if (isEditing) {
            const confirmCancel = window.confirm("Do you really want to cancel? Changes will not be saved.");
            if (!confirmCancel) {
                return;
            }
            setFormData(patient);
        }
        setErrors({
            firstName: true,
            lastName: true,
            phoneNumber: true,
            dateOfBirth: true,
        });
        setIsEditing(!isEditing);
    };

    async function handleUpdate() {
        setIsEditing(false);

        let photoId = '';
        if (!patient.account.photoId && editingPhoto) {
            photoId = await CreatePhotoFetchAsync(editingPhoto);

            setPhoto(editingPhoto);
        } else if (editingPhoto instanceof Blob) {
            const imageUrl = URL.createObjectURL(editingPhoto);
            setPhoto(imageUrl)

            await UpdatePhotoFetchAsync(editingPhoto, patient.photoId);
        }

        const updatePatientRequest = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            middleName: formData.middleName,
            isLinkedToAccount: patient.isLinkedToAccount,
            phoneNumber: formData.phoneNumber,
            dateOfBirth: formData.dateOfBirth,
            photoId: photoId,
        }

        await UpdatePatientFecthAsync(patient.id, updatePatientRequest);
        fetchData();
    }

    return (
        <>
            <Toolbar pageTitle="Profile" />
            {isLoading ? (
                <Loader />
            ) : (
                <>
                    <div className="tabs">
                        <ul className="tabs-content">
                            <button
                                className={`tabs-button ${activeTab === 'personal-information' ? 'is-active' : ''}`}
                                onClick={() => handleTabClick('personal-information')}
                            >
                                Personal Information
                            </button>
                            <button
                                className={`tabs-button ${activeTab === 'appointment-results' ? 'is-active' : ''}`}
                                onClick={() => handleTabClick('appointment-results')}
                            >
                                Appointment Results
                            </button>
                        </ul>
                    </div>

                    {activeTab === 'personal-information' && (
                        <ProfileCard>
                        <div className="profile-icon-container">
                            {isEditing ? (
                                <>
                                    <IconBase
                                        name={"bx-check"}
                                        onClick={isFormValid ? handleUpdate : null}
                                        style={{ cursor: isFormValid ? 'pointer' : 'not-allowed' }}
                                        className={isFormValid ? '' : 'icon-invalid'}
                                    />
                                    <IconBase name={"bx-x"} onClick={toggleEditClick} />
                                </>
                            ) : (
                                <IconBase name={"bx-pencil"} onClick={toggleEditClick} style={{ cursor: 'pointer' }} />
                            )}
                        </div>
                        {isEditing ? (
                            <div className="img-container">
                                <ImageUploader
                                    photo={photo}
                                    setPhoto={setEditingPhoto}
                                />
                            </div>
                        ) : (
                            <div className="img-container">
                                <img src={photo} alt="" className={photo ? '' : 'img-area'} />
                            </div>
                        )}

                        {isEditing ? (
                            <div>
                                <InputWrapper
                                    type="text"
                                    label="First Name"
                                    id="firstName"
                                    value={formData.firstName}
                                    onBlur={handleBlur('firstName')}
                                    onChange={handleChange('firstName')}
                                    required
                                />
                                <InputWrapper
                                    type="text"
                                    label="Last Name"
                                    id="lastName"
                                    value={formData.lastName}
                                    onBlur={handleBlur('lastName')}
                                    onChange={handleChange('lastName')}
                                    required
                                />
                                <InputWrapper
                                    type="text"
                                    label="Middle Name"
                                    id="middleName"
                                    value={formData.middleName}
                                    onBlur={handleBlur('middleName', false)}
                                    onChange={handleChange('middleName', false)}
                                    required
                                />
                                <InputWrapper
                                    type="text"
                                    label="Phone Number"
                                    id="phoneNumber"
                                    value={formData.phoneNumber}
                                    onBlur={handleBlur('phoneNumber')}
                                    onChange={handleChange('phoneNumber')}
                                    onKeyDown={handlePhoneNumberKeyDown}
                                    required
                                />
                                <InputWrapper
                                    type="date"
                                    label="Date Of Birth"
                                    id="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onBlur={handleBlur('dateOfBirth')}
                                    onChange={handleChange('dateOfBirth')}
                                    required
                                />
                            </div>
                        ) : (
                            <div className="profile-content">
                                <p>First name: {formData.firstName}</p>
                                <p>Last name: {formData.lastName}</p>
                                <p>Middle name: {formData.middleName}</p>
                                <p>Phone Number: {formData.phoneNumber}</p>
                                <p>Date of birth: {formData.dateOfBirth}</p>
                            </div>
                        )}
                    </ProfileCard>
                    )}

                    {activeTab === 'appointment-results' && (
                        <div data-content className={activeTab === 'appointment-results' ? 'is-active' : ''} id="personalInformation">
                            <>
                                {appointments.length === 0 && (
                                    <p className="no-items">Nothing was found</p>
                                )}
                                {editingEppointments.length > 0 && (
                                    <div className="table">
                                        <Table>
                                            <thead>
                                                <tr>
                                                    {columnNames.map(columnName => (
                                                        <th key={columnName}>
                                                            {FieldNames[columnName]}
                                                        </th>
                                                    ))}
                                                    <th>Medical Results</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {editingEppointments.map(appointment => (
                                                    <tr key={appointment.id}
                                                        className={appointment.isApproved ? 'approved-row' : ''}
                                                    >
                                                        {columnNames.map(columnName => (
                                                            <td key={columnName}>{appointment[columnName]}</td>
                                                        ))}
                                                        <td
                                                            onClick={() => navigate(`/appointment-results/${appointment.id}`)}
                                                            style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                                        >
                                                            Appointment Results
                                                        </td>
                                                        {appointment.isApproved ? (
                                                            <td>
                                                            </td>
                                                        ) : (
                                                            <td>
                                                                <IconBase name={"bx-pencil"} onClick={() => toggleUpdateAppointmentModal(appointment.id)} />
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                )}
                            </>
                        </div>
                    )}

                    {isUpdateAppointmentModalOpen && (
                        <FormModal title="Create Appointment" onClose={() => toggleUpdateAppointmentModal()} onSubmit={handleUpdateAppointment} showCloseButton={true}>
                            <div className="modal-inputs">
                                <div>
                                    <InputWrapper
                                        type="text"
                                        label="Specialization"
                                        id="specialization"
                                        value={selectSpecializationName}
                                        onChange={(e) => handleSpecializationChange(e.target.value)}
                                        onBlur={handleAppointmentBlur('specialization')}
                                        required
                                    />
                                    {filteredSpecializations.length > 0 && (
                                        <div className="filtred-list">
                                            {filteredSpecializations.map(specialization => (
                                                <h5 key={specialization.id} onClick={() => handleSpecializationSelect(specialization)}>
                                                    {specialization.specializationName}
                                                </h5>
                                            ))}
                                        </div>
                                    )}
                                    <InputWrapper
                                        type="text"
                                        label="Doctor"
                                        id="doctor"
                                        value={selectDoctorName}
                                        onChange={(e) => handleDoctorChange(e.target.value)}
                                        onBlur={handleAppointmentBlur('doctor')}
                                        required
                                    />
                                    {filteredDoctors.length > 0 && (
                                        <div className="filtred-list">
                                            {filteredDoctors.map(doctor => (
                                                <h5 key={doctor.id} onClick={() => handleDoctorSelect(doctor)}>
                                                    {doctor.firstName} {doctor.lastName} {doctor.middleName}
                                                </h5>
                                            ))}
                                        </div>
                                    )}
                                    <InputWrapper
                                        type="text"
                                        label="Medical Service"
                                        id="medicalServiceId"
                                        value={selectMedicalServiceName}
                                        onChange={(e) => handleMedicalServiceChange(e.target.value)}
                                        onBlur={handleAppointmentBlur('medicalServiceId')}
                                        required
                                    />
                                    {filteredMedicalServices.length > 0 && (
                                        <div className="filtred-list">
                                            {filteredMedicalServices.map(medicalService => (
                                                <h5 key={medicalService.id} onClick={() => handleMedicalServiceSelect(medicalService)}>
                                                    {medicalService.serviceName}
                                                </h5>
                                            ))}
                                        </div>
                                    )}
                                    <SelectWrapper
                                        label="Office"
                                        id="office"
                                        value={appointmentFormData.officeId}
                                        onBlur={handleAppointmentBlur('officeId')}
                                        onChange={handleAppointmentChange('officeId')}
                                        required
                                        placeholder={appointmentFormData.officeId ? "" : "Select office"}
                                        options={officeOptions}
                                    />
                                    <InputWrapper
                                        type="date"
                                        label="Date"
                                        id="date"
                                        value={appointmentFormData.date}
                                        onChange={handleAppointmentChange('date')}
                                        onBlur={handleAppointmentBlur('date')}
                                        required
                                    />
                                    <SelectWrapper
                                        label="Time"
                                        id="time"
                                        value={appointmentFormData.time}
                                        onChange={handleAppointmentChange('time')}
                                        onBlur={handleAppointmentBlur('time')}
                                        required
                                        placeholder={appointmentFormData.time ? "" : "Select time"}
                                        options={timeSlots}
                                    />

                                    <div className="form-actions">
                                        <ButtonBase type="submit" disabled={!isAppointmentFormValid}>
                                            Confirm
                                        </ButtonBase>
                                    </div>
                                </div>
                            </div>
                        </FormModal>
                    )}
                </>
            )}
        </>
    );
}

export default Profile;