import { AppointmentAPI } from "../api";

async function GetAllAvailableTimeSlotsFetchAsync(date, timeSlotSize) {
    try {
        const response = await fetch(`${AppointmentAPI}/Appointment/all-available-time-slots?date=${date}&timeSlotSize=${timeSlotSize}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
           return await response.json();
        } else {
           throw new Error('Failed to create appointment');
        }
    } catch (error) {
        console.error('Error in creating appointment:', error);
        //alert('An error occurred while creating the appointment');
    }
}

export default GetAllAvailableTimeSlotsFetchAsync;