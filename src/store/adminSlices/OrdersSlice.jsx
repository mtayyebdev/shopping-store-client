import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

// APIs.........
export const getOrders = createAsyncThunk("getorders", async ({ page, limit, search, status, time, paymentStatus, actionStatus }, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/order/admin/orders?page=${page}&limit=${limit}&search=${search}&status=${status}&time=${time}&paymentStatus=${paymentStatus}&actionStatus=${actionStatus}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(null)
    }
})

export const getOrder = createAsyncThunk("getorder", async (orderId, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/order/admin/single-order/${orderId}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const updateOrderStatus = createAsyncThunk("updateorderstatus", async ({ orderId, orderStatus }, { rejectWithValue }) => {
    try {
        const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/order/admin/update-status/${orderId}`, { orderStatus }, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const deleteOrder = createAsyncThunk("deleteorder", async (orderId, { rejectWithValue }) => {
    try {
        const res = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/order/admin/delete/${orderId}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const updateOrderActionStatus = createAsyncThunk("updateorderactionstatus", async ({ orderId, actionStatus }, { rejectWithValue }) => {
    try {
        const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/order/admin/update-action-status/${orderId}`, { actionStatus }, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message)
    }
});


const OrderSlice = createSlice({
    name: "orderslice",
    initialState: {
        orders: [],
        totalOrders: 0,
        inprogress: 0,
        delivered: 0,
        paidRevenue: 0,
        totalOrdersPagination: 0,
        totalPages: 1,
        loading: false,
        err: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(getOrders.pending, (state) => {
                state.loading = true;
                state.err = null;
            })
            .addCase(getOrders.fulfilled, (state, action) => {
                state.orders = action.payload?.data;
                state.totalOrdersPagination = action.payload?.totalOrders;
                state.totalPages = action.payload?.totalPages;
                state.inprogress = action.payload?.stats?.InProgressOrders;
                state.delivered = action.payload?.stats?.DeliveredOrders;
                state.paidRevenue = action.payload?.stats?.paidRevenue;
                state.totalOrders = action.payload?.stats?.totalOrders;
                state.loading = false;
                state.err = null;
            })
            .addCase(getOrders.rejected, (state, action) => {
                state.err = action.payload;
                state.loading = false;
            })
    }
})

export default OrderSlice.reducer;