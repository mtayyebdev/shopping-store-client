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
import DeliveryBoySlice from './publicSlices/DeliveryBoySlice'
import PaymentsSlice from './publicSlices/PaymentsSlice'

// Admin slices.....
import UsersAdminSlice from './adminSlices/UsersSlice'
import ProductsAdminSlice from './adminSlices/ProductsSlice'
import CategoryAdminSlice from './adminSlices/CategorySlice'
import CouponsAdminSlice from './adminSlices/CouponsSlice'
import OrdersAdminSlice from './adminSlices/OrdersSlice'
import ReturnsAdminSlice from './adminSlices/ReturnsSlice'
import DeliveryBoyAdminSlice from './adminSlices/DeliveryBoySlice'
import StoreSettingAdminSlice from './adminSlices/StoreSettingSlice'
import PaymentSettingAdminSlice from './adminSlices/PaymentSettingSlice'

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
        deliveryBoySlice: DeliveryBoySlice,
        paymentsSlice: PaymentsSlice,

        // Admin slices......
        usersAdminSlice: UsersAdminSlice,
        productsAdminSlice: ProductsAdminSlice,
        categoryAdminSlice: CategoryAdminSlice,
        couponsAdminSlice: CouponsAdminSlice,
        ordersAdminSlice: OrdersAdminSlice,
        returnsAdminSlice: ReturnsAdminSlice,
        deliveryBoyAdminSlice: DeliveryBoyAdminSlice,
        storeSettingAdminSlice: StoreSettingAdminSlice,
        paymentSettingAdminSlice: PaymentSettingAdminSlice
    }
})