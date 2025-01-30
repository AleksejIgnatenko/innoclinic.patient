import { hashPassword } from '../utils/PasswordUtils';

class SignUpRequestModel {
    constructor(email, password, phoneNumber) {
        this.email = email;
        this.password = hashPassword(password);
        this.phoneNumber = phoneNumber;
    }
}

export default SignUpRequestModel;