import axios from "axios";

const API_URL = "https://care24-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const getMessagesbyId = async (id) => {
  const { data } = await api.get(`/messages/get/${id}`);
  return data;
};

export const getunreadcounts = async (id) => {
  const { data } = await api.get(`/messages/unread/${id}`);
  return data;
};

export const sendimage = async (data) => {
  const { data:res } = await api.post("/messages/image", data);
  return res;
};