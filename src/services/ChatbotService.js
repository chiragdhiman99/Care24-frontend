import axios from "axios";
const API_URL = "http://localhost:5001/api/chatbot";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});


export const getOrCreateChatbot = async (patientId) => {
    const { data } = await api.get(`/${patientId}`);
    return data;
}

export const saveMessages = async (patientId, role, content) => {
    const { data } = await api.post(`/${patientId}`, { role, content });
    return data;
}