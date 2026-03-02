import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify';

// APIs.........
// for pagination...
export const getCategories = createAsyncThunk("getcategories", async ({ page, limit, search, status }, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/category/admin/categories?page=${page}&limit=${limit}&search=${search}&status=${status}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(null);
    }
})

// for common use, need all categories...
export const getAllCategories = createAsyncThunk("getallcategories", async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/category/admin/allcategories`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(null);
    }
})

export const createCategory = createAsyncThunk("createcategory", async ({ formData }, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/category/admin/create`, formData, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const getCategory = createAsyncThunk("getcategory", async (categoryId, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/category/admin/category/${categoryId}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const updateCategory = createAsyncThunk("updatecategory", async ({ categoryId, categoryData }, { rejectWithValue }) => {
    try {
        const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/category/admin/update/${categoryId}`, categoryData, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const deleteCategory = createAsyncThunk("deletecategory", async (categoryId, { rejectWithValue }) => {
    try {
        const res = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/category/admin/delete/${categoryId}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message)
    }
})

export const updateCategoryStatus = createAsyncThunk("updatecategorystatus", async ({ categoryId, status }, { rejectWithValue }) => {
    try {
        const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/category/admin/update-status/${categoryId}`, { status }, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message)
    }
});


const CategorySlice = createSlice({
    name: "categoriesslice",
    initialState: {
        categories: [],
        totalPages: 1,
        totalCategories: 0,
        parentCategories: 0,
        subCategories: 0,
        totalCategoriesStats: 0,
        loading: false,
        err: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCategories.pending, (state) => {
                state.loading = true;
                state.err = null;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                const data = action.payload;
                state.categories = data.data;
                state.totalCategories = data?.totalCategories || 0;
                state.totalPages = data.totalPages;
                state.subCategories = data.categoryStates?.totalSubCategories || 0;
                state.parentCategories = data.categoryStates?.totalParents || 0;
                state.totalCategoriesStats = data.categoryStates?.totalCategories || 0;
                state.loading = false;
                state.err = null;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.err = action.payload;
                state.loading = false;
            })
    }
})

export default CategorySlice.reducer;