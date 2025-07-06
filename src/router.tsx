import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";

import LoginPage from "./pages/Login/Login";
import Dashboard from "./layouts/Dashboard";
import NonAuth from "./layouts/NonAuth";
import Root from "./layouts/Root";
import UsersPage from "./pages/users/UsersPage";
import TenantPage from "./pages/tenants/TenantsPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />, //First it is going to display this this page
    children: [
      
      {
        path: "",
        element: <Dashboard />, //First it is going to display this this page
        children: [
          {
            path: "",
            element: <HomePage />,
          },
            {
            path: "/users",
            element: <UsersPage />,
          },
           {
            path: "/restaurants",
            element: <TenantPage/>
          },
        ],
      },

      {
        path: "/auth",
        element: <NonAuth />, //First it is going to display this this page
        children: [
          {
            path: "login",
            element: <LoginPage />,
          },
        ],
      },

    ],
  },
]);
