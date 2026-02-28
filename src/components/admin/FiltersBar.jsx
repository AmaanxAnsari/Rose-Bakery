// import { useEffect, useMemo, useState } from "react";
// import Input from "../common/Input";
// import Button from "../common/Button";

// export default function FiltersBar({ filters, setFilters, onReset }) {
//   /* 🔥 month list */
//   const months = useMemo(() => {
//     const arr = [];
//     const now = new Date();

//     for (let i = 0; i < 18; i++) {
//       const d = new Date(now.getFullYear(), now.getMonth() - i, 1);

//       const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
//         2,
//         "0",
//       )}`;

//       const label = d.toLocaleDateString("en-IN", {
//         month: "long",
//         year: "numeric",
//       });

//       arr.push({ label, value });
//     }
//     return arr;
//   }, []);

//   /* 🔥 month search */
//   const [monthSearch, setMonthSearch] = useState("");
//   const [filteredMonths, setFilteredMonths] = useState([]);
//   const [selectedMonth, setSelectedMonth] = useState(null);

//   useEffect(() => {
//     if (!monthSearch.trim()) {
//       // eslint-disable-next-line react-hooks/set-state-in-effect
//       setFilteredMonths(months);
//       return;
//     }

//     const q = monthSearch.toLowerCase();
//     setFilteredMonths(months.filter((m) => m.label.toLowerCase().includes(q)));
//   }, [monthSearch, months]);

//   /* 🔥 clear month */
//   function clearMonth() {
//     setMonthSearch("");
//     setSelectedMonth(null);
//     setFilters((f) => ({ ...f, monthKey: "" }));
//   }

//   return (
//     <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
//       <div className="grid gap-4 md:grid-cols-5">
//         {/* CUSTOMER */}
//         <div>
//           <label className="text-xs text-white/50 mb-2 block">Customer</label>
//           <div className="flex">
//             <div className="px-3 py-3 bg-white/10 border border-white/15 rounded-l-2xl text-white text-sm">
//               ROSE
//             </div>
//             <input
//               className="w-full bg-white/5 border border-white/15 rounded-r-2xl px-3 py-3 text-white text-sm outline-none placeholder:text-white/30"
//               placeholder="001"
//               maxLength={3}
//               value={filters.customerSuffix}
//               onChange={(e) =>
//                 setFilters((f) => ({
//                   ...f,
//                   customerSuffix: e.target.value.replace(/\D/g, ""),
//                 }))
//               }
//             />
//           </div>
//         </div>

//         {/* 🔥 DAY FILTER */}
//         <Input
//           label="Day"
//           type="date"
//           value={filters.from}
//           onChange={(e) =>
//             setFilters((f) => ({
//               ...f,
//               from: e.target.value,
//               to: e.target.value,
//             }))
//           }
//         />

//         {/* 🔥 MONTH SEARCH DROPDOWN */}
//         <div className="relative">
//           <label className="text-xs text-white/50 mb-2 block">Month</label>

//           <input
//             className="w-full rounded-2xl border border-white/15 bg-white/5 px-3 py-3 text-sm text-white outline-none placeholder:text-white/30"
//             placeholder="Search month (Feb 2026)"
//             value={monthSearch}
//             onChange={(e) => {
//               setMonthSearch(e.target.value);
//               setSelectedMonth(null);
//             }}
//           />

//           {monthSearch && (
//             <button
//               onClick={clearMonth}
//               className="absolute right-3 top-9 text-white/40 hover:text-white"
//             >
//               ✕
//             </button>
//           )}

//           {/* dropdown */}
//           {filteredMonths.length > 0 && !selectedMonth && monthSearch && (
//             <div className="absolute left-0 right-0 top-[72px] z-50 max-h-60 overflow-auto rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl">
//               {filteredMonths.map((m) => (
//                 <div
//                   key={m.value}
//                   onClick={() => {
//                     setSelectedMonth(m);
//                     setMonthSearch(m.label);
//                     setFilteredMonths([]);

//                     setFilters((f) => ({
//                       ...f,
//                       monthKey: m.value,
//                     }));
//                   }}
//                   className="cursor-pointer border-b border-white/5 px-4 py-3 hover:bg-white/10"
//                 >
//                   <p className="text-sm font-semibold text-white">{m.label}</p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* FROM */}
//         <Input
//           label="From"
//           type="date"
//           value={filters.from}
//           onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
//         />

//         {/* TO */}
//         <Input
//           label="To"
//           type="date"
//           value={filters.to}
//           onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
//         />
//       </div>

//       {/* RESET */}
//       <div className="mt-5 flex justify-end">
//         <Button variant="ghost" onClick={onReset}>
//           Reset Filters
//         </Button>
//       </div>
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import Input from "../common/Input";
import Button from "../common/Button";

export default function FiltersBar({
  filters,
  setFilters,
  onReset,
  showCustomerFilter = true, // 👈 NEW PROP
}) {
  /* 🔥 month list */
  const months = useMemo(() => {
    const arr = [];
    const now = new Date();

    for (let i = 0; i < 18; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);

      const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0",
      )}`;

      const label = d.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      });

      arr.push({ label, value });
    }
    return arr;
  }, []);

  const [monthSearch, setMonthSearch] = useState("");
  const [filteredMonths, setFilteredMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);

  useEffect(() => {
    if (!monthSearch.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFilteredMonths(months);
      return;
    }

    const q = monthSearch.toLowerCase();
    setFilteredMonths(months.filter((m) => m.label.toLowerCase().includes(q)));
  }, [monthSearch, months]);

  function clearMonth() {
    setMonthSearch("");
    setSelectedMonth(null);
    setFilters((f) => ({ ...f, monthKey: "" }));
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
      <div
        className={`grid gap-4 ${
          showCustomerFilter ? "md:grid-cols-5" : "md:grid-cols-4"
        }`}
      >
        {/* ✅ CUSTOMER FILTER (ADMIN ONLY) */}
        {showCustomerFilter && (
          <div>
            <label className="text-xs text-white/50 mb-2 block">Customer</label>
            <div className="flex">
              <div className="px-3 py-3 bg-white/10 border border-white/15 rounded-l-2xl text-white text-sm">
                ROSE
              </div>
              <input
                className="w-full bg-white/5 border border-white/15 rounded-r-2xl px-3 py-3 text-white text-sm outline-none placeholder:text-white/30"
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
        )}

        {/* DAY FILTER */}
        <Input
          label="Day"
          type="date"
          value={filters.from}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              from: e.target.value,
              to: e.target.value,
            }))
          }
        />

        {/* MONTH */}
        <div className="relative">
          <label className="text-xs text-white/50 mb-2 block">Month</label>

          <input
            className="w-full rounded-2xl border border-white/15 bg-white/5 px-3 py-3 text-sm text-white outline-none placeholder:text-white/30"
            placeholder="Search month (Feb 2026)"
            value={monthSearch}
            onChange={(e) => {
              setMonthSearch(e.target.value);
              setSelectedMonth(null);
            }}
          />

          {monthSearch && (
            <button
              onClick={clearMonth}
              className="absolute right-3 top-9 text-white/40 hover:text-white"
            >
              ✕
            </button>
          )}

          {filteredMonths.length > 0 && !selectedMonth && monthSearch && (
            <div className="absolute left-0 right-0 top-[72px] z-50 max-h-60 overflow-auto rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl">
              {filteredMonths.map((m) => (
                <div
                  key={m.value}
                  onClick={() => {
                    setSelectedMonth(m);
                    setMonthSearch(m.label);
                    setFilteredMonths([]);

                    setFilters((f) => ({
                      ...f,
                      monthKey: m.value,
                    }));
                  }}
                  className="cursor-pointer border-b border-white/5 px-4 py-3 hover:bg-white/10"
                >
                  <p className="text-sm font-semibold text-white">{m.label}</p>
                </div>
              ))}
            </div>
          )}
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

      <div className="mt-5 flex justify-end">
        <Button variant="ghost" onClick={onReset}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
}