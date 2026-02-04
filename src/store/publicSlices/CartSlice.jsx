import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

// add to cart
export const addToCart = createAsyncThunk("addtocart", async ({ productId, body }, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/cart/create/${productId}`, body, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// delete cart
export const deleteCart = createAsyncThunk("deletecart", async (cartId, { rejectWithValue }) => {
    try {
        const res = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/cart/delete/${cartId}`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// delete many carts
export const deleteCarts = createAsyncThunk("deletecarts", async ({ cartsIds }, { rejectWithValue }) => {
    try {
        const res = await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/cart/delete-many`,
            { data: { cartsIds }, withCredentials: true }
        );
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

// get carts
export const getCarts = createAsyncThunk("getcarts", async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/cart/carts`, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(null);
    }
});

// update cart
export const updateCart = createAsyncThunk("updatecart", async ({ cartId, quantity }, { rejectWithValue }) => {
    try {
        const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/cart/update/${cartId}`, { quantity }, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
})

// toggle cart selection
export const toggleCartSelection = createAsyncThunk("togglecartselection", async ({ cartId, selected }, { rejectWithValue }) => {
    try {
        const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/cart/toggle-selection/${cartId}`, { selected }, { withCredentials: true });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
    }
});

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        carts: [],
        loading: false,
        err: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCarts.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCarts.fulfilled, (state, action) => {
                state.carts = action.payload.data;
                state.loading = false;
            })
            .addCase(getCarts.rejected, (state) => {
                state.loading = false;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                toast.success(action.payload.message)
            })
            .addCase(deleteCart.fulfilled, (state, action) => {
                toast.success(action.payload.message)
            })
            .addCase(deleteCarts.fulfilled, (state, action) => {
                toast.success(action.payload.message)
            })
            .addCase(updateCart.fulfilled, (state, action) => {
                toast.success(action.payload.message)
            })
    }
});

export default cartSlice.reducer;