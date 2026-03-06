import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = (slug?: string) => {
  if (socket) return socket;

  const token = slug 
    ? localStorage.getItem(`participantToken_${slug}`) || localStorage.getItem('accessToken')
    : localStorage.getItem('accessToken');

  // WebSocket 인증을 위한 auth 객체 포함
  socket = io('/', {
    path: '/socket.io',
    auth: {
      token: token,
    },
    transports: ['websocket'],
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
