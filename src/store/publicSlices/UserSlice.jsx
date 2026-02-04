import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

// APIs..................
// get user api...
export const getUser = createAsyncThunk("getuser", async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/user`, {
            withCredentials: true
        })
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

// logout user api...
export const logoutUser = createAsyncThunk("logoutuser", async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/logout`, {
            withCredentials: true
        })
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

// APIs Handler.....................
const userSlice = createSlice({
    name: "getuser",
    initialState: {
        user: null,
        isLoggedIn: false,
        loading: false,
        err: null
    },
    extraReducers: (builder) => {
        builder
            // FullFilled states........
            .addCase(getUser.fulfilled, (state, action) => {
                state.user = action?.payload?.data || null;
                state.isLoggedIn = action?.payload?.success || false;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.user = null;
                state.isLoggedIn = false;                
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                toast.success(action.payload.message);
                state.user = null;
                state.isLoggedIn = false;
            })
    }
})

export default userSlice.reducer;