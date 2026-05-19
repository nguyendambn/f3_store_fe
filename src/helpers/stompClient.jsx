import { Client } from '@stomp/stompjs';
import SockJS from "sockjs-client/dist/sockjs";


const api = import.meta.env.VITE_API_URL;

let stompClient = null;

export const getStompClient = () => {
     const token = localStorage.getItem("accessToken");
      if (!token) return null;
    if (!stompClient) {
        stompClient = new Client({
            webSocketFactory: () => new SockJS(`${api}/ws`),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
            },
            reconnectDelay: 5000
        });
        stompClient.activate();
    }
    return stompClient;
};
