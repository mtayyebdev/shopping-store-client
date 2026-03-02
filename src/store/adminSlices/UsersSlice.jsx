import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// APIs...........................
export const getUsers = createAsyncThunk("getusers", async ({ page, limit, search,statusFilter }, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/admin/users?page=${page}&limit=${limit}&search=${search}&status=${statusFilter}`, {
            withCredentials: true
        })
        return res.data;
    } catch (error) {
        return rejectWithValue(null);
    }
});

export const getUser = createAsyncThunk("getsingleuser", async (userId, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/admin/user/${userId}`, {
            withCredentials: true
        })
        return res.data;
    } catch (error) {
        return rejectWithValue(null);
    }
});

export const deleteUser = createAsyncThunk("deleteuser", async (userId, { rejectWithValue }) => {
    try {
        const res = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/auth/admin/delete-user/${userId}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const updateUserProfile = createAsyncThunk("updateuserprofile", async ({ userId, userData }, { rejectWithValue }) => {
    try {
        const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/auth/admin/update-user-profile/${userId}`, userData, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message)
    }
});

export const updateUserInfo = createAsyncThunk("updateuserinfo", async ({ userId, infoData }, { rejectWithValue }) => {
    try {
        const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/auth/admin/update-user-info/${userId}`, infoData, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message)
    }
});

export const updateUserStatus = createAsyncThunk("updateuserstatus", async ({ userId, status }, { rejectWithValue }) => {
    try {
        const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/auth/admin/update-user-status/${userId}`, { status }, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message)
    }
});

const getUsersSlice = createSlice({
    name: "usersslice",
    initialState: {
        data: [],
        totalUsers: 0,
        verifiedUsers: 0,
        thisMonth: 0,
        adminUsers: 0,
        totalPages: 1,
        suspendedUsers: 0,
        totalUsersStats: 0,
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
                state.data = action.payload?.data || [];
                state.totalUsers = action.payload?.totalUsers || 0;
                state.verifiedUsers = action.payload?.usersStats?.verifiedUsers || 0;
                state.thisMonth = action.payload?.usersStats?.thisMonth || 0;
                state.adminUsers = action.payload?.usersStats?.adminUsers || 0;
                state.suspendedUsers = action.payload?.usersStats?.suspendedUsers || 0;
                state.totalPages = action.payload?.totalPages || 1;
                state.totalUsersStats = action.payload?.usersStats?.totalUsers || 0;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.loading = false;
                state.err = action.payload;
            })
    }
})

export default getUsersSlice.reducer;

