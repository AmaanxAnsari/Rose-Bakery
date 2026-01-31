import { lazy } from "react";

export const ROUTES = [
  {
    path: "/",
    element: lazy(() => import("../pages/home/Home.jsx")),
    public: true,
  },
  {
    path: "/login",
    element: lazy(() => import("../pages/auth/Login.jsx")),
    public: true,
  },

  // Customer
  {
    path: "/customer/dashboard",
    element: lazy(() => import("../pages/customer/CustomerDashboard.jsx")),
    public: false,
    roles: ["user"],
  },

  // Admin
  {
    path: "/admin/dashboard",
    element: lazy(() => import("../pages/admin/AdminDashboard.jsx")),
    public: false,
    roles: ["admin"],
  },

  {
    path: "/unauthorized",
    element: lazy(() => import("../pages/auth/Unauthorized.jsx")),
    public: true,
  },

  {
    path: "*",
    element: lazy(() => import("../pages/auth/NotFound.jsx")),
    public: true,
  },
];
