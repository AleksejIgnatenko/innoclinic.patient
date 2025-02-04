import { ServicesAPI } from "../api";

async function GetAllActiveSpecializationsFetchAsync() {
    try {
        const response = await fetch(`${ServicesAPI}/Specialization/all-active-specializations`, {
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
        console.error('Error in getting all specialization:', error);
        alert('An error occurred while receiving all specialization');
    }
}

export default GetAllActiveSpecializationsFetchAsync;