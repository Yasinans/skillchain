import {ref} from 'vue';
import axios from 'axios';
import { API_BASE_URL } from '../config';
export function useVerify(address: string, message: string, signature: string) {
    const token = ref(null);

    const verifyMessage = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/verify-wallet`, {
                address,
                message,
                signature,
            });
            token.value = response.data.firebaseToken;
            return token.value
        } catch (error) {
            console.error(error);
            return null
        }
    };

    return {
        token, verifyMessage
    };
}