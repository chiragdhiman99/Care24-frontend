import axios from "axios";

const API_URL = " https://care24-backend.onrender.com/api/vitals";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});


export const createVitals = async(vitalsData) => {
    const { data } = await api.post("/", vitalsData);
    return data;
}

export const getVitals = async(userId) => {
    const { data } = await api.get(`/${userId}`);
    return data;
}