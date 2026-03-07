import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import "./index.css";
import "quill/dist/quill.snow.css";
import { RouterProvider } from "react-router-dom";
import router from "./router/main.routes.jsx";
import { store } from "./store/Store.jsx";
import { Provider, useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { socket } from "./socket.js";

// get data....
import { getUser } from "./store/publicSlices/UserSlice.jsx";
import { getCarts } from "./store/publicSlices/CartSlice.jsx";
import { getOrders } from "./store/publicSlices/OrderSlice.jsx";
import { getReturns } from "./store/publicSlices/ReturnSlice.jsx";
import { getWishlist } from "./store/publicSlices/WishlistSlice.jsx";

// get admin data...
import { getCategories as AdminCategories } from './store/adminSlices/CategorySlice.jsx'
import { getCoupons as AdminCoupons } from './store/adminSlices/CouponsSlice.jsx'
import { getUsers as AdminUsers } from "./store/adminSlices/UsersSlice.jsx";
import { getOrders as AdminOrders } from "./store/adminSlices/OrdersSlice.jsx";
import { getReturns as AdminReturns } from "./store/adminSlices/ReturnsSlice.jsx";
import { getProducts as AdminProducts } from "./store/adminSlices/ProductsSlice.jsx";

function GlobalDataLoader({ children }) {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.userSlice);

  useEffect(() => {
    const data = {
      name: "Tayyeb",
      age: 17
    }
    socket.emit("newOrder", data)

    return () => {
      socket.disconnect();
    }
  }, [])

  useEffect(() => {
    dispatch(getUser());

    if (isLoggedIn) {
      dispatch(getCarts());
      dispatch(getOrders());
      dispatch(getReturns());
      dispatch(getWishlist());
    }

    if (isLoggedIn && user?.role === "admin") {
      dispatch(AdminCategories({ page: 1, limit: 15, search: "" }))
      dispatch(AdminCoupons({ page: 1, limit: 15, search: "" }))
      dispatch(AdminOrders({ page: 1, limit: 15, search: "" }))
      dispatch(AdminProducts({ page: 1, limit: 15, searchName: "" }))
      dispatch(AdminReturns({ page: 1, limit: 15, search: "" }))
      dispatch(AdminUsers({ page: 1, limit: 15, search: "" }))
    }
  }, [dispatch, isLoggedIn]);

  return children;
}

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ToastContainer autoClose={3000} />
    <GlobalDataLoader>
      <RouterProvider router={router} />
    </GlobalDataLoader>
  </Provider>
);
