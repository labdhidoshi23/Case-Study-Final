import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Payment {
  id: string;
  reservationId: string;
  amount: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  method: string;
  date: string;
}

interface PaymentState {
  payments: Payment[];
  loading: boolean;
}

const initialState: PaymentState = { payments: [], loading: false };

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setPayments(state, action: PayloadAction<Payment[]>) { state.payments = action.payload; },
    addPayment(state, action: PayloadAction<Payment>) { state.payments.push(action.payload); },
    setLoading(state, action: PayloadAction<boolean>) { state.loading = action.payload; },
  },
});

export const { setPayments, addPayment, setLoading } = paymentSlice.actions;
export default paymentSlice.reducer;
