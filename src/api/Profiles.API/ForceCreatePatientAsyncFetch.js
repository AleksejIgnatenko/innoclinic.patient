import { getCookie } from "../../services/getCookie";
import { ProfilesAPI } from "../api";
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";

async function ForceCreatePatientAsyncFetch(patientModel) {
    try {
        let jwtToken = getCookie('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync();
            jwtToken = getCookie('accessToken');
        }

        const response = await fetch(`${ProfilesAPI}/Patient/force-create-patient`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(patientModel)
        });

        if (response.ok) {
            console.log("ok");
        }
    } catch (error) {
        console.error('Error in creating patient:', error);
        alert('An error occurred while creating the patient');
        return { status: 500, error: 'Internal Server Error' };
    }
}

export default ForceCreatePatientAsyncFetch;