import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const getPayments = createAsyncThunk("getpayments", async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/payment-setting/get-payments`);
        return res.data;
    } catch (error) {
        return rejectWithValue(null)
    }
})

const PaymentsSlice = createSlice({
    name: "paymentsslice",
    initialState: {
        payments: null,
        loading: false,
        err: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPayments.pending, (state) => {
                state.loading = true;
                state.err = null;
            })
            .addCase(getPayments.fulfilled, (state, action) => {
                state.payments = action.payload?.data;
                state.loading = false;
                state.err = null;
            })
            .addCase(getPayments.rejected, (state, action) => {
                state.err = action.payload;
                state.loading = false;
            })
    }
})

export default PaymentsSlice.reducer;