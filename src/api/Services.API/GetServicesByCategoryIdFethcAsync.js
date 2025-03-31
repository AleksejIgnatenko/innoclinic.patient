import { ServicesAPI } from "../api";
import Cookies from 'js-cookie';
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";


async function GetServicesBySpecializationIdFethcAsync(specializationId) {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync(); 
            jwtToken = Cookies.get('accessToken');
        }
        
        const response = await fetch(`${ServicesAPI}/MedicalService/services-by-specialization-id/${specializationId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const data = await response.json();

        if (response.ok) {
           return data;
        }
    } catch (error) {
        console.error('Error in getting all doctors at work:', error);
        //alert('An error occurred while receiving all the doctors at work');

        return [];
    }
}

export default GetServicesBySpecializationIdFethcAsync;