import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getOrderData = createAsyncThunk("getorderdata", async (orderId, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/order/single-order/${orderId}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data || error?.message)
    }
})
export const getOrders = createAsyncThunk("getorders", async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/order/orders`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data || error?.message)
    }
})
export const cancelOrder = createAsyncThunk("cancelorder", async (orderId, { rejectWithValue }) => {
    try {
        const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/order/cancel/${orderId}`,{},{withCredentials: true});
        return res.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data || error?.message)
    }
})
export const orderPayment = createAsyncThunk("orderpayment", async ({ orderId, paymentMethod }, { rejectWithValue }) => {

    try {
        const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/order/payment/${orderId}`, {paymentMethod}, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data || error?.message)
    }
})

const OrderSlice = createSlice({
    name: "order",
    initialState: {
        orderData: null,
        allOrders: [],
        loading: false,
        error: null,
    },
    reducers: {
        setCheckoutData: (state, action) => {
            state.orderData = { ...state.orderData, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getOrders.pending, (state) => {
                state.loading = true
            })
            .addCase(getOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.allOrders = action.payload?.data;
            })
            .addCase(getOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { setCheckoutData } = OrderSlice.actions;
export default OrderSlice.reducer;