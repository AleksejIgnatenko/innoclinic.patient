class PatientModelRequest {
    constructor(firstName, lastName, middleName, phoneNumber, isLinkedToAccount, dateOfBirth) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.middleName = middleName;
        this.phoneNumber = phoneNumber;
        this.isLinkedToAccount = isLinkedToAccount;
        this.dateOfBirth = dateOfBirth; 
    }
}

export default PatientModelRequest;