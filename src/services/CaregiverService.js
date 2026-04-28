import axios from "axios";
const API_URL = "http://localhost:5001/api/caregivers";


const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})


export const getCaregivers = async () => {
    const { data } = await api.get("/");
    return data;
}


export const getCaregiverbyId = async (id) => {
    const { data } = await api.get(`/${id}`);
    return data;
}

export const updateCaregiverStatus = async (id, updates) => {
    const { data } = await api.put(`/${id}`, updates);
    return data;
}

export const updateCaregiverProfile = async (id, profileData) => {
    const { data } = await api.patch(`/${id}/profile`, profileData);
    return data;
}