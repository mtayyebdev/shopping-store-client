import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
    wishlist: [],
    loading: false,
    error: null
}

export const createWishlist = createAsyncThunk(
    'createwishlist',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/create-wishlist/${productId}`, {}, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const getWishlist = createAsyncThunk(
    'getwishlist',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/auth/wishlists`, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const deleteWishlist = createAsyncThunk(
    'deletewishlist',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/auth/delete-wishlist/${productId}`, { withCredentials: true });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

const WishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteWishlist.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createWishlist.fulfilled, (state, action) => {
                state.loading = false;
                toast.success(action.payload.message);
            })
            .addCase(getWishlist.fulfilled, (state, action) => {
                state.loading = false;
                state.wishlist = action.payload.data;
            })
            .addCase(deleteWishlist.fulfilled, (state, action) => {
                state.loading = false;
                toast.success(action.payload.message);
            })
            
            .addCase(getWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload?.message || action.payload);
            })
            .addCase(deleteWishlist.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                toast.error(action.payload?.message || action.payload);
            })
    }
})

export default WishlistSlice.reducer;