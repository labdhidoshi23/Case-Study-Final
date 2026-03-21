import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080';

const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket'],
});

export const connectSocket = (token: string) => {
  socket.auth = { token };
  socket.connect();
};

export const disconnectSocket = () => {
  socket.disconnect();
};

export const onReservationCreated = (cb: (data: any) => void) => socket.on('reservation.created', cb);
export const onReservationUpdated = (cb: (data: any) => void) => socket.on('reservation.updated', cb);
export const onPaymentCompleted = (cb: (data: any) => void) => socket.on('payment.completed', cb);
export const onNewNotification = (cb: (data: any) => void) => socket.on('notification.new', cb);

export default socket;
