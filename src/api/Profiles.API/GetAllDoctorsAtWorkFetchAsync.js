import { ProfilesAPI } from "../api";

async function GetAllDoctorsAtWorkFetchAsync() {
    try {
        const response = await fetch(`${ProfilesAPI}/Doctors/at-work`, {
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
        return [];
    }
}

export default GetAllDoctorsAtWorkFetchAsync;