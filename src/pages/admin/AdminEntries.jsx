/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import FiltersBar from "../../components/admin/FiltersBar";
import EntryTable from "../../components/admin/EntryTable";
import { creditEntryService } from "../../services";
import { formatINR } from "../../lib/format";
import { todayISO } from "../../lib/format";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

export default function AdminEntries() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [deleteEntry, setDeleteEntry] = useState(null);

  const [editAmount, setEditAmount] = useState("");

  const [filters, setFilters] = useState({
    customerSuffix: "",
    monthKey: "",
    from: "",
    to: "",
  });
  function handleEdit(entry) {
    setEditEntry(entry);
    setEditAmount(entry.amount);
  }
  async function handleUpdate() {
    if (!editAmount) return;

    await creditEntryService.updateCreditEntry(editEntry.id, {
      amount: Number(editAmount),
    });

    setEditEntry(null);
    load();
  }
  function handleDelete(entry) {
    setDeleteEntry(entry);
  }
  async function confirmDelete() {
    await creditEntryService.deleteCreditEntry(deleteEntry.id);
    setDeleteEntry(null);
    load();
  }

  async function load() {
    setLoading(true);
    const list = await creditEntryService.listEntries();
    setEntries(list);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  /* 🔥 FILTER LOGIC */
  const filtered = useMemo(() => {
    // default → today only
    if (
      !filters.customerSuffix &&
      !filters.monthKey &&
      !filters.from &&
      !filters.to
    ) {
      return entries.filter((e) => e.entryDate === todayISO());
    }

    return entries.filter((e) => {
      // customer filter
      if (filters.customerSuffix) {
        const full = `ROSE${filters.customerSuffix}`;
        if (!e.customerId.includes(full)) return false;
      }

      // month filter
      if (filters.monthKey) {
        if (!e.entryDate.startsWith(filters.monthKey)) return false;
      }

      // date range
      if (filters.from && e.entryDate < filters.from) return false;
      if (filters.to && e.entryDate > filters.to) return false;

      return true;
    });
  }, [entries, filters]);

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
          <p className="text-xs font-semibold text-white/50">ADMIN</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">Entries</h1>
          <p className="mt-1 text-sm text-white/60">
            Today entries by default. Filter by customer/month/date.
          </p>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-5">
          <FiltersBar
            filters={filters}
            setFilters={setFilters}
            onReset={resetFilters}
            showCustomerFilter={true}
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

          <div className="mt-5">
            <EntryTable
              rows={filtered}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>

          {loading && <p className="mt-4 text-xs text-white/40">Loading...</p>}
        </div>
      </div>
      <Modal
        open={!!editEntry}
        title="Edit Entry"
        onClose={() => setEditEntry(null)}
      >
        <div className="space-y-4">
          <Input
            label="Amount"
            type="number"
            value={editAmount}
            onChange={(e) => setEditAmount(e.target.value)}
          />

          <Button className="w-full" onClick={handleUpdate}>
            Update Entry
          </Button>
        </div>
      </Modal>
      <Modal
        open={!!deleteEntry}
        title="Delete Entry"
        onClose={() => setDeleteEntry(null)}
      >
        <div className="space-y-4">
          <p className="text-sm text-white/70">
            Are you sure you want to delete this entry?
          </p>

          <div className="flex gap-3">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => setDeleteEntry(null)}
            >
              Cancel
            </Button>

            <Button variant="danger" className="w-full" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
