import Cookies from 'js-cookie';
import { AuthorizationAPI } from './api';
import { comparePassword } from '../utils/PasswordUtils';

async function SignInFetchAsync(signInModel) {
    try {
        const response = await fetch(`${AuthorizationAPI}/Account/sign-in?email=${signInModel.email}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        });

        const data = await response.json();

        if (response.ok) {
            const { hashPassword, accessToken, refreshToken } = data;
            const passwordsMatch = comparePassword(signInModel.password, hashPassword);
            if (passwordsMatch) {
                const accessTokenExpiry = 15 / (24 * 60);
                const refreshTokenExpiry = 180;

                Cookies.set('accessToken', accessToken, { sameSite: 'strict', expires: accessTokenExpiry });
                Cookies.set('refreshToken', refreshToken, { secure: true, sameSite: 'strict', expires: refreshTokenExpiry });
            } else {
                alert('You entered the wrong password.');
            }
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred during registration');
    }
}

export default SignInFetchAsync;