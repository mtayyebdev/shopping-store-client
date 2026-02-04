import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router/main.routes.jsx";
import { store } from "./store/Store.jsx";
import { Provider } from 'react-redux'
import {ToastContainer} from 'react-toastify'

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <ToastContainer autoClose={3000}/>
    <RouterProvider router={router} />
  </Provider>
);
