import { io } from "socket.io-client";

const socket = io("https://care24-backend-1.onrender.com");

export default socket;