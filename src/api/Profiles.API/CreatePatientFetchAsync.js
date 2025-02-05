import { getCookie } from "../../services/getCookie";
import { ProfilesAPI } from "../api";
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";

async function CreatePatientFetchAsync(patientModel) {
    try {
        let jwtToken = getCookie('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync(); 
            jwtToken = getCookie('accessToken');
        }

        const response = await fetch(`${ProfilesAPI}/Patient`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(patientModel)
        });

        if (response.ok) {
            return { status: 200 };
        } else if (response.status === 409) {
            const data = await response.json();
            return { status: 409, foundPatients: data.foundPatients };
        } else {
            const errorData = await response.json();
            return { status: response.status, error: errorData }; 
        }
    } catch (error) {
        console.error('Error in creating patient:', error);
        alert('An error occurred while creating the patient');
        return { status: 500, error: 'Internal Server Error' };
    }
}

export default CreatePatientFetchAsync;