import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

// APIs.........
export const getCoupons = createAsyncThunk("getcoupons", async ({ page, limit, statusFilter, discountTypeFilter, timeFilter }, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/coupon/admin/coupons?page=${page}&limit=${limit}&status=${statusFilter}&discount=${discountTypeFilter}&date=${timeFilter}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(null)
    }
})

export const createCoupon = createAsyncThunk("createcoupon", async (couponData, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/coupon/admin/create`, couponData, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const getCoupon = createAsyncThunk("getcoupon", async (couponId, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/coupon/admin/single-coupon/${couponId}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const updateCoupon = createAsyncThunk("updatecoupon", async ({ couponId, couponData }, { rejectWithValue }) => {
    try {
        const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/coupon/admin/update/${couponId}`,couponData, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const deleteCoupon = createAsyncThunk("deletecoupon", async (couponId, { rejectWithValue }) => {
    try {
        const res = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/coupon/admin/delete/${couponId}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const updateCouponStatus = createAsyncThunk("updatecouponstatus", async ({ couponId, status }, { rejectWithValue }) => {
    try {
        const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/coupon/admin/update-status/${couponId}`, { status }, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message)
    }
})


const CouponSlice = createSlice({
    name: "couponslice",
    initialState: {
        coupons: [],
        totalCoupons: 0,
        activeCoupons: 0,
        expiredCoupons: 0,
        totalUsage: 0,
        totalPages: 1,
        totalCouponsStats: 0,
        loading: false,
        err: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCoupons.pending, (state) => {
                state.loading = true;
                state.err = null;
            })
            .addCase(getCoupons.fulfilled, (state, action) => {
                state.coupons = action.payload.data;
                state.totalCoupons = action.payload?.totalCoupons || 0;
                state.activeCoupons = action.payload?.couponStats?.activeCoupons || 0;
                state.expiredCoupons = action.payload?.couponStats?.expiredCoupons || 0;
                state.totalUsage = action.payload?.couponStats?.totalUsage || 0;
                state.totalPages = action.payload?.totalPages || 1;
                state.totalCouponsStats = action.payload?.couponStats?.totalCoupons || 0;
                state.loading = false;
                state.err = null;
            })
            .addCase(getCoupons.rejected, (state, action) => {
                state.err = action.payload;
                state.loading = false;
            })
    }
})

export default CouponSlice.reducer;