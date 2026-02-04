import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify';

export const useCoupon = createAsyncThunk("usecoupon", async ({ code, totalAmount }, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/coupon/apply`, { code, totalAmount }, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

const couponSlice = createSlice({
    name: "coupon",
    initialState: {
        couponData: null,
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(useCoupon.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(useCoupon.fulfilled, (state, action) => {
                state.loading = false;
                state.couponData = action.payload?.data;
                toast.success(action.payload.message);
            })
            .addCase(useCoupon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload?.message || "Failed to apply coupon");
            });
    }
});

export default couponSlice.reducer;