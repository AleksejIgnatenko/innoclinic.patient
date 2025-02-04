import { hashPassword } from '../utils/PasswordUtils';

class SignUpRequestModel {
    constructor(email, password) {
        this.email = email;
        this.password = hashPassword(password);
    }
}

export default SignUpRequestModel;