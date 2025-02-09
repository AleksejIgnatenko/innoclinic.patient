import { AppointmentAPI } from "../api";
import Cookies from 'js-cookie';
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";

async function CreateAppointmentFetchAsync(appointmentModelRequest) {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync(); 
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${AppointmentAPI}/Appointment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${jwtToken}`,
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