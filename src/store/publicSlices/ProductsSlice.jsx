import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

// get featured products /featured
export const getFeatured = createAsyncThunk("getfeatured", async (data, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/product/featured`);
        return res.data
    } catch (error) {
        return rejectWithValue(null)
    }
})

// get new arrivals products /new-arrivals
export const getNewArrivals = createAsyncThunk("getnewarrivals", async (data, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/product/new-arrivals`);
        return res.data
    } catch (error) {
        return rejectWithValue(null)
    }
})

// get popular /popular
export const getPopular = createAsyncThunk("getpopular", async (data, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/product/popular`);
        return res.data
    } catch (error) {
        return rejectWithValue(null)
    }
})

// get all products /products
export const getProducts = createAsyncThunk("getproducts", async (data, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/product/products`);
        return res.data
    } catch (error) {
        return rejectWithValue(null)
    }
})

// get related products /related/:productId
export const getRelated = createAsyncThunk("getrelated", async (productId, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/product/related/${productId}`);
        return res.data
    } catch (error) {
        return rejectWithValue(null)
    }
})

// get single product /product/:slug
export const getSingleProduct = createAsyncThunk("getproduct", async (slug, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/product/product/${slug}`);
        return res.data
    } catch (error) {
        return rejectWithValue(null)
    }
})

// get top rated products /top-rated
export const getTopRated = createAsyncThunk("gettoprated", async (data, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/product/top-rated`);
        return res.data
    } catch (error) {
        return rejectWithValue(null)
    }
})

// search products /search
export const searchProducts = createAsyncThunk("search", async ({ search, filters }, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/product/search?s=${search}`, filters);
        return res.data
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

const productsSlice = createSlice({
    name: "products",
    initialState: {
        allProducts: [],
        featuedProducts: [],
        popularProducts: [],
        newArrivals: [],
        topRatedProducts: [],
        relatedProducts: [],
        loading: false,
        err: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFeatured.fulfilled, (state, action) => {
                state.featuedProducts = action.payload?.data;
            })
            .addCase(getPopular.fulfilled, (state, action) => {
                state.popularProducts = action.payload?.data;
            })
            .addCase(getNewArrivals.fulfilled, (state, action) => {
                state.newArrivals = action.payload?.data;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.allProducts = action.payload?.data;
            })
            .addCase(getTopRated.fulfilled, (state, action) => {
                state.topRatedProducts = action.payload?.data;
            })
            .addCase(getRelated.fulfilled, (state, action) => {
                state.relatedProducts = action.payload?.data;
            })
    }
})

export default productsSlice.reducer;
