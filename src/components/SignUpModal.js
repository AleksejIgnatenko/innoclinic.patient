import EmailExistsAsync from '../api/Authorization.API/EmailExistsAsync';
import SignUpRequestModel from '../models/SignUpRequestModel';
import './../styles/SignUpModal.css';
import React, { useState, useEffect } from 'react';
import SignUpFetchAsync from '../api/Authorization.API/SignUpFetchAsync';

const SignUpModal = ({ onClose, onOpenSignIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');

    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isRepeatPasswordValid, setIsRepeatPasswordValid] = useState(false);

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
            label.classList.add('error-label');
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

    const isFormValid = () => {
        return isEmailValid && isPasswordValid && isRepeatPasswordValid;
    };

    async function handleSignUpAsync() {
        const signUpModel = new SignUpRequestModel(email, password);
        if ((5 < password.length) && (password.length < 16)) {
            await SignUpFetchAsync(signUpModel)
            onClose();
        } else {
            const input = document.getElementById('sign-up-password-input');
            const label = document.getElementById('sign-up-password-label');
            if (input && label) {
                input.classList.add('error-input-border');
                label.classList.add('error-label');
                label.textContent = "Количество символов в пароле должно быть от 6 до 15";
            }
        }
    }

    return (
        <div class="modal-overlay">
            <div class="sign-up-container">
                <div class="sign-up-top-content">
                    <button className="close-button" onClick={onClose}>X</button>
                    <h2>Sign up</h2>
                </div>
                <div class="sign-up-inputs">
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
                <div class="btn-group">
                    <a
                        class="signin-btn"
                        onClick={onOpenSignIn}
                    >
                        Sign in
                    </a>
                    <button
                        className={`sign-up-btn ${!isFormValid() ? 'disabled-sign-up-btn' : ''}`}
                        onClick={handleSignUpAsync}
                        disabled={!isFormValid()}
                    >
                        Sign up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignUpModal;