import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Room {
  id: string;
  name: string;
  type: string;
  price: number;
  description: string;
  amenities: string[];
  image: string;
  capacity: number;
  available: boolean;
}

interface RoomState {
  rooms: Room[];
  selectedRoom: Room | null;
  loading: boolean;
}

const initialState: RoomState = { rooms: [], selectedRoom: null, loading: false };

const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setRooms(state, action: PayloadAction<Room[]>) { state.rooms = action.payload; },
    setSelectedRoom(state, action: PayloadAction<Room | null>) { state.selectedRoom = action.payload; },
    setLoading(state, action: PayloadAction<boolean>) { state.loading = action.payload; },
  },
});

export const { setRooms, setSelectedRoom, setLoading } = roomSlice.actions;
export default roomSlice.reducer;
