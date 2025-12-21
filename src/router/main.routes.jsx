import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import {
  Home,
  SignIn,
  SignUp,
  ForgotPassword,
  ResetPassword,
  Cart,
  Checkout,
  Payment,
  Product,
  Account,
  Address,
  Order,
  Profile,
  Returns,
  Wishlist
} from "../pages/index.js";

const router = createBrowserRouter([
  {
    element: <App />,
    path: "/",
    children: [
      {
        element: <Home />,
        path: "",
      },
      {
        element: <Cart />,
        path: "/cart"
      },
      {
        element: <Checkout />,
        path: "/checkout"
      },
      {
        element: <Payment />,
        path: "/payment/:orderid"
      },
      {
        element: <Product />,
        path: "/product/:slug"
      }, {
        element: <Account />,
        path: "/account",
        children: [
          {
            element: <Profile />,
            path: ""
          },
          {
            element: <Address />,
            path: "address"
          },
          {
            element: <Order />,
            path: "orders"
          },
          {
            element: <Returns />,
            path: "returns"
          },
          {
            element: <Wishlist />,
            path: "wishlist"
          }
        ]
      }
    ],
  },
  {
    element: <SignIn />,
    path: "login",
  },
  {
    element: <SignUp />,
    path: "register",
  },
  {
    element: <ForgotPassword />,
    path: "forgot-password",
  },
  {
    element: <ResetPassword />,
    path: "reset-password/:token",
  },
]);

export default router;
