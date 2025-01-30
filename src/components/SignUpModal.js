import React, { useState, useEffect, useRef } from 'react';
import EmailExistsAsync from '../api/EmailExistsAsync';
import './../styles/SignUpModal.css';
import SignUpRequestModel from '../models/SignUpRequestModel';
import SignUpFetchAsync from '../api/SignUpFetchAsync';

const SignUpModal = ({ onClose }) => {
    const [currentStage, setCurrentStage] = useState(0);
    const stages = [
        { title: "Stage 1" },
        { title: "Stage 2" },
        { title: "Stage 3" }
    ];
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isRepeatPasswordValid, setIsRepeatPasswordValid] = useState(false);

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState('Project 1');
    const [fileType, setFileType] = useState('');

    const imagesTypes = ["jpeg", "png", "svg", "gif"];
    const dropZoonRef = useRef(null);
    const fileInputRef = useRef(null);

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

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleRepeatPasswordChange = (event) => {
        setRepeatPassword(event.target.value);
    };

    async function handleEmailBlur(event) {
        const input = event.target;
        const label = document.getElementById('sign-up-email-label');
        if (input.value === '') {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = "Please, enter the email";
            setIsEmailValid(false);
        } else if (!input.value.includes('@')) {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = "You've entered an invalid email";
            setIsEmailValid(false);
        } else {
            label.textContent = 'Email';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            const isEmailAvailability = await EmailExistsAsync(email);
            if (!isEmailAvailability) {
                setIsEmailValid(true);
            } else {
                input.classList.add('error-input-border');
                label.classList.add('error-label');
                label.textContent = "User with this email already exists";
                setIsEmailValid(false);
            }
        }
    };

    const handlePhoneNumberBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('sign-up-phone-number-label');
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

    const handlePasswordlBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('sign-up-password-label');
        if (input.value === '') {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = "Please, enter the password";
            setIsPasswordValid(false);
        } else if ((5 > password.length) || (password.length > 16)) {
            input.classList.add('error-input-border');
            label.classList.add('invalid-feedback');
            label.textContent = "The number of characters in the password must be from 6 to 15";
            setIsPasswordValid(false);
        }
        else {
            label.textContent = 'Password';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setIsPasswordValid(true);
        }
    };

    const handleRepeatPasswordlBlur = (event) => {
        const input = event.target;
        const label = document.getElementById('sign-up-repeat-password-label');
        if (input.value === '') {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = "Please, reenter the password";
            setIsRepeatPasswordValid(false);
        } else if (password !== repeatPassword) {
            input.classList.add('error-input-border');
            label.classList.add('error-label');
            label.textContent = "The passwords you’ve entered don’t coincide";
            setIsRepeatPasswordValid(false);
        }
        else {
            label.textContent = 'Repeat Password';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setIsRepeatPasswordValid(true);
        }
    };

    const handleEmailInput = (event) => {
        const input = event.target;
        setEmail(input.value);
        if (input.value === '') {
            setIsEmailValid(false);
        } else if (!input.value.includes('@')) {
            setIsEmailValid(false);
        } else {
            const label = document.getElementById('sign-up-email-label');
            label.textContent = 'Email';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setIsEmailValid(true);
        }
    };

    const handlePhoneNumberInput = (event) => {
        const input = event.target;
        const phoneNumberPattern = /^\+375\(\d{2}\)\d{3}-\d{2}-\d{2}$/;

        if (!phoneNumberPattern.test(input.value)) {
            setIsPhoneNumberValid(false);
        } else {
            setIsPhoneNumberValid(true);
        }
    };

    const handlePasswordlInput = (event) => {
        const input = event.target;
        setPassword(input.value);
        if (input.value === '') {
            setIsPasswordValid(false);
        } else if ((5 > password.length) || (password.length > 16)) {
            setIsPasswordValid(false);
        }
        else {
            const label = document.getElementById('sign-up-password-label');
            label.textContent = 'Password';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setIsPasswordValid(true);
        }
    };

    const handleRepeatPasswordInput = (event) => {
        const input = event.target;
        const newValue = input.value;

        setRepeatPassword(newValue);

        if (newValue === '') {
            setIsRepeatPasswordValid(false);
        } else if (newValue !== password) {
            setIsRepeatPasswordValid(false);
        } else {
            const label = document.getElementById('sign-up-repeat-password-label');
            label.textContent = 'Repeat Password';
            input.classList.remove('error-input-border');
            label.classList.remove('error-label');
            setIsRepeatPasswordValid(true);
        }
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
        return isEmailValid && isPasswordValid && isRepeatPasswordValid && isPhoneNumberValid;
    };

    async function toggleCreateAccountAsync() {
        const newAccount = new SignUpRequestModel(email, password, phoneNumber);
        if ((5 < password.length) && (password.length < 16)) {
            await SignUpFetchAsync(newAccount);
        } else {
            const input = document.getElementById('sign-up-password-input');
            const label = document.getElementById('sign-up-password-label');
            if (input && label) {
                input.classList.add('error-input-border');
                label.classList.add('invalid-feedback');
                label.textContent = "Количество символов в пароле должно быть от 6 до 15";
            }
        }
    }

    const updateForm = (progression) => {
        const newStage = currentStage + progression;
        if (newStage >= 0 && newStage < stages.length) {
            setCurrentStage(newStage);
        }
    };

    return (
        <div className="modal-overlay">
            <section className="sign-up-section">
                <h2>Main Title 2</h2>
                <button className="close-button" onClick={onClose}>X</button>
                <ul className="sign-up-stage-progress">
                    {stages.map((stage, index) => (
                        <li key={index} className={index === currentStage ? "sign-up-active-stage" : ""}>
                            {stage.title}
                        </li>
                    ))}
                </ul>
                <div className="sign-up-form-wrapper">
                    <div className="sign-up-form" style={{ transform: `translateX(-${currentStage * 100}%)` }}>
                        <div className='stage'>
                            <div className="sign-up-inputs">
                                <div className="sign-up-input-wrapper">
                                    <input
                                        value={email}
                                        onChange={handleEmailChange}
                                        onBlur={handleEmailBlur}
                                        onInput={handleEmailInput}
                                        type="email"
                                        name=""
                                        id="sign-up-email-input"
                                        class="input default-input-border"
                                        placeholder=" "
                                        required />
                                    <label class="input-label" id="sign-up-email-label">Email</label>
                                </div>
                                <div className="sign-up-input-wrapper">
                                    <input
                                        value={phoneNumber}
                                        onChange={handlePhoneNumberChange}
                                        onBlur={handlePhoneNumberBlur}
                                        onInput={handlePhoneNumberInput}
                                        type="tel"
                                        name=""
                                        id="sign-up-phone-number-input"
                                        class="input default-input-border"
                                        placeholder=" "
                                        required />
                                    <label class="input-label" id="sign-up-phone-number-label">Phone Number (+375(xx)xxx-xx-xx)</label>
                                </div>
                                <div className="sign-up-input-wrapper">
                                    <input
                                        value={password}
                                        onChange={handlePasswordChange}
                                        onBlur={handlePasswordlBlur}
                                        onInput={handlePasswordlInput}
                                        type="password"
                                        name=""
                                        id="sign-up-password-input"
                                        class="input default-input-border"
                                        placeholder=" "
                                        required />
                                    <label class="input-label" id="sign-up-password-label">Password</label>
                                </div>
                                <div className="sign-up-input-wrapper">
                                    <input
                                        value={repeatPassword}
                                        onChange={handleRepeatPasswordChange}
                                        onBlur={handleRepeatPasswordlBlur}
                                        onInput={handleRepeatPasswordInput}
                                        type="password"
                                        name=""
                                        id="sign-up-repeat-password-input"
                                        class="input default-input-border"
                                        placeholder=" "
                                        required />
                                    <label class="input-label" id="sign-up-repeat-password-label">Repeat Password</label>
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
                        <div className='stage'>
                            <h3>Stage 3</h3>
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
                    {currentStage !== 2 ?
                        <button className="primary-btn" onClick={() => updateForm(1)}>Next Step</button> :
                        <button 
                            className={`primary-btn ${!isFormValid() ? 'disabled-primary-btn' : ''}`}
                            onClick={onClose} 
                            disabled={!isFormValid()}>Save &#x27F6;
                        </button>
                    }
                    {/* <button onClick={toggleCreateAccountAsync}>Register</button> */}
                </div>
            </section>
        </div>
    );
};

export default SignUpModal;