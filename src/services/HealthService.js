import axios from "axios";
const API_URL = "https://care24-backend.onrender.com/api/health-records";


const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})


export const healthrecords = async (recordData) => {
    const { data } = await api.post("/",recordData);
    return data;
}

export const gethealthrecords = async (userId) => {
    const { data } = await api.get(`/${userId}`);
    return data;
}