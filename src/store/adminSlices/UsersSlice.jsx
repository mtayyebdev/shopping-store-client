import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// APIs...........................
// get all users...
export const getUsers = createAsyncThunk("getusers", async (data, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/admin/users`, {
            withCredentials: true
        })
        return res.data;
    } catch (error) {
        return rejectWithValue(error)
    }
})

const getUsersSlice = createSlice({
    name: "getusers",
    initialState: {
        data: [],
        loading: false,
        err: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.loading = false;
                state.err = action.payload;
            })
    }
})

export default getUsersSlice.reducer;

