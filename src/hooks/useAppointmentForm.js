import { useState } from 'react';
import FieldNames from '../enums/FieldNames';

const useAppointmentForm = (initialAppointmentValues) => {
  const [appointmentFormData, setAppointmentFormData] = useState(initialAppointmentValues);
  const [appointmentErrors, setAppointmentErrors] = useState({
    doctorId: false,
    medicalServiceId: false,
    date: false,
    time: false,
  });

  const updateAppointmentInputState = (field, inputElement, labelElement) => {
    if (!inputElement.value.trim()) {
      if (inputElement && labelElement) {
        inputElement.classList.add('error-input');
        labelElement.classList.add('error-label');

        labelElement.textContent = `Please, enter ${FieldNames[field]}`;
      }
      setAppointmentErrors(prev => ({
        ...prev,
        [field]: false
      }));
    } else {
      if (inputElement && labelElement) {
        inputElement.classList.remove('error-input');
        labelElement.classList.remove('error-label');

        labelElement.textContent = `${FieldNames[field]}`;
      }
      setAppointmentErrors(prev => ({
        ...prev,
        [field]: true
      }));
    }
  };

  const handleAppointmentChange = (field) => (event) => {
    const inputElement = event.target;
    const labelElement = document.querySelector(`label[for="${field}"]`);

    setAppointmentFormData(prev => ({
      ...prev,
      [field]: inputElement.value
    }));

    updateAppointmentInputState(field, inputElement, labelElement);
  };

  const handleAppointmentBlur = (field) => (event) => {
    const inputElement = event.target;
    const labelElement = document.querySelector(`label[for="${field}"]`);

    updateAppointmentInputState(field, inputElement, labelElement);
  };

  const resetAppointmentForm = () => {
    setAppointmentFormData(initialAppointmentValues);
    setAppointmentErrors({});
};

  return {
    appointmentFormData,
    setAppointmentFormData,
    appointmentErrors,
    setAppointmentErrors,
    handleAppointmentChange,
    handleAppointmentBlur,
    resetAppointmentForm,
    isAppointmentFormValid: appointmentErrors.doctorId && appointmentErrors.medicalServiceId && appointmentErrors.date && appointmentErrors.time
  };
};

export default useAppointmentForm;