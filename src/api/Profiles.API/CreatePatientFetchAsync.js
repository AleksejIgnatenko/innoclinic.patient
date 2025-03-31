import { ProfilesAPI } from "../api";
import Cookies from 'js-cookie';
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";

async function CreatePatientFetchAsync(patient) {
    try {
        console.log(patient);
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync(); 
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${ProfilesAPI}/Patient`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(patient)
        });

        if (response.ok) {
            return { status: 200 };
        } else if (response.status === 409) {
            const data = await response.json();
            return { status: 409, foundPatients: data.foundPatients };
        } else {
            const errorData = await response.json();
            console.log(errorData);
            return { status: response.status, error: errorData }; 
        }
    } catch (error) {
        console.error('Error in creating patient:', error);
        //alert('An error occurred while creating the patient');
        return { status: 500, error: 'Internal Server Error' };
    }
}

export default CreatePatientFetchAsync;