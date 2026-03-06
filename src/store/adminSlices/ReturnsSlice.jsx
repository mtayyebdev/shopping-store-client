import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

// APIs.........
export const getReturns = createAsyncThunk("getreturns", async ({ page, limit, search, time, reason, status, actionStatus }, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/return/admin/returns?page=${page}&limit=${limit}&search=${search}&time=${time}&reason=${reason}&status=${status}&actionStatus=${actionStatus}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(null);
    }
})

export const getReturn = createAsyncThunk("getreturn", async (returnId, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/return/admin/return/${returnId}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const updateReturnStatus = createAsyncThunk("updatereturnstatus", async ({ returnId, returnStatus }, { rejectWithValue }) => {
    try {
        const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/return/admin/update-status/${returnId}`, { returnStatus }, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const updateReturnActionStatus = createAsyncThunk("updatereturnactionstatus", async ({ returnId, actionStatus }, { rejectWithValue }) => {
    try {
        const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/return/admin/update-action-status/${returnId}`, { actionStatus }, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const deleteReturn = createAsyncThunk("deletereturn", async (returnId, { rejectWithValue }) => {
    try {
        const res = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/return/admin/delete/${returnId}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message)
    }
})


const ReturnSlice = createSlice({
    name: "returnslice",
    initialState: {
        returns: [],
        totalReturns: 0,
        pendingReturns: 0,
        completedReturns: 0,
        rejectedReturns: 0,
        totalPages: 1,
        totalReturnsSearched: 0,
        loading: false,
        err: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(getReturns.pending, (state) => {
                state.loading = true;
                state.err = null;
            })
            .addCase(getReturns.fulfilled, (state, action) => {
                const data = action.payload;
                state.returns = data?.data;
                state.totalPages = data?.totalPages;
                state.totalReturnsSearched = data?.totalReturns;

                state.totalReturns = data?.stats?.totalReturns;
                state.pendingReturns = data?.stats?.pendingReturns;
                state.completedReturns = data?.stats?.completedReturns;
                state.rejectedReturns = data?.stats?.rejectedReturns;
                
                state.loading = false;
                state.err = null;
            })
            .addCase(getReturns.rejected, (state, action) => {
                state.err = action.payload;
                state.loading = false;
            })
    }
})

export default ReturnSlice.reducer;