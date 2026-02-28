import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ListOrdered,
  BookOpen,
  CreditCard,
  Menu,
  ChevronLeft,
} from "lucide-react";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const baseItem =
    "flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200";

  const active = "bg-white text-black shadow-sm";
  const inactive = "text-white/70 hover:text-white hover:bg-white/10";

  return (
    <div className="min-h-screen bg-black flex">
      {/* SIDEBAR */}
      <aside
        className={`
          ${collapsed ? "w-16" : "w-64"}
          hidden md:flex flex-col
          border-r border-white/10
          bg-zinc-950 p-4
          transition-all duration-300
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h2 className="text-white text-lg font-semibold">Rose Bakery</h2>
              <p className="text-xs text-white/40">Admin Panel</p>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`text-white hover:text-white/70 transition ${collapsed ? "justify-center mx-auto" : ""}`}
          >
            {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="mt-8 flex flex-col gap-3">
          {/* DASHBOARD */}
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `
              ${baseItem}
              ${collapsed ? "justify-center h-10 w-10 mx-auto" : "px-4 py-3"}
              ${isActive ? active : inactive}
              `
            }
          >
            <LayoutDashboard size={18} />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>

          {/* CUSTOMERS */}
          <NavLink
            to="/admin/customers"
            className={({ isActive }) =>
              `
              ${baseItem}
              ${collapsed ? "justify-center h-10 w-10 mx-auto" : "px-4 py-3"}
              ${isActive ? active : inactive}
              `
            }
          >
            <Users size={18} />
            {!collapsed && <span>Customers</span>}
          </NavLink>

          {/* ENTRIES */}
          <NavLink
            to="/admin/entries"
            className={({ isActive }) =>
              `
              ${baseItem}
              ${collapsed ? "justify-center h-10 w-10 mx-auto" : "px-4 py-3"}
              ${isActive ? active : inactive}
              `
            }
          >
            <ListOrdered size={18} />
            {!collapsed && <span>Entries</span>}
          </NavLink>

          {/* LEDGER */}
          <NavLink
            to="/admin/ledger"
            className={({ isActive }) =>
              `
              ${baseItem}
              ${collapsed ? "justify-center h-10 w-10 mx-auto" : "px-4 py-3"}
              ${isActive ? active : inactive}
              `
            }
          >
            <BookOpen size={18} />
            {!collapsed && <span>Ledger</span>}
          </NavLink>

          {/* REQUEST PAYMENT */}
          <NavLink
            to="/admin/request-payment"
            className={({ isActive }) =>
              `
              ${baseItem}
              ${collapsed ? "justify-center h-10 w-10 mx-auto" : "px-4 py-3"}
              ${isActive ? active : inactive}
              `
            }
          >
            <CreditCard size={18} />
            {!collapsed && <span>Request Payment</span>}
          </NavLink>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
