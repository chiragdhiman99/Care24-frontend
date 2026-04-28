import { io } from "socket.io-client";

const socket = io("https://care24-backend.onrender.com");

export default socket;