import { ProfilesAPI } from "./api";

async function GetAllDoctorsFetchAsync() {
    try {
        const response = await fetch(`${ProfilesAPI}/Doctors`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const data = await response.json();
        console.log(data);
        if (response.ok) {
           
        }
    } catch (error) {
        console.error('Error in getting all doctors:', error);
        alert('An error occurred while receiving all the doctors');
    }
}

export default GetAllDoctorsFetchAsync;