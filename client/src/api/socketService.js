import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = {};
  }

  connect() {
    if (!this.socket) {
      const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      this.socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        withCredentials: true,
      });
      
      this.socket.on('connect', () => {
        console.log('Socket connected');
      });
      
      this.socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners = {};
    }
  }

  on(event, callback) {
    if (this.socket) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event].push(callback);
      this.socket.on(event, callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
        if (this.listeners[event]) {
          this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
      } else {
        this.socket.off(event);
        delete this.listeners[event];
      }
    }
  }

  offAll() {
    if (this.socket) {
      Object.keys(this.listeners).forEach(event => {
        this.socket.off(event);
      });
      this.listeners = {};
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  joinRoom(room) {
    if (this.socket) {
      this.socket.emit('join', { room });
    }
  }

  leaveRoom(room) {
    if (this.socket) {
      this.socket.emit('leave', { room });
    }
  }

  joinChatRoom(room) {
    if (this.socket) {
      this.socket.emit('joinChatRoom', room);
    }
  }

  leaveChatRoom(room) {
    if (this.socket) {
      this.socket.emit('leaveChatRoom', room);
    }
  }
}

export const socketService = new SocketService();