import { useEffect, useState } from "react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import { customerService } from "../../services";
import {
  generateMonthlyLedger,
  markLedgerPaid,
} from "../../services/firestore/ledger.service";
import { formatINR } from "../../lib/format";

/* ----------------------------------------- */
/* Month options */
/* ----------------------------------------- */

function getMonthOptions() {
  const arr = [];
  const now = new Date();

  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);

    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0",
    )}`;

    const label = d.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });

    arr.push({ value, label });
  }
  return arr;
}

/* ----------------------------------------- */
/* Component */
/* ----------------------------------------- */

export default function AdminLedger() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  console.log(selectedCustomer)
  const [search, setSearch] = useState("");

  const [monthKey, setMonthKey] = useState("");
  const [ledger, setLedger] = useState(null);

  const [loading, setLoading] = useState(false);

  const [openPayment, setOpenPayment] = useState(false);
  const [paidAmount, setPaidAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("cash");

  const months = getMonthOptions();

  /* ----------------------------------------- */
  /* Load customers */
  /* ----------------------------------------- */

  useEffect(() => {
    async function load() {
      const list = await customerService.listCustomers();
      setCustomers(list);
    }
    load();
  }, []);

  /* ----------------------------------------- */
  /* Search customer */
  /* ----------------------------------------- */

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.customerId.toLowerCase().includes(q) ||
      c.phone.includes(q)
    );
  });

  /* ----------------------------------------- */
  /* Generate Bill */
  /* ----------------------------------------- */

  async function handleGenerateBill() {
    if (!selectedCustomer || !monthKey) return;

    setLoading(true);

    const data = await generateMonthlyLedger(
      selectedCustomer.customerId,
      selectedCustomer.name,
      monthKey,
    );

    setLedger(data);
    setLoading(false);
  }

  /* ----------------------------------------- */
  /* Mark Payment */
  /* ----------------------------------------- */

  async function handleMarkPaid() {
    if (!paidAmount) return;

    setLoading(true);

    const result = await markLedgerPaid({
      customerId: selectedCustomer.customerId,
      monthKey,
      paidAmount: Number(paidAmount),
      paymentMode,
    });

    setLedger((prev) => ({
      ...prev,
      status: "paid",
      closingAdvance: result.closingAdvance,
      closingDue: result.closingDue,
    }));

    setLoading(false);
    setOpenPayment(false);
    setPaidAmount("");
  }

  /* ----------------------------------------- */
  /* Calculations */
  /* ----------------------------------------- */
const numericPaid = Number(paidAmount || 0);
const netPayable = Number(ledger?.netPayable || 0);

const difference = numericPaid - netPayable;

const isAdvance = difference > 0;
const isDue = difference < 0;
const isSettled = difference === 0;
  return (
    <div className="min-h-[calc(100vh-140px)] bg-black">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-xs text-white/50">ADMIN</p>
        <h1 className="text-2xl font-semibold text-white mt-1">
          Monthly Ledger
        </h1>

        {/* -------------------------------- */}
        {/* Filters */}
        {/* -------------------------------- */}

        <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-6">
          {/* Customer Search */}
          <div className="relative">
            <Input
              label="Customer"
              placeholder="Search name / ROSE001 / phone"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedCustomer(null);
              }}
            />

            {search.trim().length > 0 &&
              filtered.length > 0 &&
              !selectedCustomer && (
                <div className="absolute left-0 right-0 mt-2 z-50 max-h-52 overflow-auto rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl">
                  {filtered.map((c) => (
                    <div
                      key={c.customerId}
                      onClick={() => {
                        setSelectedCustomer(c);
                        setSearch(`${c.name} (${c.customerId})`);
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

          {/* Month */}
          <div className="mt-4">
            <label className="text-xs text-white/60">Month</label>

            <select
              className="
      w-full mt-2
      bg-white/5
      border border-white/15
      rounded-xl
      px-3 py-2
      text-white
      outline-none
      appearance-none
    "
              value={monthKey}
              onChange={(e) => setMonthKey(e.target.value)}
            >
              <option value="" className="bg-black text-white">
                Select month
              </option>

              {months.map((m) => (
                <option
                  key={m.value}
                  value={m.value}
                  className="bg-black text-white"
                >
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <Button
            className="mt-5 w-full"
            onClick={handleGenerateBill}
            disabled={!selectedCustomer || !monthKey || loading}
          >
            {loading ? "Generating..." : "Generate Bill"}
          </Button>
        </div>

        {/* -------------------------------- */}
        {/* Ledger View */}
        {/* -------------------------------- */}

        {ledger && (
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-white font-semibold text-lg">Ledger Summary</h2>

            <div className="mt-4 space-y-3 text-sm text-white">
              <div className="flex justify-between">
                <span>Total Credit</span>
                <span>{formatINR(ledger.totalCredit)}</span>
              </div>

              <div className="flex justify-between">
                <span>Advance Used</span>
                <span>{formatINR(ledger.advanceUsed)}</span>
              </div>

              <div className="flex justify-between">
                <span>Due Carried</span>
                <span>{formatINR(ledger.dueCarried)}</span>
              </div>

              <div className="flex justify-between font-semibold text-lg">
                <span>Net Payable</span>
                <span>{formatINR(ledger.netPayable)}</span>
              </div>
            </div>

            {ledger.status !== "paid" ? (
              <Button
                className="mt-6 w-full"
                onClick={() => {
                  setPaidAmount(ledger.netPayable); // auto fill
                  setOpenPayment(true);
                }}
              >
                Mark Payment Received
              </Button>
            ) : (
              <div className="mt-6 text-green-400 text-sm">
                Payment settled ✓
              </div>
            )}
          </div>
        )}
      </div>

      {/* -------------------------------- */}
      {/* Payment Modal */}
      {/* -------------------------------- */}
      <Modal
        open={openPayment}
        title="Mark Payment"
        onClose={() => setOpenPayment(false)}
      >
        <div className="space-y-5">
          {/* Customer Info */}
          <div className="rounded-2xl bg-white/5 p-4 text-sm text-white space-y-2">
            <div className="flex justify-between">
              <span>Customer</span>
              <span className="font-semibold">
                {selectedCustomer?.name} ({selectedCustomer?.customerId})
              </span>
            </div>

            <div className="flex justify-between">
              <span>Total Credit</span>
              <span>{formatINR(ledger?.totalCredit || 0)}</span>
            </div>

            <div className="flex justify-between text-amber-400">
              <span>Due Carried</span>
              <span>{formatINR(ledger?.dueCarried || 0)}</span>
            </div>

            <div className="flex justify-between text-blue-400">
              <span>Advance Used</span>
              <span>{formatINR(ledger?.advanceUsed || 0)}</span>
            </div>

            <div className="flex justify-between text-lg font-semibold">
              <span>Net Payable</span>
              <span>{formatINR(netPayable)}</span>
            </div>
          </div>

          {/* Payment Input */}
          <Input
            label="Amount Paid"
            type="number"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
          />

          {/* Live Calculation Preview */}
          <div className="rounded-2xl bg-white/5 p-4 text-sm space-y-2">
            {isSettled && (
              <div className="flex justify-between text-green-400 font-semibold">
                <span>Status</span>
                <span>Settled ✓</span>
              </div>
            )}

            {isAdvance && (
              <div className="flex justify-between text-blue-400 font-semibold">
                <span>Advance</span>
                <span>{formatINR(difference)}</span>
              </div>
            )}

            {isDue && (
              <div className="flex justify-between text-red-400 font-semibold">
                <span>Balance Due</span>
                <span>{formatINR(Math.abs(difference))}</span>
              </div>
            )}
          </div>

          {/* Payment Mode */}
          <div>
            <label className="text-xs text-white/60">Payment Mode</label>
            <select
              className="w-full mt-2 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <option value="cash">Cash</option>
              <option value="online">Online</option>
            </select>
          </div>

          <Button
            className="w-full"
            onClick={handleMarkPaid}
            disabled={!paidAmount || loading}
          >
            {loading ? "Saving..." : "Save Payment"}
          </Button>
        </div>
      </Modal>
      {/* <Modal
        open={openPayment}
        title="Mark Payment"
        onClose={() => setOpenPayment(false)}
      >
        <div className="space-y-4">
          <Input
            label="Amount Paid"
            type="number"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
          />

          <div>
            <label className="text-xs text-white/60">Payment Mode</label>
            <select
              className="w-full mt-2 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-white"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <option value="cash">Cash</option>
              <option value="online">Online</option>
            </select>
          </div>

          <Button className="w-full" onClick={handleMarkPaid}>
            Save Payment
          </Button>
        </div>
      </Modal> */}
    </div>
  );
}
