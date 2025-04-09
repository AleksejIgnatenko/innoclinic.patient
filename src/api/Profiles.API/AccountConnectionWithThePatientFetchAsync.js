import { ProfilesAPI } from "../api";
import Cookies from 'js-cookie';
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";

async function AccountConnectionWithThePatientFetchAsync(id) {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync(); 
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${ProfilesAPI}/Patient/account-connection-with-the-patient/${id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`,
            },
        });

        if (response.ok) {
            console.log("Successfully connected account with patient.");
        } else {
            const errorData = await response.json();
            console.error("Error connecting account with patient:", errorData);
        }
    } catch (error) {
        console.error('Error in account connection with the patient:', error);
        //alert('An error occurred while connecting the account with the patient');
        return { status: 500, error: 'Internal Server Error' };
    }
}

export default AccountConnectionWithThePatientFetchAsync;