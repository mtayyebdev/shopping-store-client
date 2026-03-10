import { createBrowserRouter } from "react-router-dom";
import App from "../App";

// public customer pages...........
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
  Wishlist,
  Shop,
  OrderDetails
} from "../pages/index.js";

// private admin pages............
import { Root, CreateProduct, Customers, Dashboard, Notifications, Orders, Products, Settings, DeliveryBoys, Coupons, ReturnsDashboard, Categories } from '../pages/dashboard/index.js'

// private Delivery boy pages...........
import { Root as RiderRoot, Dashboard as RiderDashboard, Login as RiderLogin, Orders as RiderOrders } from '../pages/rider dashboard/index.js'

// protected and admin routes..........
import { ProtectedRoute, AdminRoute, RiderRoute } from "../components/index.js";

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
        element: <ProtectedRoute><Cart /></ProtectedRoute>,
        path: "/cart"
      },
      {
        element: <ProtectedRoute><Checkout /></ProtectedRoute>,
        path: "/checkout"
      },
      {
        element: <ProtectedRoute><Payment /></ProtectedRoute>,
        path: "/payment/:orderid"
      },
      {
        element: <Product />,
        path: "/product/:slug"
      },
      {
        element: <Shop />,
        path: "/shop"
      },
      {
        element: <ProtectedRoute><Account /></ProtectedRoute>,
        path: "/account",
        children: [
          {
            element: <ProtectedRoute><Profile /></ProtectedRoute>,
            path: ""
          },
          {
            element: <ProtectedRoute><Address /></ProtectedRoute>,
            path: "address"
          },
          {
            element: <ProtectedRoute><Order /></ProtectedRoute>,
            path: "orders"
          },
          {
            element: <ProtectedRoute><Returns /></ProtectedRoute>,
            path: "returns"
          },
          {
            element: <ProtectedRoute><Wishlist /></ProtectedRoute>,
            path: "wishlist"
          },
          {
            element: <ProtectedRoute><OrderDetails /></ProtectedRoute>,
            path: "order/:orderId"
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
  {
    element: <AdminRoute><Root /></AdminRoute>,
    path: "web-admin",
    children: [
      {
        element: <Dashboard />,
        path: ""
      },
      {
        element: <Products />,
        path: "products"
      },
      {
        element: <CreateProduct />,
        path: "create-product"
      },
      {
        element: <Orders />,
        path: "orders"
      },
      {
        element: <DeliveryBoys />,
        path: "delivery-boys"
      },
      {
        element: <Customers />,
        path: "customers"
      },
      {
        element: <Notifications />,
        path: "notifications"
      },
      {
        element: <Settings />,
        path: "settings"
      },
      {
        element: <Coupons />,
        path: "coupons"
      },
      {
        element: <ReturnsDashboard />,
        path: "returns"
      },
      {
        element: <Categories />,
        path: "categories"
      }
    ]
  },
  {
    element: <RiderLogin />,
    path: "login-rider"
  },
  {
    element: <RiderRoute><RiderRoot /></RiderRoute>,
    path: "web-rider",
    children: [
      {
        element: <RiderDashboard />,
        path: ""
      },
      {
        element: <RiderOrders />,
        path: "orders"
      }
    ]
  }
]);

export default router;
