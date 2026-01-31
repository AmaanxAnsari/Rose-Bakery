import { useEffect, useMemo, useState } from "react";
import FiltersBar from "../../components/admin/FiltersBar";
import EntryTable from "../../components/admin/EntryTable";
import { creditEntryService } from "../../services";
import { formatINR } from "../../lib/format";
import { getMonthKey, inDateRange } from "../../lib/filters";

export default function AdminEntries() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    customerId: "",
    from: "",
    to: "",
    monthKey: "",
  });

  async function load() {
    setLoading(true);
    const list = await creditEntryService.listEntries();
    setEntries(list);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (
        filters.customerId &&
        !e.customerId.includes(filters.customerId.trim().toUpperCase())
      )
        return false;

      if (filters.monthKey) {
        if (getMonthKey(e.entryDate) !== filters.monthKey) return false;
      }

      if (filters.from || filters.to) {
        if (!inDateRange(e.entryDate, filters.from, filters.to)) return false;
      }

      return true;
    });
  }, [entries, filters]);

  const total = useMemo(() => {
    return filtered.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  }, [filtered]);

  function onReset() {
    setFilters({ customerId: "", from: "", to: "", monthKey: "" });
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-black">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div>
          <p className="text-xs font-semibold text-white/50">ADMIN</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">Entries</h1>
          <p className="mt-1 text-sm text-white/60">
            View all credit entries. Filter by customer/date/month.
          </p>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-5">
          <FiltersBar
            filters={filters}
            setFilters={setFilters}
            onApply={() => {}}
            onReset={onReset}
          />

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 flex items-center justify-between">
            <p className="text-sm text-white/60">Filtered total</p>
            <p className="text-xl font-semibold text-white">
              {formatINR(total)}
            </p>
          </div>

          <div className="mt-5">
            <EntryTable rows={filtered} />
          </div>

          {loading ? (
            <p className="mt-4 text-xs text-white/40">Loading...</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
