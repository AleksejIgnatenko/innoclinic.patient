import { ServicesAPI } from "../api";

async function GetAllServicesByCategoryFetchAsync() {
    try {
        const response = await fetch(`${ServicesAPI}/MedicalService/all-services-by-category`, {
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
        alert('An error occurred while receiving all the doctors at work');
    }
}

export default GetAllServicesByCategoryFetchAsync;