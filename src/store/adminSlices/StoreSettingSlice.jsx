import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const getStoreSetting = createAsyncThunk("getstoresetting", async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/store-setting/admin/get-setting`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(null)
    }
})

export const updateStoreSetting = createAsyncThunk("updatestoresetting", async (settingData, { rejectWithValue }) => {
    try {
        const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/store-setting/admin/update-setting`, settingData, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error?.message || error?.response?.data)
    }
})

const StoreSettingSlice = createSlice({
    name: "storesettingslice",
    initialState: {
        setting: null,
        loading: false,
        err: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(getStoreSetting.pending, (state) => {
                state.loading = true;
                state.err = null;
            })
            .addCase(getStoreSetting.fulfilled, (state, action) => {
                state.setting = action.payload?.data;
                state.loading = false;
                state.err = null;
            })
            .addCase(getStoreSetting.rejected, (state, action) => {
                state.err = action.payload;
                state.loading = false;
            })
    }
})

export default StoreSettingSlice.reducer;