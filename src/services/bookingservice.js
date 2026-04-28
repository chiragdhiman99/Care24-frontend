import axios from "axios";

const API_URL = " https://care24-backend.onrender.com/api/bookings";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
export const getBookingById = async (id) => {
  const { data } = await api.get(`/get/${id}`);
  return data;
};


export const getbookingsByCaregiverId = async (caregiverId) => {
  const { data } = await api.get(`/caregiver/${caregiverId}`);
  return data;
};

export const markAllAsRead = async (caregiverId) => {
  const { data } = await api.put(`/read/caregiver/${caregiverId}`);
  return data;
};


export const markallAsRead2 = async (userId) => {
  const { data } = await api.put(`/read/user/${userId}`);
  return data;
};


export const cancelBooking = async (id,body) => {
  const { data } = await api.patch(`/${id}/cancel`,body);
  return data;
};

export const getAllBookings = async () => {
  const { data } = await api.get(`/all`);
  return data;
}
