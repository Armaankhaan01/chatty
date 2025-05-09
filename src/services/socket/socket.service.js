// @services/socket/socket.service.js
import { io } from 'socket.io-client';

class SocketService {
  socket = null;
  reconnectTimer = null;
  reconnectAttempts = 0;
  maxReconnectAttempts = 5;
  reconnectInterval = 5000;

  getBackendUrl() {
    return process.env.REACT_APP_BASE_ENDPOINT;
  }

  setupSocketConnection() {
    // Clean up any existing connection first
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    // Clear any pending reconnect timers
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    const backendUrl = this.getBackendUrl();

    console.log(`Setting up socket connection to: ${backendUrl}`);

    this.socket = io(backendUrl, {
      transports: ['websocket'],
      upgrade: false,
      secure: true,
      reconnection: false,
      extraHeaders: {
        Host: new URL(backendUrl).hostname
      }
    });

    this.setupSocketConnectionEvents();
    this.connect();

    return this.socket;
  }

  connect() {
    if (this.socket && !this.socket.connected) {
      console.log('Connecting socket...');
      this.socket.connect();
    }
  }

  setupSocketConnectionEvents() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log(`✅ Socket connected successfully! ID: ${this.socket.id}`);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.warn(`Socket disconnected. Reason: ${reason}`);

      if (reason === 'io server disconnect') {
        this.scheduleReconnect();
      } else if (reason === 'transport close') {
        this.scheduleReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error(`❌ Socket connection error: ${error.message}`, error);
      console.log(`Connection URL: ${this.socket.io.uri}`);

      if (this.socket.io.engine && this.socket.io.engine.transport) {
        console.log(`Transport: ${this.socket.io.engine.transport.name}`);
      }

      this.scheduleReconnect();
    });

    this.socket.on('error', (error) => {
      console.error('❌ Socket general error:', error);
    });
  }

  scheduleReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.reconnectAttempts++;

    if (this.reconnectAttempts > this.maxReconnectAttempts) {
      console.warn(`Maximum reconnection attempts (${this.maxReconnectAttempts}) reached. Giving up.`);
      return;
    }

    const delay = this.reconnectInterval * Math.min(Math.pow(2, this.reconnectAttempts - 1), 10);
    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);

    this.reconnectTimer = setTimeout(() => {
      console.log(`Attempting reconnection #${this.reconnectAttempts}...`);
      this.connect();
    }, delay);
  }

  emit(eventName, data) {
    if (this.socket && this.socket.connected) {
      console.log(`Emitting event: ${eventName}`, data);
      this.socket.emit(eventName, data);
      return true;
    } else {
      console.warn(`Socket not connected. Unable to emit event: ${eventName}`);
      return false;
    }
  }

  // Method to listen for events
  on(eventName, callback) {
    if (this.socket) {
      this.socket.on(eventName, callback);
      return true;
    }
    console.warn(`Socket not initialized. Cannot listen for event: ${eventName}`);
    return false;
  }

  // Method to remove event listeners
  off(eventName, callback) {
    if (this.socket) {
      this.socket.off(eventName, callback);
      return true;
    }
    return false;
  }

  // Method to disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      console.log('Socket disconnected manually');
    }

    // Clear any reconnection timers
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  // Method to check if socket is connected
  isConnected() {
    return this.socket && this.socket.connected;
  }
}

export const socketService = new SocketService();
