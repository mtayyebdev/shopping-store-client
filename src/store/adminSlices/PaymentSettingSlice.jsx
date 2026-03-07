import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const getPaymentSetting = createAsyncThunk("getpaymentsetting", async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/payment-setting/admin/get-payment`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(null)
    }
})

export const updatePaymentSetting = createAsyncThunk("updatepaymentsetting", async (paymentData, { rejectWithValue }) => {
    try {
        const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/payment-setting/admin/update-payment`, paymentData, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error?.message || error?.response?.data)
    }
})

const PaymentSettingSlice = createSlice({
    name: "paymentsettingslice",
    initialState: {
        payment: null,
        loading: false,
        err: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPaymentSetting.pending, (state) => {
                state.loading = true;
                state.err = null;
            })
            .addCase(getPaymentSetting.fulfilled, (state, action) => {
                state.payment = action.payload?.data;
                state.loading = false;
                state.err = null;
            })
            .addCase(getPaymentSetting.rejected, (state, action) => {
                state.err = action.payload;
                state.loading = false;
            })
    }
})

export default PaymentSettingSlice.reducer;