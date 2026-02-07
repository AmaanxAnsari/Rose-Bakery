// import Input from "../common/Input";
// import Button from "../common/Button";

// export default function FiltersBar({ filters, setFilters, onApply, onReset }) {
//   return (
//     <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
//       <div className="grid gap-3 md:grid-cols-4">
//         <Input
//           label="Customer ID"
//           placeholder="ROSE001"
//           value={filters.customerId}
//           onChange={(e) =>
//             setFilters((f) => ({
//               ...f,
//               customerId: e.target.value.toUpperCase(),
//             }))
//           }
//         />
//         <Input
//           label="From Date"
//           type="date"
//           value={filters.from}
//           onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
//         />
//         <Input
//           label="To Date"
//           type="date"
//           value={filters.to}
//           onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
//         />
//         <Input
//           label="Month Key (YYYY-MM)"
//           placeholder="2026-01"
//           value={filters.monthKey}
//           onChange={(e) =>
//             setFilters((f) => ({ ...f, monthKey: e.target.value }))
//           }
//         />
//       </div>

//       <div className="mt-4 flex gap-2">
//         <Button onClick={onApply}>Apply Filters</Button>
//         <Button variant="ghost" onClick={onReset}>
//           Reset
//         </Button>
//       </div>
//     </div>
//   );
// }
import Input from "../common/Input";
import Button from "../common/Button";
import { useMemo } from "react";

export default function FiltersBar({ filters, setFilters, onReset }) {
  /* 🔥 generate month dropdown */
  const months = useMemo(() => {
    const arr = [];
    const now = new Date();

    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0",
      )}`;

      const label = d.toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      });

      arr.push({ label, value: key });
    }
    return arr;
  }, []);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="grid gap-3 md:grid-cols-4">
        {/* CUSTOMER ID */}
        <div>
          <label className="text-xs text-white/60 mb-2 block">Customer</label>
          <div className="flex">
            <div className="px-3 py-2 bg-white/10 border border-white/15 rounded-l-xl text-white text-sm">
              ROSE
            </div>
            <input
              className="w-full bg-white/5 border border-white/15 rounded-r-xl px-3 py-2 text-white text-sm outline-none"
              placeholder="001"
              maxLength={3}
              value={filters.customerSuffix}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  customerSuffix: e.target.value.replace(/\D/g, ""),
                }))
              }
            />
          </div>
        </div>

        {/* MONTH */}
        <div>
          <label className="text-xs text-white/60 mb-2 block">Month</label>
          <select
            className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white text-sm"
            value={filters.monthKey}
            onChange={(e) =>
              setFilters((f) => ({ ...f, monthKey: e.target.value }))
            }
          >
            <option value="">Select month</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* FROM */}
        <Input
          label="From"
          type="date"
          value={filters.from}
          onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
        />

        {/* TO */}
        <Input
          label="To"
          type="date"
          value={filters.to}
          onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
        />
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="ghost" onClick={onReset}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
