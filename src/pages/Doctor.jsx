import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/organisms/Loader";
import ProfileCard from "../components/organisms/ProfileCard";
import GetDoctorByIdFetchAsync from "../api/Profiles.API/GetDoctorByIdFetchAsync";
import GetPhotoByIdAsync from "../api/Documents.API/GetPhotoByIdAsync";
import Toolbar from "../components/organisms/Toolbar";
import { ButtonBase } from "../components/atoms/ButtonBase";

function Doctor() {
    const { id } = useParams();

    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                toggleLoader(true);

                const fetchedDoctor = await GetDoctorByIdFetchAsync(id);
                setDoctor(fetchedDoctor);
                console.log(fetchedDoctor);

                if (fetchedDoctor.account.photoId) {
                    const fetchedPhoto = await GetPhotoByIdAsync(fetchedDoctor.account.photoId);
                    setPhoto(fetchedPhoto);
                }
            } catch (error) {
                console.error('Error fetching doctor:', error);
            } finally {
                toggleLoader(false);
            }
        };

        fetchData();
    }, []);

    const toggleLoader = (status) => {
        setIsLoading(status);
    };

    const handleMakeAppointmentClick = () => {
        navigate(`?modal=create-appointment&doctorId=${doctor.id}`);
    };

    return (
        <>
            <Toolbar pageTitle="Doctor" />
            {isLoading ? <Loader /> : (
                <div style={{ marginTop: '100px' }}>
                    <ProfileCard>
                        <div className="img-container">
                            <img src={photo} alt="" className="img-area"/>
                        </div>
                        {doctor ? (
                            <>
                                <div className="profile-content">
                                    <p>First name: {doctor.firstName}</p>
                                    <p>Last name: {doctor.lastName}</p>
                                    <p>Middle name: {doctor.middleName}</p>
                                    <p>Cabinet number: {doctor.cabinetNumber}</p>
                                    <p>Date of birth: {doctor.dateOfBirth}</p>
                                    <p>Specialization: {doctor.specialization.specializationName}</p>
                                    <p>Office: {doctor.office.city} {doctor.office.street} {doctor.office.houseNumber} {doctor.office.officeNumber}</p>
                                    <p>Career start year: {doctor.careerStartYear}</p>
                                    <p>Status: {doctor.status}</p>
                                </div>
                                <ButtonBase onClick={handleMakeAppointmentClick}>
                                    Make an appointment with the doctor
                                </ButtonBase>
                            </>
                        ) : (
                            <div className="profile-content">
                                <p>Doctor not found.</p>
                                <ButtonBase onClick={handleMakeAppointmentClick}>
                                    Make an appointment with the doctor
                                </ButtonBase>
                            </div>
                        )}
                    </ProfileCard>
                </div>
            )}
        </>
    );
}

export default Doctor;