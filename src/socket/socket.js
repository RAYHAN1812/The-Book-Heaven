import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

export default socket;
