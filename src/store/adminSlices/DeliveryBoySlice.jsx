import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const getRiders = createAsyncThunk("getriders", async ({ page, limit, search, actionStatus, vehicleType, workload }, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/rider/admin/get-deliveryboys?page=${page}&limit=${limit}&search=${search}&actionStatus=${actionStatus}&vehicleType=${vehicleType}&workload=${workload}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(null)
    }
})

export const getRider = createAsyncThunk("getrider", async (riderId, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/rider/admin/get-deliveryboy/${riderId}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error?.message || error?.response?.data)
    }
})

export const createRider = createAsyncThunk("createrider", async (data, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/rider/admin/create`, data, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error?.message || error?.response?.data)
    }
})

export const updateRider = createAsyncThunk("updaterider", async ({ riderId, riderData }, { rejectWithValue }) => {
    try {
        const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/rider/admin/update/${riderId}`, riderData, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error?.message || error?.response?.data)
    }
})

export const deleteRider = createAsyncThunk("deleterider", async (riderId, { rejectWithValue }) => {
    try {
        const res = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/rider/admin/delete/${riderId}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error?.message || error?.response?.data)
    }
})

export const updateRiderActionStatus = createAsyncThunk("updaterideractionstatus", async ({ riderId, actionStatus }, { rejectWithValue }) => {
    try {
        const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/rider/admin/update-actionstatus/${riderId}`, actionStatus, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error?.message || error?.response?.data)
    }
})

const DeliveryBoySlice = createSlice({
    name: "riderslice",
    initialState: {
        riders: [],
        totalPages: 1,
        totalDeliveryBoys: 0,
        totalRiders: 0,
        activeRiders: 0,
        busyRiders: 0,
        suspendedRiders: 0,
        loading: false,
        err: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(getRiders.pending, (state) => {
                state.loading = true;
                state.err = null;
            })
            .addCase(getRiders.fulfilled, (state, action) => {
                const data = action.payload;

                state.riders = data?.data;
                state.totalPages = data?.totalPages;
                state.totalDeliveryBoys = data?.totalDeliveryBoys;
                state.totalRiders = data?.state?.totalRiders;
                state.activeRiders = data?.state?.activeRiders;
                state.busyRiders = data?.state?.busyRiders;
                state.suspendedRiders = data?.state?.suspendedRiders;

                state.loading = false;
                state.err = null;
            })
            .addCase(getRiders.rejected, (state, action) => {
                state.loading = false;
                state.err = action.payload;
            })
    }
})

export default DeliveryBoySlice.reducer;