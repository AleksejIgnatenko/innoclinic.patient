import { ServicesAPI } from "../api";

async function GetAllActiveMedicalServicesFetchAsync() {
    try {
        const response = await fetch(`${ServicesAPI}/MedicalService/all-active-medical-services`, {
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
        console.error('Error in getting all medical service:', error);
        alert('An error occurred while receiving all medical');
    }
}

export default GetAllActiveMedicalServicesFetchAsync;