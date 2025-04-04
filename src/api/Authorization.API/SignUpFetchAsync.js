import Cookies from 'js-cookie';
import { AuthorizationAPI } from '../api';

async function SignUpFetchAsync(newAccount) {
    try {
        const response = await fetch(`${AuthorizationAPI}/Account/sign-up`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(newAccount)
        });

        if (response.ok) {
            alert("To confirm your email, check your email address and follow the link provided in the email.");
            Cookies.set('isLoggedIn', true, {
                sameSite: 'strict',
                path: '/',
                expires: 7,
                domain: 'localhost'
            });
            window.location.href = "/";
        } else {
            const data = await response.json();
            console.error("Sign up failed:", data);
        }
    } catch (error) {
        console.error('Error during registration:', error);
        //alert('An error occurred during sign up');
    }
}

export default SignUpFetchAsync;