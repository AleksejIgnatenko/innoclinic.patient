import Cookies from 'js-cookie';
import { AuthorizationAPI } from './api';

async function SignUpFetchAsync(newAccount) {
    try {
        const response = await fetch(`${AuthorizationAPI}/Account/sign-up`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newAccount)
        });

        const data = await response.json();
        console.log(data);  

        if (response.ok) {
            const { accessToken, refreshToken, message } = data;
            alert(message);
        
            const accessTokenExpiry = 15 / (24 * 60);
            const refreshTokenExpiry = 180;

            Cookies.set('accessToken', accessToken, { sameSite: 'strict', expires: accessTokenExpiry });
            Cookies.set('refreshToken', refreshToken, { secure: true, sameSite: 'strict', expires: refreshTokenExpiry });
        } else if (response.status === 400) {
            const errors = data.error;
            for (const [key, value] of Object.entries(errors)) {
                alert(`${key}: ${value}`);
            }
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred during registration');
    }
}

export default SignUpFetchAsync;