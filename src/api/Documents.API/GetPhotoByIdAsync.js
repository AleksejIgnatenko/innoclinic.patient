import { DocumentsAPI } from "../api";
import RefreshTokenFetchAsync from "../Authorization.API/RefreshTokenFetchAsync";
import Cookies from 'js-cookie';

async function GetPhotoByIdAsync(id) {
    try {
        let jwtToken = Cookies.get('accessToken');
        if (!jwtToken) {
            await RefreshTokenFetchAsync();
            jwtToken = Cookies.get('accessToken');
        }

        const response = await fetch(`${DocumentsAPI}/Photo/${id}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            }
        });

        if (response.ok) {
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob); 
            return imageUrl;
        } else if (response.status === 404) {
            console.log('Photo not found');
            return null;
        } else {
            const data = await response.json();
            console.log(data);
            return null;
        }
    } catch (error) {
        console.error('Error in getting photo:', error);
        return null;
    }
}

export default GetPhotoByIdAsync;