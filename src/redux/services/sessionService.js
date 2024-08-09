import axios from "axios";


export const fetchUserData = async(query) => {
    const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}${import.meta.env.VITE_REACT_APP_API_LOGIN_ENDPOINT}`;
    const data = query;
        
    try {
        const response = await axios.post(apiUrl, data);
        return response.data;
    } catch (error) {
        if (error.response) {
            throw error.response.data;
        } else if (error.request) {
            throw "No response received";
        } else {
            throw error.message;
        }
    }
}


