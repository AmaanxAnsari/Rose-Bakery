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
  {
    path: "/customer",
    element: lazy(() => import("../layouts/CustomerLayout.jsx")),
    public: false,
    roles: ["user"],
    children: [
      {
        path: "dashboard",
        element: lazy(() => import("../pages/customer/CustomerDashboard.jsx")),
      },
      {
        path: "history",
        element: lazy(() => import("../pages/customer/CustomerHistory.jsx")),
      },
      {
        path: "payment",
        element: lazy(() => import("../pages/customer/CustomerPayment.jsx")),
      },
    ],
  },

  // Customer
  // {
  //   path: "/customer/dashboard",
  //   element: lazy(() => import("../pages/customer/CustomerDashboard.jsx")),
  //   public: false,
  //   roles: ["user"],
  // },
  // {
  //   path: "/customer/history",
  //   element: lazy(() => import("../pages/customer/CustomerHistory.jsx")),
  //   public: false,
  //   roles: ["user"],
  // },
  // {
  //   path: "/customer/payment",
  //   element: lazy(() => import("../pages/customer/CustomerPayment.jsx")),
  //   public: false,
  //   roles: ["user"],
  // },

  // Admin
  {
    path: "/admin",
    element: lazy(() => import("../layouts/AdminLayout.jsx")),
    public: false,
    roles: ["admin"],
    children: [
      {
        path: "dashboard",
        element: lazy(() => import("../pages/admin/AdminDashboard.jsx")),
      },
      {
        path: "customers",
        element: lazy(() => import("../pages/admin/AdminCustomers.jsx")),
      },
      {
        path: "entries",
        element: lazy(() => import("../pages/admin/AdminEntries.jsx")),
      },
      {
        path: "ledger",
        element: lazy(() => import("../pages/admin/AdminLedger.jsx")),
      },
      {
        path: "request-payment",
        element: lazy(() => import("../pages/admin/AdminRequestPayment.jsx")),
      },
    ],
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
