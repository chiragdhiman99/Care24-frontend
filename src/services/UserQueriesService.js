import axios from "axios";

const API_URL = "https://care24-backend-1.onrender.com/api/user-queries";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const createUserQuery = async (queryData) => {
  const { data } = await api.post("/", queryData);
  return data;
};