import axios from "axios";

const API_URL = "http://localhost:5001/api/notifications";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const createNotification = async (notificationData) => {
  const { data } = await api.post("/", notificationData);
  return data;
};

export const getNotifications = async (userId) => {
  const { data } = await api.get(`/all/${userId}`);
  return data;
};

export const markAllAsRead3 = async (userId) => {
  const { data } = await api.put(`/read/${userId}`);
  return data;
};