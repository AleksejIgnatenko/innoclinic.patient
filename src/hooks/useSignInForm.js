import { useState } from 'react';
import FieldNames from '../enums/FieldNames';

const useSignInForm = (initialSignInValues) => {
  const [signInFormData, setSignInFormData] = useState(initialSignInValues);
  const [signInErrors, setSignInErrors] = useState({
    email: false,
    password: false
  });

  const updateSignInInputState = (field, inputElement, labelElement) => {
    if (!inputElement.value.trim()) {
      if (inputElement && labelElement) {
        inputElement.classList.add('error-input');
        labelElement.classList.add('error-label');

        labelElement.textContent = `Please, enter your ${field}`;
      }
      setSignInErrors(prev => ({
        ...prev,
        [field]: false
      }));
    } else if (field === 'password' && (inputElement.value.length < 6 || inputElement.value.length > 15)) {
      inputElement.classList.add('error-input');
      labelElement.classList.add('error-label');

      labelElement.textContent = "The password must be between 6 and 15 characters";

      setSignInErrors(prev => ({
        ...prev,
        [field]: false
      }));
    } else if (field === 'email' && !inputElement.value.includes('@')) {
      inputElement.classList.add('error-input');
      labelElement.classList.add('error-label');

      labelElement.textContent = "You've entered an invalid email address";

      setSignInErrors(prev => ({
        ...prev,
        [field]: false
      }));
    } else {
      if (inputElement && labelElement) {
        inputElement.classList.remove('error-input');
        labelElement.classList.remove('error-label');

        labelElement.textContent = `${FieldNames[field]}`;
      }
      setSignInErrors(prev => ({
        ...prev,
        [field]: true
      }));
    }
  };

  const handleSignInChange = (field) => (event) => {
    const inputElement = event.target;
    const labelElement = document.querySelector(`label[for="${field}"]`);

    setSignInFormData(prev => ({
      ...prev,
      [field]: inputElement.value
    }));

    updateSignInInputState(field, inputElement, labelElement);
  };

  const handleSignInBlur = (field) => (event) => {
    const inputElement = event.target;
    const labelElement = document.querySelector(`label[for="${field}"]`);

    updateSignInInputState(field, inputElement, labelElement);
  };

  return {
    signInFormData,
    signInErrors,
    handleSignInChange,
    handleSignInBlur,
    isSignInFormValid: signInErrors.email && signInErrors.password
  };
};

export default useSignInForm;