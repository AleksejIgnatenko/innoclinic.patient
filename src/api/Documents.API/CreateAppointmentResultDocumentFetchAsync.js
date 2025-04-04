import { DocumentsAPI } from "../api";
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";
import Cookies from 'js-cookie';

async function CreateAppointmentResultDocumentFetchAsync(appointmentResult) {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync();
            jwtToken = Cookies.get('accessToken');
        }

        console.log(appointmentResult);

        const response = await fetch(`${DocumentsAPI}/Document`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${jwtToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(appointmentResult)
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'appointment_result_document.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } else {
            console.error('Failed to create appointment result document. Server error:', response.status);
        }
    } catch (error) {
        console.error('Error while generating appointment result document:', error);
    }
}

export default CreateAppointmentResultDocumentFetchAsync;