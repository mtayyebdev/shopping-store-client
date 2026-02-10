import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router/main.routes.jsx";
import { store } from "./store/Store.jsx";
import { Provider, useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'

// get data....
import { getUser } from "./store/publicSlices/UserSlice.jsx";
import { getCarts } from "./store/publicSlices/CartSlice.jsx";
import { getOrders } from "./store/publicSlices/OrderSlice.jsx";
import { getReturns } from "./store/publicSlices/ReturnSlice.jsx";
import { getWishlist } from "./store/publicSlices/WishlistSlice.jsx";

function GlobalDataLoader({ children }) {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.userSlice);

  useEffect(() => {
    dispatch(getUser());

    if (isLoggedIn) {
      dispatch(getCarts());
      dispatch(getOrders());
      dispatch(getReturns());
      dispatch(getWishlist());
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
