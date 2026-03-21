import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Reservation {
  id: string;
  roomId: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'CHECKED_IN' | 'CHECKED_OUT';
  totalAmount: number;
  guestName: string;
}

interface ReservationState {
  reservations: Reservation[];
  loading: boolean;
}

const initialState: ReservationState = { reservations: [], loading: false };

const reservationSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    setReservations(state, action: PayloadAction<Reservation[]>) { state.reservations = action.payload; },
    addReservation(state, action: PayloadAction<Reservation>) { state.reservations.push(action.payload); },
    updateReservation(state, action: PayloadAction<Reservation>) {
      const idx = state.reservations.findIndex(r => r.id === action.payload.id);
      if (idx !== -1) state.reservations[idx] = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) { state.loading = action.payload; },
  },
});

export const { setReservations, addReservation, updateReservation, setLoading } = reservationSlice.actions;
export default reservationSlice.reducer;
