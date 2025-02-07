class AppointmentModelRequest {
    constructor(doctorId, medicalServiceId, date, time, isApproved) {
        this.doctorId = doctorId;
        this.medicalServiceId = medicalServiceId;
        this.date = date;
        this.time = time;
        this.isApproved = isApproved;
    }
}

export default AppointmentModelRequest;