import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import {
  Home,
  SignIn,
  SignUp,
  ForgotPassword,
  ResetPassword,
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
