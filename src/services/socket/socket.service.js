import { BASE_ENDPOINT } from '@services/axios';
import { io } from 'socket.io-client';

class SocketService {
  socket;

  setupSocketConnection() {
    this.socket = io(BASE_ENDPOINT, {
      transports: ['websocket'],
      secure: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000
    });

    this.socketConnectionEvents();
  }

  socketConnectionEvents() {
    this.socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    this.socket.on('disconnect', (reason) => {
      console.warn(`Socket disconnected: ${reason}`);
    });

    this.socket.on('connect_error', (error) => {
      console.error(`Socket connection error: ${error.message}`);
    });
  }

  disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
      console.log('Socket disconnected manually');
    }
  }
}

export const socketService = new SocketService();
