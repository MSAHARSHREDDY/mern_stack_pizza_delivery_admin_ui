import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";

import LoginPage from "./pages/Login/Login";
import Dashboard from "./layouts/Dashboard";
import NonAuth from "./layouts/NonAuth";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,//First it is going to display this this page
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      
    ],
  },


  {
    path: "/auth",
    element: <NonAuth />,//First it is going to display this this page
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
    ],
  },
]);
