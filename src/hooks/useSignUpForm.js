import { useState } from 'react';
import FieldNames from '../enums/FieldNames';

const useSignUpForm = (initialSignUpValues) => {
  const [signUpFormData, setSignUpFormData] = useState(initialSignUpValues);
  const [signUpErrors, setSignUpErrors] = useState({
    email: false,
    password: false,
    repeatPassword: false
  });

  const updateSignUpInputState = (field, inputElement, labelElement) => {
    if (!inputElement.value.trim()) {
      if (inputElement && labelElement) {
        inputElement.classList.add('error-input');
        labelElement.classList.add('error-label');

        labelElement.textContent = `Please, enter your ${FieldNames[field]}`;
      }
      setSignUpErrors(prev => ({
        ...prev,
        [field]: false
      }));
    } else if (field === 'email' && !inputElement.value.includes('@')) {
      inputElement.classList.add('error-input');
      labelElement.classList.add('error-label');

      labelElement.textContent = "You've entered an invalid email address";

      setSignUpErrors(prev => ({
        ...prev,
        [field]: false
      }));
    } else if (field === 'password' && (inputElement.value.length < 6 || inputElement.value.length > 15)) {
      inputElement.classList.add('error-input');
      labelElement.classList.add('error-label');

      labelElement.textContent = "The password must be between 6 and 15 characters";

      setSignUpErrors(prev => ({
        ...prev,
        [field]: false
      }));
    } else if (field === 'repeatPassword' && inputElement.value !== signUpFormData.password) {
      inputElement.classList.add('error-input');
      labelElement.classList.add('error-label');
      labelElement.textContent = "Passwords do not match";

      setSignUpErrors(prev => ({
        ...prev,
        [field]: false
      }));
    } else {
      if (inputElement && labelElement) {
        inputElement.classList.remove('error-input');
        labelElement.classList.remove('error-label');

        labelElement.textContent = `${FieldNames[field]}`;
      }
      setSignUpErrors(prev => ({
        ...prev,
        [field]: true
      }));
    }
  };

  const handleSignUpChange = (field) => (event) => {
    const inputElement = event.target;
    const labelElement = document.querySelector(`label[for="${field}"]`);

    setSignUpFormData(prev => ({
      ...prev,
      [field]: inputElement.value
    }));

    updateSignUpInputState(field, inputElement, labelElement);
  };

  const handleSignUpBlur = (field) => (event) => {
    const inputElement = event.target;
    const labelElement = document.querySelector(`label[for="${field}"]`);

    updateSignUpInputState(field, inputElement, labelElement);
  };

  return {
    signUpFormData,
    signUpErrors,
    handleSignUpChange,
    handleSignUpBlur,
    isSignUpFormValid: signUpErrors.email && signUpErrors.password && signUpErrors.repeatPassword
  };
};

export default useSignUpForm;