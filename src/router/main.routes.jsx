import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { Home, SignIn, SignUp } from "../pages/index.js";

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
]);

export default router;
