import axios from "axios";

const API_URL = " https://care24-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getConversationbyUserId = async (patientId) => {
  const { data } = await api.get(`/conversations/${patientId}`);
  return data;
};

export const getConversationbyCaregiverId = async (caregiverId) => {
  const { data } = await api.get(`/conversations/caregiver/${caregiverId}`);
  return data;
};
