
// eslint-disable-next-line no-unused-vars
import { useEffect, useMemo, useState,useRef } from "react";
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
const searchRef = useRef(null);
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

  // async function handleSubmit() {
  //   setToast({ type: "", message: "" });

  //   if (!selectedCustomer) {
  //     setToast({ type: "error", message: "Select customer first." });
  //     return;
  //   }

  //   if (!isValidAmount(amount)) {
  //     setToast({ type: "error", message: "Enter valid amount." });
  //     return;
  //   }

  //   setLoading(true);

  //   await creditEntryService.addCreditEntry({
  //     customerId: selectedCustomer.customerId,
  //     amount,
  //     createdBy: "shop",
  //   });

  //   setLoading(false);

  //   setToast({
  //     type: "success",
  //     message: `₹${amount} added for ${selectedCustomer.name} ✅`,
  //   });

  //   setAmount("");
  // }

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

  // 🔥 RESET EVERYTHING
  setAmount("");
  setSearch("");
  setSelectedCustomer(null);
  setFiltered([]);
  searchRef.current?.focus();
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
                ref={searchRef}
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

