/* eslint-disable react-hooks/immutability */
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import FiltersBar from "../../components/admin/FiltersBar";
import EntryTable from "../../components/admin/EntryTable";
import { creditEntryService, customerService } from "../../services";
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

  const [openAdd, setOpenAdd] = useState(false);
  const [allCustomers, setAllCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [addAmount, setAddAmount] = useState("");
  const [addDate, setAddDate] = useState(todayISO());

  const [editAmount, setEditAmount] = useState("");

  const [filters, setFilters] = useState({
    customerSuffix: "",
    monthKey: "",
    from: "",
    to: "",
  });

  useEffect(() => {
    load();

    async function loadCustomers() {
      const list = await customerService.listCustomers();
      setAllCustomers(list);
    }

    loadCustomers();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredCustomers([]);
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

    setFilteredCustomers(results.slice(0, 8));
  }, [search, allCustomers]);
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
        {/* <div>
          <p className="text-xs font-semibold text-white/50">ADMIN</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">Entries</h1>
          <p className="mt-1 text-sm text-white/60">
            Today entries by default. Filter by customer/month/date.
          </p>
        </div> */}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-white/50">ADMIN</p>
            <h1 className="mt-1 text-2xl font-semibold text-white">Entries</h1>
          </div>

          <Button onClick={() => setOpenAdd(true)}>+ Add Entry</Button>
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
      <Modal
        open={openAdd}
        title="Add Customer Entry"
        onClose={() => setOpenAdd(false)}
      >
        <div className="space-y-5">
          {/* SEARCH */}
          <div className="relative">
            <label className="text-xs text-white/60">
              Search Customer (Name / ID / Phone)
            </label>

            <input
              className="w-full mt-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-white"
              placeholder="Search customer..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedCustomer(null);
              }}
            />

            {filteredCustomers.length > 0 && !selectedCustomer && (
              <div className="absolute left-0 right-0 top-[70px] z-50 max-h-60 overflow-auto rounded-xl border border-white/10 bg-zinc-900">
                {filteredCustomers.map((c) => (
                  <div
                    key={c.customerId}
                    onClick={() => {
                      setSelectedCustomer(c);
                      setSearch(`${c.name} (${c.customerId})`);
                      setFilteredCustomers([]);
                    }}
                    className="cursor-pointer border-b border-white/5 px-4 py-3 hover:bg-white/10"
                  >
                    <p className="text-sm font-semibold text-white">{c.name}</p>
                    <p className="text-xs text-white/50">
                      {c.customerId} • {c.phone}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DATE PICKER */}
          <Input
            label="Entry Date"
            type="date"
            value={addDate}
            onChange={(e) => setAddDate(e.target.value)}
          />

          {/* AMOUNT */}
          <Input
            label="Amount"
            type="number"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
          />

          <Button
            className="w-full"
            disabled={!selectedCustomer || !addAmount}
            onClick={async () => {
              await creditEntryService.addCreditEntry({
                customerId: selectedCustomer.customerId,
                name: selectedCustomer.name,
                amount: addAmount,
                createdBy: "admin",
                entryDateOverride: addDate,
              });

              setOpenAdd(false);
              setAddAmount("");
              setSearch("");
              setSelectedCustomer(null);
              load();
            }}
          >
            Save Entry
          </Button>
        </div>
      </Modal>
    </div>
  );
}
