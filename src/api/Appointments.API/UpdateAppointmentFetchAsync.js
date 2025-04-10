import { AppointmentAPI } from "../api";
import Cookies from 'js-cookie';
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";

async function UpdateAppointmentFetchAsync(appointmentModelRequest) {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync();
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${AppointmentAPI}/Appointment/${appointmentModelRequest.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(appointmentModelRequest)
        });

        if (!response.ok) {
            const data = await response.json();
            console.error('Error updating appointment:', data);
        }
    } catch (error) {
        console.error('Error in updating appointment:', error);
        //alert('An error occurred while updating the appointment');
    }
}

export default UpdateAppointmentFetchAsync;