// import { useEffect, useMemo, useState } from "react";
// import Button from "../../components/common/Button";
// import Input from "../../components/common/Input";
// import Modal from "../../components/common/Modal";

// import {
//   isValidAmount,
//   isValidCustomerSuffix3,
//   isValidPasscode,
// } from "../../lib/validators";

// import { customerService, creditEntryService } from "../../services";

// function InlineLoader({ label = "Saving..." }) {
//   return (
//     <div className="flex items-center justify-center gap-2">
//       <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
//       <span className="text-sm">{label}</span>
//     </div>
//   );
// }

// export default function Home() {
//   const PREFIX = "ROSE";

//   const [customerSuffix, setCustomerSuffix] = useState("");
//   const [amount, setAmount] = useState("");
//   const [passcode, setPasscode] = useState("");

//   const [openPasscode, setOpenPasscode] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [toast, setToast] = useState({ type: "", message: "" });

//   // Customer preview info
//   const [customerPreview, setCustomerPreview] = useState(null);
//   const [checkingCustomer, setCheckingCustomer] = useState(false);

//   const customerId = `${PREFIX}${customerSuffix}`;

//   const errors = useMemo(() => {
//     const e = {};
//     if (customerSuffix && !isValidCustomerSuffix3(customerSuffix)) {
//       e.customerId = "Enter exactly 3 digits (e.g. 001)";
//     }
//     if (amount && !isValidAmount(amount)) {
//       e.amount = "Enter valid amount";
//     }
//     return e;
//   }, [customerSuffix, amount]);

//   const canSubmit =
//     isValidCustomerSuffix3(customerSuffix) &&
//     isValidAmount(amount) &&
//     !!customerPreview;

//   // Auto check customer when user enters 3 digits
//   useEffect(() => {
//     let active = true;

//     async function checkCustomer() {
//       setToast({ type: "", message: "" });
//       setCustomerPreview(null);

//       if (!isValidCustomerSuffix3(customerSuffix)) return;

//       setCheckingCustomer(true);
//       const customer = await customerService.getCustomerById(customerId);
//       if (!active) return;

//       setCheckingCustomer(false);

//       if (!customer) {
//         setToast({
//           type: "error",
//           message: "Customer ID not found. Please check again.",
//         });
//         setCustomerPreview(null);
//         return;
//       }

//       setCustomerPreview(customer);
//     }

//     checkCustomer();

//     return () => {
//       active = false;
//     };
//   }, [customerSuffix]); // eslint-disable-line react-hooks/exhaustive-deps

//   async function handleOpenPasscode() {
//     setToast({ type: "", message: "" });

//     if (!isValidCustomerSuffix3(customerSuffix)) {
//       setToast({
//         type: "error",
//         message: "Please enter valid 3-digit Customer ID.",
//       });
//       return;
//     }

//     if (!customerPreview) {
//       setToast({
//         type: "error",
//         message: "Customer not found. Please check the ID.",
//       });
//       return;
//     }

//     if (!isValidAmount(amount)) {
//       setToast({ type: "error", message: "Enter a valid amount." });
//       return;
//     }

//     setOpenPasscode(true);
//   }

//   async function handleConfirmPasscode() {
//     setToast({ type: "", message: "" });

//     if (!isValidPasscode(passcode)) {
//       setToast({ type: "error", message: "Passcode must be 4 digits." });
//       return;
//     }

//     setLoading(true);

//     const verify = await customerService.verifyCustomerPasscode(
//       customerId,
//       passcode,
//     );

//     if (!verify.ok) {
//       setLoading(false);
//       setToast({
//         type: "error",
//         message: verify.message || "Invalid passcode",
//       });
//       return;
//     }

//     await creditEntryService.addCreditEntry({
//       customerId,
//       amount,
//       createdBy: "customer",
//     });

//     setLoading(false);
//     setOpenPasscode(false);

//     // reset fields
//     setPasscode("");
//     setAmount("");
//     setCustomerSuffix("");
//     setCustomerPreview(null);

//     setToast({ type: "success", message: "Entry saved successfully ✅" });
//   }

//   return (
//     <div className="min-h-[calc(100vh-140px)] bg-black px-4">
//       <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-6xl items-center justify-center py-10">
//         <div className="w-full max-w-md sm:max-w-lg">
//           <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5 sm:p-6 md:p-7 shadow-2xl">
//             <p className="text-xs font-semibold tracking-wide text-white/50">
//               CUSTOMER ENTRY
//             </p>

//             <h1 className="mt-2 text-xl sm:text-2xl font-semibold text-white">
//               Add today’s credit in seconds.
//             </h1>

//             <p className="mt-2 text-sm text-white/60">
//               Enter your ID digits and amount. Confirm with 4-digit passcode.
//             </p>

//             <div className="mt-6 flex flex-col gap-4">
//               {/* Customer ID */}
//               <div className="w-full">
//                 <label className="mb-2 block text-xs font-medium text-white/70">
//                   Customer ID
//                 </label>

//                 <div className="flex items-stretch gap-2">
//                   <div className="flex items-center rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white select-none">
//                     {PREFIX}
//                   </div>

//                   <input
//                     className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30"
//                     placeholder="001"
//                     inputMode="numeric"
//                     maxLength={3}
//                     value={customerSuffix}
//                     onChange={(e) => {
//                       setCustomerSuffix(
//                         e.target.value.replace(/\D/g, "").slice(0, 3),
//                       );
//                     }}
//                   />
//                 </div>

//                 {errors.customerId ? (
//                   <p className="mt-2 text-xs text-red-400">
//                     {errors.customerId}
//                   </p>
//                 ) : null}

//                 {/* Customer Preview */}
//                 <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
//                   {checkingCustomer ? (
//                     <p className="text-xs text-white/50">
//                       Checking customer...
//                     </p>
//                   ) : customerPreview ? (
//                     <div className="flex items-center justify-between gap-3">
//                       <div>
//                         <p className="text-xs text-white/40">Customer</p>
//                         <p className="text-sm font-semibold text-white">
//                           {customerPreview.name}
//                         </p>
//                       </div>

//                       <div className="text-right">
//                         <p className="text-xs text-white/40">Phone</p>
//                         <p className="text-sm font-semibold text-white">
//                           {customerPreview.phone}
//                         </p>
//                       </div>
//                     </div>
//                   ) : (
//                     <p className="text-xs text-white/40">
//                       Enter 3 digits to fetch customer details.
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Amount */}
//               <Input
//                 label="Amount (INR)"
//                 placeholder="e.g. 120"
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(e.target.value)}
//                 error={errors.amount}
//               />

//               {/* Submit */}
//               <Button
//                 className="w-full py-3"
//                 disabled={!canSubmit || loading || checkingCustomer}
//                 onClick={handleOpenPasscode}
//               >
//                 {loading ? "Please wait..." : "Submit Entry"}
//               </Button>

//               {/* Toast */}
//               {toast.message ? (
//                 <div
//                   className={`rounded-2xl border px-4 py-3 text-sm ${
//                     toast.type === "success"
//                       ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
//                       : "border-red-500/30 bg-red-500/10 text-red-200"
//                   }`}
//                 >
//                   {toast.message}
//                 </div>
//               ) : null}
//             </div>
//           </div>

//           <p className="mt-4 text-center text-xs text-white/35">
//             Rose Bakery • Secure credit entry
//           </p>
//         </div>
//       </div>

//       {/* Passcode Modal */}
//       <Modal
//         open={openPasscode}
//         title="Confirm Passcode"
//         onClose={() => {
//           if (!loading) setOpenPasscode(false);
//         }}
//       >
//         <div className="space-y-4">
//           <Input
//             label="4-digit Passcode"
//             placeholder="••••"
//             maxLength={4}
//             inputMode="numeric"
//             value={passcode}
//             onChange={(e) =>
//               setPasscode(e.target.value.replace(/\D/g, "").slice(0, 4))
//             }
//           />

//           <div className="flex items-center justify-between gap-3">
//             <Button
//               variant="ghost"
//               className="w-full"
//               onClick={() => setOpenPasscode(false)}
//               disabled={loading}
//             >
//               Cancel
//             </Button>

//             <Button
//               className="w-full"
//               onClick={handleConfirmPasscode}
//               disabled={loading}
//             >
//               {loading ? <InlineLoader label="Saving..." /> : "Confirm & Save"}
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }
// eslint-disable-next-line no-unused-vars
import { useEffect, useMemo, useState } from "react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { customerService, creditEntryService } from "../../services";
import { isValidAmount } from "../../lib/validators";

function InlineLoader({ label = "Saving..." }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export default function Home() {
  const [allCustomers, setAllCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({ type: "", message: "" });

  // load customers
  useEffect(() => {
    async function load() {
      const list = await customerService.listCustomers();
      setAllCustomers(list);
    }
    load();
  }, []);

  // search logic
  useEffect(() => {
    if (!search.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFiltered([]);
      return;
    }

    const term = search.toLowerCase();

    const results = allCustomers.filter((c) => {
      return (
        c.name?.toLowerCase().includes(term) ||
        c.phone?.includes(term) ||
        c.customerId?.toLowerCase().includes(term)
      );
    });

    setFiltered(results.slice(0, 8));
  }, [search, allCustomers]);

  const canSubmit = selectedCustomer && isValidAmount(amount);

  async function handleSubmit() {
    setToast({ type: "", message: "" });

    if (!selectedCustomer) {
      setToast({ type: "error", message: "Select customer first." });
      return;
    }

    if (!isValidAmount(amount)) {
      setToast({ type: "error", message: "Enter valid amount." });
      return;
    }

    setLoading(true);

    await creditEntryService.addCreditEntry({
      customerId: selectedCustomer.customerId,
      amount,
      createdBy: "shop",
    });

    setLoading(false);

    setToast({
      type: "success",
      message: `₹${amount} added for ${selectedCustomer.name} ✅`,
    });

    setAmount("");
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-black px-4">
      <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-6xl items-center justify-center py-10">
        <div className="w-full max-w-md sm:max-w-lg">
          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-2xl relative">
            <p className="text-xs font-semibold text-white/50">
              SHOP ENTRY PANEL
            </p>

            <h1 className="mt-2 text-xl sm:text-2xl font-semibold text-white">
              Add Customer Credit
            </h1>

            <p className="mt-2 text-sm text-white/60">
              Search customer → enter amount → save instantly.
            </p>

            {/* SEARCH */}
            <div className="mt-6 relative">
              <label className="mb-2 block text-xs text-white/70">
                Search Customer (Name / ID / Phone)
              </label>

              <input
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30"
                placeholder="Type name, ROSE001 or phone..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedCustomer(null);
                }}
              />

              {/* FLOATING DROPDOWN */}
              {filtered.length > 0 && !selectedCustomer && (
                <div className="absolute left-0 right-0 top-[72px] z-50 max-h-60 overflow-auto rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl">
                  {filtered.map((c) => (
                    <div
                      key={c.customerId}
                      onClick={() => {
                        setSelectedCustomer(c);
                        setSearch(`${c.name} (${c.customerId})`);
                        setFiltered([]);
                      }}
                      className="cursor-pointer border-b border-white/5 px-4 py-3 hover:bg-white/10"
                    >
                      <p className="text-sm font-semibold text-white">
                        {c.name}
                      </p>
                      <p className="text-xs text-white/50">
                        {c.customerId} • {c.phone}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SELECTED CUSTOMER */}
            {selectedCustomer && (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                <p className="text-xs text-white/40">Selected Customer</p>

                <div className="flex items-center justify-between mt-1">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {selectedCustomer.name}
                    </p>
                    <p className="text-xs text-white/50">
                      {selectedCustomer.customerId}
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-white">
                    {selectedCustomer.phone}
                  </p>
                </div>
              </div>
            )}

            {/* AMOUNT */}
            <div className="mt-5">
              <Input
                label="Amount (INR)"
                placeholder="e.g. 120"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* SUBMIT */}
            <div className="mt-4">
              <Button
                className="w-full py-3"
                disabled={!canSubmit || loading}
                onClick={handleSubmit}
              >
                {loading ? <InlineLoader /> : "Save Entry"}
              </Button>
            </div>

            {/* TOAST */}
            {toast.message && (
              <div
                className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
                  toast.type === "success"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                    : "border-red-500/30 bg-red-500/10 text-red-200"
                }`}
              >
                {toast.message}
              </div>
            )}
          </div>

          <p className="mt-4 text-center text-xs text-white/35">
            Rose Bakery • Fast billing mode
          </p>
        </div>
      </div>
    </div>
  );
}

