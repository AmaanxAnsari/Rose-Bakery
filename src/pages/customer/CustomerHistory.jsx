import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import FiltersBar from "../../components/admin/FiltersBar";
import EntryTable from "../../components/admin/EntryTable";
import { creditEntryService } from "../../services";
import { formatINR, todayISO } from "../../lib/format";

export default function CustomerHistory() {
  const user = useSelector((s) => s.auth.user);

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    customerSuffix: "",
    monthKey: "",
    from: "",
    to: "",
  });

  async function load() {
    if (!user?.id) return;

    setLoading(true);
    const list = await creditEntryService.listEntriesByCustomer(user.id);
    setEntries(list);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [user?.id]);

  /* 🔥 FILTER LOGIC (same as admin) */
  // const filtered = useMemo(() => {
  //   // default → today only
  //   if (
  //     !filters.customerSuffix &&
  //     !filters.monthKey &&
  //     !filters.from &&
  //     !filters.to
  //   ) {
  //     return entries.filter((e) => e.entryDate === todayISO());
  //   }

  //   return entries.filter((e) => {
  //     // month filter

  //     if (filters.monthKey) {
  //       if (!e.entryDate.startsWith(filters.monthKey)) return false;
  //     }

  //     // date range
  //     if (filters.from && e.entryDate < filters.from) return false;
  //     if (filters.to && e.entryDate > filters.to) return false;

  //     return true;
  //   });
  // }, [entries, filters]);

  /* 🔥 FILTER LOGIC (Customer – locked to own ID) */
  /* 🔥 FILTER LOGIC (Customer – locked to own ID) */
  const filtered = useMemo(() => {
    if (!user?.id) return [];

    return entries.filter((e) => {
      // 🔒 Always restrict to logged-in customer
      if (e.customerId !== user.id) return false;

      // Default → today only
      if (!filters.monthKey && !filters.from && !filters.to) {
        return e.entryDate === todayISO();
      }

      // Month filter
      if (filters.monthKey && !e.entryDate.startsWith(filters.monthKey))
        return false;

      // Date range
      if (filters.from && e.entryDate < filters.from) return false;
      if (filters.to && e.entryDate > filters.to) return false;

      return true;
    });
  }, [entries, filters, user]); // ✅ FIXED

  const total = useMemo(() => {
    return filtered.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  }, [filtered]);

  function resetFilters() {
    setFilters({
      customerSuffix: "",
      monthKey: "",
      from: "",
      to: "",
    });
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-black">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div>
          <p className="text-xs font-semibold text-white/50">CUSTOMER</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">
            Credit History
          </h1>
          <p className="mt-1 text-sm text-white/60">
            View all your credit entries date-wise.
          </p>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-5">
          {/* FILTERS */}
          <FiltersBar
            filters={filters}
            setFilters={setFilters}
            onReset={resetFilters}
            showCustomerFilter={false}
          />

          {/* TOTAL */}
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 flex items-center justify-between">
            <p className="text-sm text-white/60">
              {filters.monthKey
                ? "Filtered total"
                : filters.from || filters.to
                  ? "Filtered total"
                  : "Today total"}
            </p>
            <p className="text-xl font-semibold text-white">
              {formatINR(total)}
            </p>
          </div>

          {/* TABLE (NO EDIT / DELETE PASSED) */}
          <div className="mt-5">
            <EntryTable rows={filtered} showActions={false} />
          </div>

          {loading && <p className="mt-4 text-xs text-white/40">Loading...</p>}
        </div>
      </div>
    </div>
  );
}
