class AppointmentModelRequest {
    constructor(patientId, doctorId, medicalServiceId, date, time, isApproved) {
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.medicalServiceId = medicalServiceId;
        this.date = date;
        this.time = time;
        this.isApproved = isApproved;
    }
}

export default AppointmentModelRequest;