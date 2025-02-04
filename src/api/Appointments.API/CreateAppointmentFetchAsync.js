import { AppointmentAPI } from "../api";

async function CreateAppointmentFetchAsync(appointmentModelRequest) {
    try {
        const response = await fetch(`${AppointmentAPI}/Appointment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(appointmentModelRequest)
        });

        if (response.ok) {
           console.log("ok");
        } else {
           throw new Error('Failed to create appointment');
        }
    } catch (error) {
        console.error('Error in creating appointment:', error);
        alert('An error occurred while creating the appointment');
    }
}

export default CreateAppointmentFetchAsync;