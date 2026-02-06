import { configureStore } from '@reduxjs/toolkit'

// Public slices......
import UserSlice from './publicSlices/UserSlice';
import ProductSlice from './publicSlices/ProductsSlice'
import CartSlice from './publicSlices/CartSlice'
import CouponSlice from './publicSlices/CouponSlice'
import OrderSlice from './publicSlices/OrderSlice'
import ReturnSlice from './publicSlices/ReturnSlice'
import WishlistSlice from './publicSlices/WishlistSlice'

// Admin slices.....
import UsersAdminSlice from './adminSlices/UsersSlice'

export const store = configureStore({
    reducer: {
        // Public slices.......
        userSlice: UserSlice,
        productsSlice: ProductSlice,
        cartSlice: CartSlice,
        couponSlice: CouponSlice,
        orderSlice: OrderSlice,
        returnSlice: ReturnSlice,
        wishlistSlice: WishlistSlice,

        // Admin slices......
        usersAdminSlice: UsersAdminSlice
    }
})