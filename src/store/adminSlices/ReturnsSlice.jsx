import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

// APIs.........
export const getReturns = createAsyncThunk("getreturns", async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/return/admin/returns`, { withCredentials: true });
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
        const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/return/admin/update/${returnId}`, { returnStatus }, { withCredentials: true });
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
        totalReturns:0,
        inReview:0,
        resolved:0,
        rejected:0,
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
                state.returns = action.payload.data;
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