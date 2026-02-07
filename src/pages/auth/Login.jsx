
// import { useState } from "react";
// import Input from "../../components/common/Input";
// import Button from "../../components/common/Button";
// import { isValidCustomerId, isValidPasscode } from "../../lib/validators";
// import { customerService } from "../../services";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { loginSuccess } from "../../api/authSlice";
// import { adminLogin } from "../../services/auth/adminAuth.service";

// export default function Login() {
//   const [mode, setMode] = useState("customer"); // customer | admin
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // customer
//   const [customerId, setCustomerId] = useState("");
//   const [passcode, setPasscode] = useState("");

//   // admin (for now mocked)
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [toast, setToast] = useState({ type: "", message: "" });
//   const [loading, setLoading] = useState(false);

//   async function handleCustomerLogin() {
//     setToast({ type: "", message: "" });

//     if (!isValidCustomerId(customerId)) {
//       setToast({ type: "error", message: "Customer ID must be like ROSE001" });
//       return;
//     }
//     if (!isValidPasscode(passcode)) {
//       setToast({ type: "error", message: "Passcode must be 4 digits" });
//       return;
//     }

//     setLoading(true);
//     const res = await customerService.verifyCustomerPasscode(
//       customerId,
//       passcode,
//     );
//     setLoading(false);

//     if (!res.ok) {
//       setToast({ type: "error", message: res.message || "Login failed" });
//       return;
//     }

//     dispatch(
//       loginSuccess({
//         user: { id: res.customer.customerId, name: res.customer.name },
//         roles: ["user"],
//       }),
//     );

//     navigate("/customer/dashboard");
//   }

//   async function handleAdminLogin() {
//   setToast({ type: "", message: "" });

//   if (!email || !password) {
//     setToast({ type: "error", message: "Enter admin email and password" });
//     return;
//   }

//   try {
//     setLoading(true);
//     await adminLogin(email, password);
//     setLoading(false);

//     dispatch(
//       loginSuccess({
//         user: { id: "admin", name: "Admin" },
//         roles: ["admin"],
//       })
//     );

//     navigate("/admin/dashboard");
//   } catch (err) {
//     setLoading(false);
//     setToast({ type: "error", message: err.message });
//   }
// }



//   return (
//     <div className="min-h-[calc(100vh-140px)] bg-black">
//       <div className="mx-auto max-w-2xl px-4 py-10">
//         <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
//           <h1 className="text-2xl font-semibold text-white">Login</h1>
//           <p className="mt-2 text-sm text-white/60">
//             Customers use ID + 4-digit passcode. Admin uses email/password.
//           </p>

//           <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
//             <button
//               className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
//                 mode === "customer"
//                   ? "bg-white text-black"
//                   : "text-white/70 hover:text-white"
//               }`}
//               onClick={() => setMode("customer")}
//             >
//               Customer
//             </button>
//             <button
//               className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
//                 mode === "admin"
//                   ? "bg-white text-black"
//                   : "text-white/70 hover:text-white"
//               }`}
//               onClick={() => setMode("admin")}
//             >
//               Admin
//             </button>
//           </div>

//           <div className="mt-6">
//             {mode === "customer" ? (
//               <div className="space-y-4">
//                 <Input
//                   label="Customer ID"
//                   placeholder="ROSE001"
//                   value={customerId}
//                   prefix="ROSE"
//                   onChange={(e) => setCustomerId(e.target.value.toUpperCase())}
//                 />
//                 <Input
//                   label="4-digit Passcode"
//                   placeholder="••••"
//                   maxLength={4}
//                   inputMode="numeric"
//                   value={passcode}
//                   onChange={(e) =>
//                     setPasscode(e.target.value.replace(/\D/g, ""))
//                   }
//                 />
//                 <Button
//                   className="w-full py-3"
//                   disabled={loading}
//                   onClick={handleCustomerLogin}
//                 >
//                   {loading ? "Logging in..." : "Login as Customer"}
//                 </Button>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 <Input
//                   label="Admin Email"
//                   placeholder="admin@rosebakery.com"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <Input
//                   label="Password"
//                   placeholder="••••••••"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <Button
//                   className="w-full py-3"
//                   disabled={loading}
//                   onClick={handleAdminLogin}
//                 >
//                   {loading ? "Logging in..." : "Login as Admin"}
//                 </Button>

                
//               </div>
//             )}
//           </div>

//           {toast.message ? (
//             <div
//               className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
//                 toast.type === "success"
//                   ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
//                   : "border-red-500/30 bg-red-500/10 text-red-200"
//               }`}
//             >
//               {toast.message}
//             </div>
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { isValidPasscode } from "../../lib/validators";
import { customerService } from "../../services";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../api/authSlice";
import { adminLogin } from "../../services/auth/adminAuth.service";

export default function Login() {
  const PREFIX = "ROSE";

  const [mode, setMode] = useState("customer");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // customer
  const [customerSuffix, setCustomerSuffix] = useState("");
  const [passcode, setPasscode] = useState("");

  // admin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [toast, setToast] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const customerId = `${PREFIX}${customerSuffix}`;

  // 🔥 CUSTOMER LOGIN
  async function handleCustomerLogin() {
    setToast({ type: "", message: "" });

    if (customerSuffix.length !== 3) {
      setToast({ type: "error", message: "Enter 3 digit customer ID" });
      return;
    }

    if (!isValidPasscode(passcode)) {
      setToast({ type: "error", message: "Passcode must be 4 digits" });
      return;
    }

    setLoading(true);
    const res = await customerService.verifyCustomerPasscode(
      customerId,
      passcode,
    );
    setLoading(false);

    if (!res.ok) {
      setToast({ type: "error", message: res.message || "Login failed" });
      return;
    }

    dispatch(
      loginSuccess({
        user: { id: res.customer.customerId, name: res.customer.name },
        roles: ["user"],
      }),
    );

    navigate("/customer/dashboard");
  }

  // 🔥 ADMIN LOGIN
  async function handleAdminLogin() {
    setToast({ type: "", message: "" });

    if (!email || !password) {
      setToast({ type: "error", message: "Enter admin email and password" });
      return;
    }

    try {
      setLoading(true);
      await adminLogin(email, password);
      setLoading(false);

      dispatch(
        loginSuccess({
          user: { id: "admin", name: "Admin" },
          roles: ["admin"],
        }),
      );

      navigate("/admin/dashboard");
    } catch (err) {
      setLoading(false);
      setToast({ type: "error", message: err.message });
    }
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-black">
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
          <h1 className="text-2xl font-semibold text-white">Login</h1>
          <p className="mt-2 text-sm text-white/60">
            Customers use ID + passcode. Admin uses email/password.
          </p>

          {/* TOGGLE */}
          <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
            <button
              className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                mode === "customer"
                  ? "bg-white text-black"
                  : "text-white/70 hover:text-white"
              }`}
              onClick={() => setMode("customer")}
            >
              Customer
            </button>

            <button
              className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                mode === "admin"
                  ? "bg-white text-black"
                  : "text-white/70 hover:text-white"
              }`}
              onClick={() => setMode("admin")}
            >
              Admin
            </button>
          </div>

          <div className="mt-6">
            {mode === "customer" ? (
              <div className="space-y-4">
                {/* CUSTOMER ID WITH PREFIX */}
                <div>
                  <label className="mb-2 block text-xs text-white/70">
                    Customer ID
                  </label>

                  <div className="flex">
                    <div className="rounded-l-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white">
                      {PREFIX}
                    </div>

                    <input
                      className="w-full rounded-r-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                      placeholder="001"
                      maxLength={3}
                      inputMode="numeric"
                      value={customerSuffix}
                      onChange={(e) =>
                        setCustomerSuffix(
                          e.target.value.replace(/\D/g, "").slice(0, 3),
                        )
                      }
                    />
                  </div>
                </div>

                <Input
                  label="4-digit Passcode"
                  placeholder="••••"
                  maxLength={4}
                  inputMode="numeric"
                  value={passcode}
                  onChange={(e) =>
                    setPasscode(e.target.value.replace(/\D/g, ""))
                  }
                />

                <Button
                  className="w-full py-3"
                  disabled={loading}
                  onClick={handleCustomerLogin}
                >
                  {loading ? "Logging in..." : "Login as Customer"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Input
                  label="Admin Email"
                  placeholder="admin@rosebakery.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  label="Password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button
                  className="w-full py-3"
                  disabled={loading}
                  onClick={handleAdminLogin}
                >
                  {loading ? "Logging in..." : "Login as Admin"}
                </Button>
              </div>
            )}
          </div>

          {/* TOAST */}
          {toast.message && (
            <div
              className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
                toast.type === "success"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                  : "border-red-500/30 bg-red-500/10 text-red-200"
              }`}
            >
              {toast.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
