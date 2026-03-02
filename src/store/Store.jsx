import { configureStore } from '@reduxjs/toolkit'

// Public slices......
import UserSlice from './publicSlices/UserSlice';
import ProductSlice from './publicSlices/ProductsSlice'
import CartSlice from './publicSlices/CartSlice'
import CouponSlice from './publicSlices/CouponSlice'
import OrderSlice from './publicSlices/OrderSlice'
import ReturnSlice from './publicSlices/ReturnSlice'
import WishlistSlice from './publicSlices/WishlistSlice'
import CategorySlice from './publicSlices/CategorySlice'

// Admin slices.....
import UsersAdminSlice from './adminSlices/UsersSlice'
import ProductsAdminSlice from './adminSlices/ProductsSlice'
import CategoryAdminSlice from './adminSlices/CategorySlice'
import CouponsAdminSlice from './adminSlices/CouponsSlice'
import OrdersAdminSlice from './adminSlices/OrdersSlice'
import ReturnsAdminSlice from './adminSlices/ReturnsSlice'

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
        categorySlice: CategorySlice,

        // Admin slices......
        usersAdminSlice: UsersAdminSlice,
        productsAdminSlice: ProductsAdminSlice,
        categoryAdminSlice: CategoryAdminSlice,
        couponsAdminSlice: CouponsAdminSlice,
        ordersAdminSlice: OrdersAdminSlice,
        returnsAdminSlice: ReturnsAdminSlice
    }
})