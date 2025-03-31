import { useState } from "react";
import ProfileCard from "../components/organisms/ProfileCard";
import { InputWrapper } from "../components/molecules/InputWrapper";
import usePatientForm from "../hooks/usePatientForm";
import { ButtonBase } from "../components/atoms/ButtonBase";
import ImageUploader from "../components/organisms/ImageUploader";
import CreatePatientFetchAsync from "../api/Profiles.API/CreatePatientFetchAsync";
import CreatePhotoFetchAsync from "../api/Documents.API/CreatePhotoFetchAsync";
import FormModal from "../components/organisms/FormModal";
import '../styles/pages/CreatePatientProfile.css';

import ForceCreatePatientAsyncFetch from "../api/Profiles.API/ForceCreatePatientAsyncFetch";
import AccountConnectionWithThePatientFetchAsync from "../api/Profiles.API/AccountConnectionWithThePatientFetchAsync";


function CreatePatientProfile() {

    const [photo, setPhoto] = useState(null);
    const [foundPatientModalShow, setFoundPatientModalShow] = useState(false);
    const [foundPatients, setFoundPatients] = useState([]);

    const { formData, setFormData, errors, handleChange, handleBlur, handlePhoneNumberKeyDown, resetForm, isFormValid } = usePatientForm({
        firstName: '',
        lastName: '',
        middleName: '',
        phoneNumber: '+',
        dateOfBirth: '',
    });

    async function handleAdd() {
        if (photo) {
            formData.photoId = await CreatePhotoFetchAsync(photo);
        }

        formData.isLinkedToAccount = true;

        const result = await CreatePatientFetchAsync(formData);

        if (result.status === 409) {
            setFoundPatients(result.foundPatients);
            console.log(result.foundPatients)
            setFoundPatientModalShow(true);
        }
    }

    async function handleCancelClick(event, id) {
        event.preventDefault();

        const updatedList = foundPatients.filter(patient => patient.Id !== id);

        if (updatedList.length === 0) {
            if (photo) {
                formData.photoId = await CreatePhotoFetchAsync(photo);
            }
            await ForceCreatePatientAsyncFetch(formData);
        }

        setFoundPatients(updatedList);
    }

    async function handleConfirmClick(event, id) {
        event.preventDefault();

        if (photo) {
            formData.photoId = await CreatePhotoFetchAsync(photo);
        }

        await AccountConnectionWithThePatientFetchAsync(id);
    };

    return (
        <>
            {foundPatientModalShow &&
                <FormModal title={"Found profile"}>
                    {foundPatients.map(patient => (
                        <div key={patient.Id} className="patient-info">
                            <p>Name: {patient.FirstName} {patient.LastName} {patient.MiddleName}</p>
                            <p>Date of Birth: {patient.DateOfBirth}</p>
                            <div className="form-actions">
                                <ButtonBase onClick={(event) => handleConfirmClick(event, patient.Id)}>
                                    Yes, it’s me
                                </ButtonBase>
                                <ButtonBase variant="secondary" onClick={(event) => handleCancelClick(event, patient.Id)}>
                                    No, it’s not me
                                </ButtonBase>
                            </div>
                        </div>
                    ))}
                </FormModal>
            }
            <ProfileCard >
                <div class="img-container">
                    <ImageUploader
                        photo={photo}
                        setPhoto={setPhoto}
                    />
                </div>
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
                        onBlur={handleBlur('middleName')}
                        onChange={handleChange('middleName')}
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
                <ButtonBase onClick={handleAdd} disabled={!isFormValid}>
                    Confirm
                </ButtonBase>
            </ProfileCard>
        </>
    );
}

export default CreatePatientProfile;