import { OfficesAPI } from "../api";

async function GetAllActiveOfficesFetchAsync() {
    try {
        const response = await fetch(`${OfficesAPI}/Office/all-active-offices`, {
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
        console.error('Error in getting all doctors:', error);
        alert('An error occurred while receiving all the doctors');
    }
}

export default GetAllActiveOfficesFetchAsync;