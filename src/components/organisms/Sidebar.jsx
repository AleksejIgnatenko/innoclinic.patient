import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IconBase } from "../atoms/IconBase";
import '../../styles/organisms/Sidebar.css';
import 'boxicons/css/boxicons.min.css';
import Cookies from 'js-cookie';
import useSignInForm from "../../hooks/useSignInForm";
import useSignUpForm from "../../hooks/useSignUpForm";
import useAppointmentForm from "../../hooks/useAppointmentForm";
import FormModal from "./FormModal";
import { InputWrapper } from "../molecules/InputWrapper";
import { ButtonBase } from "../atoms/ButtonBase";
import { SelectWrapper } from "../molecules/SelectWrapper";

import SignUpFetchAsync from "../../api/Authorization.API/SignUpFetchAsync";
import SignInFetchAsync from "../../api/Authorization.API/SignInFetchAsync";
import GetAllActiveSpecializationsFetchAsync from "../../api/Services.API/GetAllActiveSpecializationsFetchAsync";
import GetAllDoctorsAtWorkFetchAsync from "../../api/Profiles.API/GetAllDoctorsAtWorkFetchAsync";
import GetAllActiveMedicalServicesFetchAsync from "../../api/Services.API/GetAllActiveMedicalServicesFetchAsync";
import GetAllOfficesFetchAsync from "../../api/Offices.API/GetAllOfficesFetchAsync";
import GetAllAvailableTimeSlotsFetchAsync from "../../api/Appointments.API/GetAllAvailableTimeSlotsFetchAsync";
import CreateAppointmentFetchAsync from "../../api/Appointments.API/CreateAppointmentFetchAsync";
import GetPatientByAccountIdFromTokenFetchAsync from "../../api/Profiles.API/GetPatientByAccountIdFromTokenFetchAsync";
import { hashPassword } from "../../utils/PasswordUtils";
import GetPhotoByIdAsync from "../../api/Documents.API/GetPhotoByIdAsync";
import LogOutFetchAsync from "../../api/Authorization.API/LogOutFetchAsync";

export default function Sidebar({ currentTheme, toggleTheme }) {
    const location = useLocation();
    const navigate = useNavigate();

    const [photo, setPhoto] = useState(null);
    const [profile, setProfile] = useState(null);

    const [specializations, setSpecializations] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]);

    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [selectDoctorName, setSelectDoctorName] = useState('');

    const [filteredSpecializations, setFilteredSpecializations] = useState([]);
    const [selectSpecializationName, setSelectSpecializationName] = useState('');

    const [filteredMedicalServices, setFilteredMedicalServices] = useState([]);
    const [selectMedicalServiceName, setSelectMedicalServiceName] = useState('');

    const [officeOptions, setOfficeOptions] = useState([]);

    const [showSidebar, setShowSidebar] = useState(false);

    const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const [isCreateAppointmentModalOpen, setIsCreateAppointmentModalOpen] = useState(false);

    const isLoggedIn = Boolean(Cookies.get('isLoggedIn'));

    const [isLoading, setIsLoading] = useState(false);

    const [timeSlots, setTimeSlots] = useState([]);

    const { signInFormData, signInErrors, handleSignInChange, handleSignInBlur, resetSignInForm, isSignInFormValid } = useSignInForm({
        email: '',
        password: ''
    });

    const { signUpFormData, signUpErrors, handleSignUpChange, handleSignUpBlur, resetSignUpForm, isSignUpFormValid } = useSignUpForm({
        email: '',
        password: '',
        repeatPassword: ''
    });

    const { appointmentFormData, appointmentErrors, handleAppointmentChange, handleAppointmentBlur, resetAppointmentForm, isAppointmentFormValid } = useAppointmentForm({
        doctorId: '',
        medicalServiceId: '',
        officeId: '',
        date: '',
        time: '',
        isApproved: false,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
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

                const fetchedProfile = await GetPatientByAccountIdFromTokenFetchAsync();
                if (fetchedProfile.account.photoId) {
                    const fetchedPhoto = await GetPhotoByIdAsync(fetchedProfile.account.photoId);
                    setPhoto(fetchedPhoto);
                }
                setProfile(fetchedProfile);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
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
            } finally {
                setIsLoading(false);
            }
        };

        if (appointmentFormData.medicalServiceId && appointmentFormData.date && appointmentFormData.doctorId) {
            fetchData();
        }
    }, [appointmentFormData.medicalServiceId, appointmentFormData.date, appointmentFormData.doctorId]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const modal = params.get('modal');
        
        setIsCreateAppointmentModalOpen(false);
        setIsSignUpModalOpen(false);
        setIsSignInModalOpen(false);

        if (modal === 'create-appointment') {
            const doctorId = params.get('doctorId');
            setIsCreateAppointmentModalOpen(true);
            if (doctorId) {
                const selectedDoctor = doctors.find(doctor => doctor.id === doctorId);
                if (selectedDoctor) {
                    const fullName = `${selectedDoctor.firstName} ${selectedDoctor.middleName} ${selectedDoctor.lastName}`;
                    setSelectDoctorName(fullName);
                    appointmentFormData.doctorId = doctorId;
                } else {
                    setSelectDoctorName('');
                }
            }
        } else if (modal === 'sign-up') {
            setIsSignUpModalOpen(true);
        } else if (modal === 'sign-in') {
            setIsSignInModalOpen(true);
        }
    }, [location.search]);

    const truncateName = (name) => {
        if (!name) return '';
        return name.length > 10 ? name.substring(0, 10) + '...' : name;
    };

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const handleSubMenuClick = (e) => {
        const listItem = e.currentTarget.closest('li');
        if (listItem) {
            listItem.classList.toggle("showMenu");
        }
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

    async function handleLogOut() {
        await LogOutFetchAsync();
    };

    const toggleSignInModal = () => {
        resetSignInForm();

        setIsSignInModalOpen(!isSignInModalOpen);

        setIsSignUpModalOpen(false);
        setIsCreateAppointmentModalOpen(false);
    };

    const toggleSignUpModal = () => {
        resetAppointmentForm();

        setIsSignInModalOpen(false);
        setIsSignUpModalOpen(false);

        const newModalState = !isSignUpModalOpen;
        setIsSignUpModalOpen(newModalState);

        const currentPath = location.pathname;
        const params = new URLSearchParams(location.search);

        if (!newModalState) {
            params.delete('modal');
        }

        const appointmentPath = `${currentPath}?${params.toString()}`;
        navigate(appointmentPath);
    };

    const toggleCreateAppointmentModal = () => {
        resetAppointmentForm();

        setIsSignInModalOpen(false);
        setIsSignUpModalOpen(false);

        const newModalState = !isCreateAppointmentModalOpen;
        setIsCreateAppointmentModalOpen(newModalState);

        const currentPath = location.pathname;
        const params = new URLSearchParams(location.search);

        if (!newModalState) {
            params.delete('modal');
            params.delete('doctorId');
        }

        const appointmentPath = `${currentPath}?${params.toString()}`;
        navigate(appointmentPath);
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        console.log(signInFormData);
        await SignInFetchAsync(signInFormData);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        signUpFormData.password = hashPassword(signUpFormData.password);
        await SignUpFetchAsync(signUpFormData);
    };

    const handleCreateAppointment = async (e) => {
        e.preventDefault();

        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            toggleSignInModal();
        } else {

            const appointmentData = {
                doctorId: appointmentFormData.doctorId,
                medicalServiceId: appointmentFormData.medicalServiceId,
                date: appointmentFormData.date,
                time: appointmentFormData.time,
                isApproved: false
            };
            await CreateAppointmentFetchAsync(appointmentData);
        }
    };

    return (
        <>
            <div className={`sidebar ${showSidebar ? '' : 'close'}`}>
                <div className="logo-details">
                    <IconBase name="bx-menu" className="menu-icon" onClick={toggleSidebar} />
                    <span className="logo_name">DashBoard</span>
                </div>
                <ul className="nav-links">
                    <li>
                        <Link to="/">
                            <IconBase name="bx-home" className="nav-icon" />
                            <span className="link_name">Home</span>
                        </Link>
                        <ul className="sub-menu blank">
                            <li><Link to="/" className="link_name">Home</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link to="/doctors">
                            <IconBase name='bx-user-circle' />
                            <span className="link_name">Doctors</span>
                        </Link>
                        <ul className="sub-menu blank">
                            <li><Link to="/doctors" className="link_name">Doctors</Link></li>
                        </ul>
                    </li>
                    <li onClick={handleSubMenuClick}>
                        <div className="icon-link">
                            <Link>
                                <i className='bx bx-collection'></i>
                                <span className="link_name">Services</span>
                            </Link>
                            <i className='bx bxs-chevron-down arrow' ></i>
                        </div>
                        <ul className="sub-menu">
                            <li><Link className="link_name">Services</Link></li>
                            <li><Link to="/services?tab=Consultations">Consultations</Link></li>
                            <li><Link to="/services?tab=Diagnostics">Diagnostics</Link></li>
                            <li><Link to="/services?tab=Analyses">Analyses</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link onClick={toggleCreateAppointmentModal} to="?modal=create-appointment">
                            <i className='bx bx-plus' ></i>
                            <span className="link_name">Make an appointment</span>
                        </Link>
                        <ul className="sub-menu blank">
                            <li><Link className="link_name" onClick={toggleCreateAppointmentModal}>Make an appointment</Link></li>
                        </ul>
                    </li>
                    <li>
                        <Link onClick={toggleTheme}>
                            {currentTheme === 'light' ? <i className='bx bx-moon'></i> : <i className='bx bx-sun sun'></i>}
                            <span className="link_name">Switching themes</span>
                        </Link>
                        <ul className="sub-menu blank">
                            <li><Link className="link_name" onClick={toggleTheme}>Switching themes</Link></li>
                        </ul>
                    </li>
                    {isLoggedIn ? (
                        <li>
                            <div className="profile-details">
                                <Link to="/profile?tab=personal-information">
                                    <div className="profile-content">
                                        <img src={photo} alt="profileImg" />
                                    </div>
                                    <div className="profile-info">
                                        {profile ? (
                                            <>
                                                <div className="profile_name">{`${truncateName(`${profile.firstName} ${profile.lastName}`)}`}</div>
                                                <div className="role">{profile.role || 'Role'}</div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="profile_name">Name</div>
                                                <div className="role">Role</div>
                                            </>
                                        )}
                                    </div>
                                </Link>
                                <i className='bx bx-log-out' onClick={handleLogOut}></i>
                            </div>
                        </li>
                    ) : (
                        <>
                            <li>
                                <Link to="?modal=sign-in">
                                    <i className='bx bx-log-in'></i>
                                    <span className="link_name">Login</span>
                                </Link>
                                <ul className="sub-menu blank">
                                    <li><Link className="link_name" to="?modal=sign-in">Login</Link></li>
                                </ul>
                            </li>
                            <li>
                                <Link to="?modal=sign-up">
                                    <i className='bx bx-user-plus'></i>
                                    <span className="link_name">Sign Up</span>
                                </Link>
                                <ul className="sub-menu blank">
                                    <li><Link className="link_name" to="?modal=sign-up">Sign Up</Link></li>
                                </ul>
                            </li>
                        </>
                    )}

                    {isSignInModalOpen && (
                        <FormModal title="Sign In" onClose={toggleSignInModal} onSubmit={handleSignIn} showCloseButton={true}>
                            <div className="modal-inputs">
                                <InputWrapper
                                    type="text"
                                    label="Email"
                                    id="email"
                                    value={signInFormData.email}
                                    onBlur={handleSignInBlur('email')}
                                    onChange={handleSignInChange('email')}
                                    required
                                />
                                <InputWrapper
                                    type="text"
                                    label="Password"
                                    id="password"
                                    value={signInFormData.password}
                                    onBlur={handleSignInBlur('password')}
                                    onChange={handleSignInChange('password')}
                                    required
                                />
                            </div>
                            <div className="form-actions">
                                <ButtonBase type="submit" disabled={!isSignInFormValid}>
                                    Sign In
                                </ButtonBase>
                                <Link to="?modal=sign-up">
                                    <ButtonBase variant="secondary">
                                        Sign Up
                                    </ButtonBase>
                                </Link>
                            </div>
                        </FormModal>
                    )}

                    {isSignUpModalOpen && (
                        <FormModal title="Sign Up" onClose={toggleSignUpModal} onSubmit={handleSignUp} showCloseButton={true}>
                            <div className="modal-inputs">
                                <InputWrapper
                                    type="email"
                                    label="Email"
                                    id="email"
                                    value={signUpFormData.email}
                                    onBlur={handleSignUpBlur('email')}
                                    onChange={handleSignUpChange('email')}
                                    required />
                                <InputWrapper
                                    type="text"
                                    label="Password"
                                    id="password"
                                    value={signUpFormData.password}
                                    onBlur={handleSignUpBlur('password')}
                                    onChange={handleSignUpChange('password')}
                                    required />
                                <InputWrapper
                                    type="text"
                                    label="Repeat Password"
                                    id="repeatPassword"
                                    value={signUpFormData.repeatPassword}
                                    onBlur={handleSignUpBlur('repeatPassword')}
                                    onChange={handleSignUpChange('repeatPassword')}
                                    required />
                            </div>
                            <div className="form-actions">
                                <ButtonBase type="submit" disabled={!isSignUpFormValid}>
                                    Sign Up
                                </ButtonBase>
                                <Link to="?modal=sign-in">
                                    <ButtonBase variant="secondary">
                                        Sign In
                                    </ButtonBase>
                                </Link>
                            </div>
                        </FormModal>
                    )}

                    {isCreateAppointmentModalOpen && (
                        <FormModal title="Create Appointment" onClose={toggleCreateAppointmentModal} onSubmit={handleCreateAppointment} showCloseButton={true}>
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
                                        onBlur={handleAppointmentBlur('medicalService')}
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
                </ul>
            </div>
        </>
    );
};