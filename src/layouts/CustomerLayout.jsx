// // import { useState } from "react";
// // import { NavLink, Outlet } from "react-router-dom";
// // import {
// //   LayoutDashboard,
// //   History,
// //   CreditCard,
// //   Menu,
// //   ChevronLeft,
// // } from "lucide-react";

// // export default function CustomerLayout() {
// //   const [collapsed, setCollapsed] = useState(false);

// //   const baseItem =
// //     "flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200";

// //   const active = "bg-white text-black shadow-sm";

// //   const inactive = "text-white/70 hover:text-white hover:bg-white/10";

// //   return (
// //     <div className="min-h-screen bg-black flex">
// //       {/* SIDEBAR */}
// //       <aside
// //         className={`
// //           ${collapsed ? "w-16" : "w-60"}
// //           hidden md:flex flex-col
// //           border-r border-white/10
// //           bg-zinc-950 p-4
// //           transition-all duration-300
// //         `}
// //       >
// //         {/* Header */}
// //         <div className="flex items-center justify-between">
// //           {!collapsed && (
// //             <div>
// //               <h2 className="text-white text-lg font-semibold">Rose Bakery</h2>
// //               <p className="text-xs text-white/40">Customer</p>
// //             </div>
// //           )}

// //           <button
// //             onClick={() => setCollapsed(!collapsed)}
// //             className={`text-white hover:text-white/70 transition ${collapsed ? "justify-center mx-auto" : ""}`}
// //           >
// //             {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
// //           </button>
// //         </div>

// //         {/* NAVIGATION */}
// //         <nav className="mt-8 flex flex-col gap-3">
// //           {/* DASHBOARD */}
// //           <NavLink
// //             to="/customer/dashboard"
// //             className={({ isActive }) =>
// //               `
// //               ${baseItem}
// //               ${collapsed ? "justify-center h-10 w-10 mx-auto" : "px-4 py-3"}
// //               ${isActive ? active : inactive}
// //               `
// //             }
// //           >
// //             <LayoutDashboard size={18} />
// //             {!collapsed && <span>Dashboard</span>}
// //           </NavLink>

// //           {/* HISTORY */}
// //           <NavLink
// //             to="/customer/history"
// //             className={({ isActive }) =>
// //               `
// //               ${baseItem}
// //               ${collapsed ? "justify-center h-10 w-10 mx-auto" : "px-4 py-3"}
// //               ${isActive ? active : inactive}
// //               `
// //             }
// //           >
// //             <History size={18} />
// //             {!collapsed && <span>History</span>}
// //           </NavLink>

// //           {/* PAYMENT */}
// //           <NavLink
// //             to="/customer/payment"
// //             className={({ isActive }) =>
// //               `
// //               ${baseItem}
// //               ${collapsed ? "justify-center h-10 w-10 mx-auto" : "px-4 py-3"}
// //               ${isActive ? active : inactive}
// //               `
// //             }
// //           >
// //             <CreditCard size={18} />
// //             {!collapsed && <span>Payment</span>}
// //           </NavLink>
// //         </nav>
// //       </aside>

// //       {/* MAIN CONTENT */}
// //       <main className="flex-1 p-6">
// //         <Outlet />
// //       </main>
// //     </div>
// //   );
// // }
// import { useState } from "react";
// import { NavLink, Outlet } from "react-router-dom";
// import {
//   LayoutDashboard,
//   History,
//   CreditCard,
//   Menu,
//   X,
//   ChevronLeft,
// } from "lucide-react";

// export default function CustomerLayout() {
//   const [collapsed, setCollapsed] = useState(false);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   const baseItem =
//     "flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200";

//   const active = "bg-white text-black shadow-sm";
//   const inactive = "text-white/70 hover:text-white hover:bg-white/10";

//   const closeMobile = () => setMobileOpen(false);

//   return (
//     <div className="min-h-screen bg-black flex">
//       {/* ===== DESKTOP SIDEBAR ===== */}
//       <aside
//         className={`
//           hidden md:flex
//           ${collapsed ? "w-16" : "w-60"}
//           flex-col
//           border-r border-white/10
//           bg-zinc-950 p-4
//           transition-all duration-300
//         `}
//       >
//         <div className="flex items-center justify-between">
//           {!collapsed && (
//             <div>
//               <h2 className="text-white text-lg font-semibold">Rose Bakery</h2>
//               <p className="text-xs text-white/40">Customer</p>
//             </div>
//           )}

//           <button
//             onClick={() => setCollapsed(!collapsed)}
//             className="text-white"
//           >
//             {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
//           </button>
//         </div>

//         <nav className="mt-8 flex flex-col gap-3">
//           <NavLink
//             to="/customer/dashboard"
//             className={({ isActive }) =>
//               `${baseItem} px-4 py-3 ${isActive ? active : inactive}`
//             }
//           >
//             <LayoutDashboard size={18} />
//             {!collapsed && <span>Dashboard</span>}
//           </NavLink>

//           <NavLink
//             to="/customer/history"
//             className={({ isActive }) =>
//               `${baseItem} px-4 py-3 ${isActive ? active : inactive}`
//             }
//           >
//             <History size={18} />
//             {!collapsed && <span>History</span>}
//           </NavLink>

//           <NavLink
//             to="/customer/payment"
//             className={({ isActive }) =>
//               `${baseItem} px-4 py-3 ${isActive ? active : inactive}`
//             }
//           >
//             <CreditCard size={18} />
//             {!collapsed && <span>Payment</span>}
//           </NavLink>
//         </nav>
//       </aside>

//       {/* ===== MOBILE DRAWER ===== */}
//       {mobileOpen && (
//         <>
//           <div
//             onClick={closeMobile}
//             className="fixed inset-0 bg-black/60 z-40 md:hidden"
//           />

//           <aside className="fixed top-0 left-0 h-full w-64 bg-zinc-950 p-4 border-r border-white/10 z-50 md:hidden">
//             <div className="flex justify-between items-center">
//               <h2 className="text-white font-semibold">Rose Bakery</h2>
//               <button onClick={closeMobile} className="text-white">
//                 <X size={20} />
//               </button>
//             </div>

//             <nav className="mt-8 flex flex-col gap-3">
//               <NavLink
//                 to="/customer/dashboard"
//                 onClick={closeMobile}
//                 className={({ isActive }) =>
//                   `${baseItem} px-4 py-3 ${isActive ? active : inactive}`
//                 }
//               >
//                 <LayoutDashboard size={18} />
//                 <span>Dashboard</span>
//               </NavLink>

//               <NavLink
//                 to="/customer/history"
//                 onClick={closeMobile}
//                 className={({ isActive }) =>
//                   `${baseItem} px-4 py-3 ${isActive ? active : inactive}`
//                 }
//               >
//                 <History size={18} />
//                 <span>History</span>
//               </NavLink>

//               <NavLink
//                 to="/customer/payment"
//                 onClick={closeMobile}
//                 className={({ isActive }) =>
//                   `${baseItem} px-4 py-3 ${isActive ? active : inactive}`
//                 }
//               >
//                 <CreditCard size={18} />
//                 <span>Payment</span>
//               </NavLink>
//             </nav>
//           </aside>
//         </>
//       )}

//       {/* ===== MAIN CONTENT ===== */}
//       <main className="flex-1 w-full">
//         {/* Mobile Menu Button (does NOT replace your header) */}
//         <div className="md:hidden p-4">
//           <button onClick={() => setMobileOpen(true)} className="text-white">
//             <Menu size={22} />
//           </button>
//         </div>

//         <div className="px-6 pb-6">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// }
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  History,
  CreditCard,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";

export default function CustomerLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const baseItem =
    "flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200";

  const active = "bg-white text-black shadow-sm";
  const inactive = "text-white/70 hover:text-white hover:bg-white/10";

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-black flex">
      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside
        className={`
          hidden md:flex flex-col
          ${collapsed ? "w-20" : "w-60"}
          border-r border-white/10
          bg-zinc-950 p-4
          transition-all duration-300
        `}
      >
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h2 className="text-white text-lg font-semibold">Rose Bakery</h2>
              <p className="text-xs text-white/40">Customer</p>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white"
          >
            {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="mt-8 flex flex-col gap-3">
          <NavLink
            to="/customer/dashboard"
            className={({ isActive }) =>
              `${baseItem} ${
                collapsed ? "justify-center p-3" : "px-4 py-3"
              } ${isActive ? active : inactive}`
            }
          >
            <LayoutDashboard size={18} />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>

          <NavLink
            to="/customer/history"
            className={({ isActive }) =>
              `${baseItem} ${
                collapsed ? "justify-center p-3" : "px-4 py-3"
              } ${isActive ? active : inactive}`
            }
          >
            <History size={18} />
            {!collapsed && <span>History</span>}
          </NavLink>

          <NavLink
            to="/customer/payment"
            className={({ isActive }) =>
              `${baseItem} ${
                collapsed ? "justify-center p-3" : "px-4 py-3"
              } ${isActive ? active : inactive}`
            }
          >
            <CreditCard size={18} />
            {!collapsed && <span>Payment</span>}
          </NavLink>
        </nav>
      </aside>

      {/* ===== MOBILE DRAWER ===== */}
      {mobileOpen && (
        <>
          <div
            onClick={closeMobile}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
          />

          <aside className="fixed top-0 left-0 h-full w-64 bg-zinc-950 p-4 border-r border-white/10 z-50 md:hidden">
            <div className="flex justify-between items-center">
              <h2 className="text-white font-semibold">Rose Bakery</h2>
              <button onClick={closeMobile} className="text-white">
                <X size={20} />
              </button>
            </div>

            <nav className="mt-8 flex flex-col gap-3">
              <NavLink
                to="/customer/dashboard"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `${baseItem} px-4 py-3 ${isActive ? active : inactive}`
                }
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/customer/history"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `${baseItem} px-4 py-3 ${isActive ? active : inactive}`
                }
              >
                <History size={18} />
                <span>History</span>
              </NavLink>

              <NavLink
                to="/customer/payment"
                onClick={closeMobile}
                className={({ isActive }) =>
                  `${baseItem} px-4 py-3 ${isActive ? active : inactive}`
                }
              >
                <CreditCard size={18} />
                <span>Payment</span>
              </NavLink>
            </nav>
          </aside>
        </>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 w-full">
        <div className="md:hidden p-4">
          <button onClick={() => setMobileOpen(true)} className="text-white">
            <Menu size={22} />
          </button>
        </div>

        <div className="px-6 pb-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}