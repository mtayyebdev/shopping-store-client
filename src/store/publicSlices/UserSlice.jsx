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
        currency: {
            symbol: "Rs.",
            name: "PKR",
            position: "left",
            decimal: 0,
            thousandSeparator: ",",
            decimalSeparator: "."
        },
        language: {
            code: "en",
            name: "English",
            direction: "ltr"
        },
        loading: true,
        err: null
    },
    reducers: {
        changeCurrency: (state, action) => {
            state.currency = action.payload;
        },
        changeLanguage: (state, action) => {
            state.language = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUser.pending, (state) => {
                state.loading = true;
                state.err = null;
            })
            // FullFilled states........
            .addCase(getUser.fulfilled, (state, action) => {
                state.user = action?.payload?.data || null;
                state.isLoggedIn = action?.payload?.success || false;
                state.loading = false;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.user = null;
                state.isLoggedIn = false;
                state.loading = false;
                state.err = action?.payload || action?.error?.message || null;
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                toast.success(action.payload.message);
                state.user = null;
                state.isLoggedIn = false;
                state.loading = false;
            })
    }
})

export default userSlice.reducer;
