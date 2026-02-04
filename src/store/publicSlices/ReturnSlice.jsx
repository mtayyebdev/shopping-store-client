import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getReturns = createAsyncThunk("getreturns", async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/return/returns`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(null)
    }
})

const ReturnSlice = createSlice({
    name: "returns",
    initialState: {
        returns: [],
        loading: false,
        err: null
    },
    extraReducers: ((builder) => {
        builder
            .addCase(getReturns.pending, (state) => {
                state.loading = true;
            })
            .addCase(getReturns.fulfilled, (state, action) => {
                state.returns = action.payload.data;
                state.loading = false
            })
            .addCase(getReturns.rejected, (state, action) => {
                state.err = action.payload;
                state.loading = false;
            })
    })
});

export default ReturnSlice.reducer