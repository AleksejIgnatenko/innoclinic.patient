import React, { useState, useEffect, useRef } from 'react';
import './../styles/CreateProfile.css';
import PatientModelRequest from '../models/PatientModelRequest';
import CreatePatientFetchAsync from '../api/Profiles.API/CreatePatientFetchAsync';
import FoundPatientModal from '../components/FoundPatientModal';

const CreateProfile = () => {
    const [currentStage, setCurrentStage] = useState(0);
    const stages = [
        { title: "Stage 1" },
        { title: "Stage 2" },
    ];

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [patient, setPatient] = useState(null);

    const [isFirstNameValid, setIsFirstNameValid] = useState(false);
    const [isLastNameValid, setIsLastNameValid] = useState(false);
    const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);
    const [isDateOfBirthValid, setisDateOfBirthValid] = useState(false);

    const [foundPatients, setFoundPatients] = useState([]);

    const [foundPatientModalShow, setFoundPatientModalShow] = useState(false);

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState('Project 1');
    const [fileType, setFileType] = useState('');

    const imagesTypes = ["jpeg", "png", "svg", "gif"];
    const dropZoonRef = useRef(null);
    const fileInputRef = useRef(null);

    const toggleFoundPatientModal = () => {
        setFoundPatientModalShow(!foundPatientModalShow);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        dropZoonRef.current.classList.add('drop-zoon--over');
    };

    const handleDragLeave = (e) => {
        dropZoonRef.current.classList.remove('drop-zoon--over');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        dropZoonRef.current.classList.remove('drop-zoon--over');
        const droppedFile = e.dataTransfer.files[0];
        if (validateFile(droppedFile)) {
            setFile(droppedFile);
            uploadFile(droppedFile);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (validateFile(selectedFile)) {
            setFile(selectedFile);
            uploadFile(selectedFile);
        }
    };

    const validateFile = (file) => {
        const fileType = file.type;
        const fileSize = file.size;
        let isImage = imagesTypes.filter((type) => fileType.indexOf(`image/${type}`) !== -1);

        if (isImage.length !== 0) {
            if (fileSize <= 2000000) {
                if (isImage[0] === 'jpeg') {
                    setFileType('jpg');
                } else {
                    setFileType(isImage[0]);
                }
                return true;
            } else {
                alert('Please your file should be 2 Megabytes or less');
                return false;
            }
        } else {
            alert('Please make sure to upload an image file type');
            return false;
        }
    };

    const uploadFile = (file) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        setLoading(true);
        setPreview(null);
        setProgress(0);

        fileReader.onload = () => {
            setTimeout(() => {
                setLoading(false);
                setPreview(fileReader.result);
                progressMove();
            }, 600);
        };

        setFileName(file.name);
    };

    const progressMove = () => {
        let counter = 0;
        const intervalId = setInterval(() => {
            if (counter === 100) {
                clearInterval(intervalId);
            } else {
                counter += 10;
                setProgress(counter);
            }
        }, 100);
    };


    const isFormValid = () => {
        return isFirstNameValid && isLastNameValid;
    };

    const updateForm = (progression) => {
        const newStage = currentStage + progression;
        if (newStage >= 0 && newStage < stages.length) {
            setCurrentStage(newStage);
        }
    };

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    };

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    };

    const handleMiddleNameChange = (event) => {
        setMiddleName(event.target.value);
    };

    const handlePhoneNumberChange = (event) => {
        if (event.target.value.startsWith('+') || event.target.value === '') {
            setPhoneNumber(event.target.value);
        }
    };

    const handleDateOfBirthChange = (event) => {
        setDateOfBirth(event.target.value);
    };

    const handleFirstNameBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('createPatientProfile-firstName-label');

        if (input.value === '') {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = "Please, enter the first name";
            setIsFirstNameValid(false);
        } else {
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            label.textContent = "First name";
            setIsFirstNameValid(true);
        }
    };

    const handleLastNameBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('createPatientProfile-lastName-label');

        if (input.value === '') {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = "Please, enter the last name";
            setIsLastNameValid(false);
        } else {
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            label.textContent = "Last name";
            setIsLastNameValid(true);
        }
    };

    const handlePhoneNumberBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('createPatientProfile-phone-number-label');
        const phoneNumberPattern = /^\+375\(\d{2}\)\d{3}-\d{2}-\d{2}$/;

        if (!phoneNumberPattern.test(input.value)) {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = "Incorrect phone number. Format: +375(xx)xxx-xx-xx";
            setIsPhoneNumberValid(false);
        } else {
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            label.textContent = "Phone Number (+375(xx)xxx-xx-xx)";
            setIsPhoneNumberValid(true);
        }
    };

    const handleDateOfBirthBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('createPatientProfile-date-label');

        if (!input.value) {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = 'Please, select the date';
            setisDateOfBirthValid(false);
        } else {
            label.textContent = 'Date';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setisDateOfBirthValid(true);
        }
    };

    const handleFirstNameInput = (event) => {
        const input = event.target;
        const label = document.getElementById('createPatientProfile-firstName-label');

        if (input.value === '') {
            setIsFirstNameValid(false);
        } else {
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            label.textContent = "First name";
            setIsFirstNameValid(true);
        }
    }

    const handleLastNameInput = (event) => {
        const input = event.target;
        const label = document.getElementById('createPatientProfile-lastName-label');

        if (input.value === '') {
            setIsLastNameValid(false);
        } else {
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            label.textContent = "Last name";
            setIsLastNameValid(true);
        }
    }

    const handlePhoneNumberInput = (event) => {
        const input = event.target;
        const phoneNumberPattern = /^\+375\(\d{2}\)\d{3}-\d{2}-\d{2}$/;

        if (!phoneNumberPattern.test(input.value)) {
            setIsPhoneNumberValid(false);
        } else {
            setIsPhoneNumberValid(true);
        }
    }

    const handleDateOfBirthInput = (event) => {
        const input = event.target;
        const label = document.getElementById('createPatientProfile-date-label');

        if (!input.value) {
            setisDateOfBirthValid(false);
        } else {
            label.textContent = 'Date';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setisDateOfBirthValid(true);
        }
    }

    const handlePhoneNumberClick = (event) => {
        event.target.value = '+';
    };

    async function handlePatientAsync() {
        const patientModel = new PatientModelRequest(firstName, lastName, middleName, phoneNumber, true, dateOfBirth);
        const result = await CreatePatientFetchAsync(patientModel);
        
        if (result.status === 409) {
            setFoundPatients(result.foundPatients);
            setPatient(patientModel);
            toggleFoundPatientModal(true);
        }
    }

    return (
        <>
            {foundPatientModalShow && <FoundPatientModal onClose={toggleFoundPatientModal} foundPatients={foundPatients} patient={patient}/>}
            <div className="createPatientProfile-container">
                <section className="createPatientProfile-section">
                    <h2>Main Title 2</h2>
                    <ul className="createPatientProfile-stage-progress">
                        {stages.map((stage, index) => (
                            <li key={index} className={index === currentStage ? "createPatientProfile-active-stage" : ""}>
                                {stage.title}
                            </li>
                        ))}
                    </ul>
                    <div className="createPatientProfile-form-wrapper">
                        <div className="createPatientProfile-form" style={{ transform: `translateX(-${currentStage * 100}%)` }}>
                            <div className='stage'>
                                <div className="upload-area__header">
                                    <h1 className="upload-area__title">Upload your image</h1>
                                    <div className="upload-area__paragraph">
                                        File should be an image
                                        <strong className="upload-area__tooltip">
                                            Like
                                            <span className="upload-area__tooltip-data">{imagesTypes.join(', .')}</span>
                                        </strong>
                                        <div className="drop-zoon__paragraph">or drop your file here or Click to browse</div>
                                    </div>
                                </div>
                                <div
                                    id="uploadArea"
                                    className="upload-area"
                                    style={{ backgroundImage: preview ? `url(${preview})` : 'none' }}
                                    ref={dropZoonRef}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={handleButtonClick}>
                                    <span className="drop-zoon__icon">
                                        <i className="bx bxs-file-image"></i>
                                    </span>
                                    <span id="loadingText" className={`drop-zoon__loading-text ${loading ? 'show' : ''}`}>Please Wait</span>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        id="fileInput"
                                        className="drop-zoon__file-input"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <div id="fileDetails" className="upload-area__file-details file-details">
                                        <h3 className="file-details__title">Uploaded File</h3>
                                        <div id="uploadedFile" className="uploaded-file">
                                            <div className="uploaded-file__icon-container">
                                                <i className="bx bxs-file-blank uploaded-file__icon"></i>
                                                <span className="uploaded-file__icon-text">{fileType}</span>
                                            </div>
                                            <div id="uploadedFileInfo" className="uploaded-file__info">
                                                <span className="uploaded-file__name">{fileName}</span>
                                                <span className="uploaded-file__counter">{progress}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='stage'>
                                <div className="createPatientProfile-inputs">
                                    <div className="createPatientProfile-input-wrapper">
                                        <input
                                            value={firstName}
                                            onChange={handleFirstNameChange}
                                            onBlur={handleFirstNameBlur}
                                            onInput={handleFirstNameInput}
                                            type="text"
                                            name=""
                                            id="createPatientProfile-firstName-input"
                                            class="input default-input-border"
                                            placeholder=" "
                                            required />
                                        <label class="input-label" id="createPatientProfile-firstName-label">First name</label>
                                    </div>
                                    <div className="createPatientProfile-input-wrapper">
                                        <input
                                            value={lastName}
                                            onChange={handleLastNameChange}
                                            onBlur={handleLastNameBlur}
                                            onInput={handleLastNameInput}
                                            type="text"
                                            name=""
                                            id="createPatientProfile-lastName-input"
                                            class="input default-input-border"
                                            placeholder=" "
                                            required />
                                        <label class="input-label" id="createPatientProfile-lastName-label">Last name</label>
                                    </div>
                                    <div className="createPatientProfile-input-wrapper">
                                        <input
                                            value={middleName}
                                            onChange={handleMiddleNameChange}
                                            // onBlur={handleMiddleNamelBlur}
                                            // onInput={handleMiddleNamelInput}
                                            type="text"
                                            name=""
                                            id="createPatientProfile-middleName-input"
                                            class="input default-input-border"
                                            placeholder=" "
                                            required />
                                        <label class="input-label" id="createPatientProfile-middleName-label">Middle name</label>
                                    </div>
                                    <div className="createPatientProfile-input-wrapper">
                                        <input
                                            value={phoneNumber}
                                            onChange={handlePhoneNumberChange}
                                            onBlur={handlePhoneNumberBlur}
                                            onInput={handlePhoneNumberInput}
                                            onClick={handlePhoneNumberClick}
                                            type="tel"
                                            name=""
                                            id="createPatientProfile-phone-number-input"
                                            class="input default-input-border"
                                            placeholder=" "
                                            required />
                                        <label class="input-label" id="createPatientProfile-phone-number-label">Phone Number (+375(xx)xxx-xx-xx)</label>
                                    </div>
                                    <div className="createPatientProfile-input-wrapper">
                                        <input
                                            value={dateOfBirth}
                                            onChange={handleDateOfBirthChange}
                                            onBlur={handleDateOfBirthBlur}
                                            onInput={handleDateOfBirthInput}
                                            className="input default-input-border"
                                            placeholder=" "
                                            type="date"
                                            required
                                        />
                                        <label className="input-label" id="createPatientProfile-date-label">Date of birth</label>
                                    </div>
                                </div>
                            </div>
                            <div className='stage'>
                                <div className="upload-area__header">
                                    <h1 className="upload-area__title">Upload your image</h1>
                                    <div className="upload-area__paragraph">
                                        File should be an image
                                        <strong className="upload-area__tooltip">
                                            Like
                                            <span className="upload-area__tooltip-data">{imagesTypes.join(', .')}</span>
                                        </strong>
                                        <div className="drop-zoon__paragraph">or drop your file here or Click to browse</div>
                                    </div>
                                </div>
                                <div
                                    id="uploadArea"
                                    className="upload-area"
                                    style={{ backgroundImage: preview ? `url(${preview})` : 'none' }}
                                    ref={dropZoonRef}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={handleButtonClick}>
                                    <span className="drop-zoon__icon">
                                        <i className="bx bxs-file-image"></i>
                                    </span>
                                    <span id="loadingText" className={`drop-zoon__loading-text ${loading ? 'show' : ''}`}>Please Wait</span>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        id="fileInput"
                                        className="drop-zoon__file-input"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <div id="fileDetails" className="upload-area__file-details file-details">
                                        <h3 className="file-details__title">Uploaded File</h3>
                                        <div id="uploadedFile" className="uploaded-file">
                                            <div className="uploaded-file__icon-container">
                                                <i className="bx bxs-file-blank uploaded-file__icon"></i>
                                                <span className="uploaded-file__icon-text">{fileType}</span>
                                            </div>
                                            <div id="uploadedFileInfo" className="uploaded-file__info">
                                                <span className="uploaded-file__name">{fileName}</span>
                                                <span className="uploaded-file__counter">{progress}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="navigation-container">
                        <button
                            className={`secondary-btn ${currentStage === 0 ? "hidden" : ""}`}
                            onClick={() => updateForm(-1)}
                        >
                            Prev
                        </button>
                        {currentStage !== 1 ?
                            <button className="primary-btn" onClick={() => updateForm(1)}>Next Step</button> :
                            <button
                                className={`primary-btn ${!isFormValid() ? 'disabled-primary-btn' : ''}`}
                                onClick={handlePatientAsync}
                                disabled={!isFormValid()}>Confirm &#x27F6;
                            </button>
                        }
                    </div>
                </section>
            </div>
        </>
    );
};

export default CreateProfile;