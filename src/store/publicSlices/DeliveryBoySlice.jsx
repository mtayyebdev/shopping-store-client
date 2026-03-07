import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify';

export const getAssignedOrders = createAsyncThunk("getassignedorders", async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/rider/get-assigned-orders`, { withCredentials: true });
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
        return rejectWithValue(error?.message || error?.response?.data);
    }
});

const DeliveryBoySlice = createSlice({
    name: "deliveryboyslice",
    initialState: {
        rider: null,
        assignedOrders: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAssignedOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAssignedOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.assignedOrders = action.payload?.data;
            })
            .addCase(getAssignedOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getDeliveryBoy.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDeliveryBoy.fulfilled, (state, action) => {
                state.loading = false;
                state.rider = action.payload?.data;
            })
            .addCase(getDeliveryBoy.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default DeliveryBoySlice.reducer;