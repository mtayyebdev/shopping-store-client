import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const getAssignedOrders = createAsyncThunk("getassignedorders", async ({ page, limit, search, status, time }, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/rider/get-assigned-orders?page=${page}&limit=${limit}&search=${search}&status=${status}&time=${time}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(null);
    }
});

export const getAssignedOrder = createAsyncThunk("getassignedorder", async (orderId, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/rider/get-order/${orderId}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(null);
    }
});

export const getDeliveryBoy = createAsyncThunk("getdeliveryboy", async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/rider/get-deliveryboy`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(null);
    }
});

export const updateassignedOrderStatus = createAsyncThunk("updateassignedorderstatus", async ({ orderId, status }, { rejectWithValue }) => {
    try {
        const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/rider/update-orderstatus/${orderId}`, status, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data || error.message);
    }
});

export const logoutDeliveryBoy = createAsyncThunk("logoutdeliveryboy", async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/rider/logout`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data || error.message);
    }
});

const DeliveryBoySlice = createSlice({
    name: "deliveryboyslice",
    initialState: {
        rider: null,
        assignedOrders: [],
        totalPages: 1,
        totalAssigned: 0,
        totalAssignedOrders: 0,
        activeDelivery: 0,
        delivered: 0,
        codPending: 0,
        isLoggedIn: false,
        authLoading: true,
        ordersLoading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDeliveryBoy.pending, (state) => {
                state.authLoading = true;
                state.error = null;
            })
            .addCase(getDeliveryBoy.fulfilled, (state, action) => {
                state.authLoading = false;
                state.rider = action.payload?.data;
                state.isLoggedIn = action.payload?.success || false
            })
            .addCase(getDeliveryBoy.rejected, (state, action) => {
                state.authLoading = false;
                state.error = action.payload;
            })

            .addCase(logoutDeliveryBoy.fulfilled, (state, action) => {
                state.authLoading = false;
                state.isLoggedIn = false;
                state.rider = null;
                state.error = null;
            })

            .addCase(getAssignedOrders.pending, (state) => {
                state.ordersLoading = true;
                state.error = null;
            })
            .addCase(getAssignedOrders.fulfilled, (state, action) => {
                const data = action.payload;
                state.ordersLoading = false;
                state.assignedOrders = data?.data;
                state.totalPages = data?.totalPages;
                state.totalAssignedOrders = data?.totalAssignedOrders;

                state.totalAssigned = data?.stats?.totalAssigned;
                state.activeDelivery = data?.stats?.activeDelivery;
                state.codPending = data?.stats?.codPending;
                state.delivered = data?.stats?.delivered;
            })
            .addCase(getAssignedOrders.rejected, (state, action) => {
                state.ordersLoading = false;
                state.error = action.payload;
            })
    }
});

export default DeliveryBoySlice.reducer;
