import axios from "axios";

const API_URL = "http://localhost:5001/api/user-queries";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const createUserQuery = async (queryData) => {
  const { data } = await api.post("/", queryData);
  return data;
};