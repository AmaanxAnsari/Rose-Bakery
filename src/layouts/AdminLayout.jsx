import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const navItem = "px-4 py-3 rounded-xl text-sm font-medium transition";
  const active = "bg-white text-black";
  const inactive = "text-white/70 hover:text-white hover:bg-white/10";

  return (
    <div className="min-h-screen bg-black flex">
      {/* SIDEBAR */}
      <aside className="hidden md:flex w-64 flex-col border-r border-white/10 bg-zinc-950 p-6">
        <div>
          <h2 className="text-white text-lg font-semibold">Rose Bakery</h2>
          <p className="text-xs text-white/40">Admin Panel</p>
        </div>

        <nav className="mt-8 flex flex-col gap-2">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `${navItem} ${isActive ? active : inactive}`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/customers"
            className={({ isActive }) =>
              `${navItem} ${isActive ? active : inactive}`
            }
          >
            Customers
          </NavLink>

          <NavLink
            to="/admin/entries"
            className={({ isActive }) =>
              `${navItem} ${isActive ? active : inactive}`
            }
          >
            Entries
          </NavLink>

          <NavLink
            to="/admin/ledger"
            className={({ isActive }) =>
              `${navItem} ${isActive ? active : inactive}`
            }
          >
            Ledger
          </NavLink>

          <NavLink
            to="/admin/request-payment"
            className={({ isActive }) =>
              `${navItem} ${isActive ? active : inactive}`
            }
          >
            Request Payment
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
