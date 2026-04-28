import axios from "axios";

const API_URL = "https://care24-backend.onrender.com/api/auth";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
export const registerUser = async (userdata) => {
  try {
    const { data } = await api.post("/register", userdata);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const loginUser = async (userdata) => {
  try {
    const { data } = await api.post("/login", userdata);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const getMe = async () => {
  const { data } = await api.get("/me");
  return data;
};

export const getuserbyid = async (id) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

export const updateUser = async (id, updatedData) => {
  const { data } = await api.put(`/users/${id}`, updatedData);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};

export const logout = async () => {
  const { data } = await api.post("/logout");
  return data;
};
export const AdminLogin = async (userdata) => {
  try {
    const { data } = await api.post("/adminlogin", userdata);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Invalid credentials");
  }
};

export const getAllUsers = async () => {
  const { data } = await api.get("/users");
  return data;
};

export const verifyUser = async () => {
  const { data } = await api.get("/verify");
  return data;
};
