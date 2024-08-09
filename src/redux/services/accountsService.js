import axios from "axios";


export const fetchSelectionData = async(query) => {
    const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}${import.meta.env.VITE_REACT_APP_API_ACCOUNTS_ENDPOINT}`;
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


export const fetchLocationData = async() => {
    const apiUrl = `${import.meta.env.VITE_REACT_APP_API_URL}${import.meta.env.VITE_REACT_APP_API_LOCATION_ENDPOINT}`;
    try {
        const response = await axios.get(apiUrl);
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