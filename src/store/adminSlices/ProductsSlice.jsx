import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// APIs........
export const getProducts = createAsyncThunk("getproducts", async ({ page, limit, searchName, status }, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/product/admin/products?page=${page}&limit=${limit}&name=${searchName}&status=${status}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(null)
    }
})

export const createProduct = createAsyncThunk("createproduct", async (productData, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/product/admin/create`, productData, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

export const getProduct = createAsyncThunk("getproduct", async (productId, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/product/admin/product/${productId}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

export const updateProduct = createAsyncThunk("updateproduct", async ({ productId, productData }, { rejectWithValue }) => {
    try {
        const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/product/admin/update/${productId}`, productData, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

export const deleteProduct = createAsyncThunk("deleteproduct", async (productId, { rejectWithValue }) => {
    try {
        const res = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/product/admin/delete/${productId}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

export const updateProductStatus = createAsyncThunk("updateproductstatus", async ({ productId, status }, { rejectWithValue }) => {
    try {
        const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/product/admin/update-status/${productId}`, { status }, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

const productsSlice = createSlice({
    name: "productsslice",
    initialState: {
        products: [],
        outOfStock: 0,
        totalProducts: 0,
        lowStock: 0,
        totalRevenue: 0,
        totalPages: 1,
        totalProductsStats: 0,
        loading: false,
        err: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.loading = true;
                state.err = null;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.products = action.payload?.data;
                state.totalProducts = action.payload?.totalProducts;
                state.lowStock = action.payload?.productStats?.lowStock;
                state.outOfStock = action.payload?.productStats?.outOfStock;
                state.totalRevenue = action.payload?.totalRevenue;
                state.totalPages = action.payload?.totalPages;
                state.totalProductsStats = action.payload?.productStats?.totalProducts || 0;
                state.loading = false;
                state.err = null;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.err = action.payload;
                state.loading = false;
            })
    }
})

export default productsSlice.reducer;
