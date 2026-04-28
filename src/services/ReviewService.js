import axios from "axios";

const API_URL = "http://localhost:5001/api/reviews";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});


export const createReviews = async (reviewData) => {
  const { data } = await api.post("/", reviewData);
  return data;
};


export const getReviews = async () => {
  const { data } = await api.get("/");
  return data;
};