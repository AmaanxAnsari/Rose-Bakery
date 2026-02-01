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
  {
    path: "/customer/history",
    element: lazy(() => import("../pages/customer/CustomerHistory.jsx")),
    public: false,
    roles: ["user"],
  },
  {
    path: "/customer/payment",
    element: lazy(() => import("../pages/customer/CustomerPayment.jsx")),
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
    path: "/admin/customers",
    element: lazy(() => import("../pages/admin/AdminCustomers.jsx")),
    public: false,
    roles: ["admin"],
  },
  {
    path: "/admin/entries",
    element: lazy(() => import("../pages/admin/AdminEntries.jsx")),
    public: false,
    roles: ["admin"],
  },
  {
    path: "/admin/request-payment",
    element: lazy(() => import("../pages/admin/AdminRequestPayment.jsx")),
    public: false,
    roles: ["admin"],
  },

  {
    path: "/unauthorized",
    element: lazy(() => import("../pages/errors/Unauthorized.jsx")),
    public: true,
  },

  {
    path: "*",
    element: lazy(() => import("../pages/errors/NotFound.jsx")),
    public: true,
  },
];
