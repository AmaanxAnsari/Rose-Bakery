/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from "react";
import Button from "../../components/common/Button";
import { creditEntryService,customerService,ledgerService } from "../../services";
import { formatINR } from "../../lib/format";
import Modal from './../../components/common/Modal';
import Input from "../../components/common/Input";
import { generateMonthlyLedger } from "../../services/firestore/ledger.service";

export default function AdminDashboard() {
  const [entries, setEntries] = useState([]);
  const [ledgerBills, setLedgerBills] = useState([]);
  console.log(ledgerBills)
  const [loading, setLoading] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [paidAmount, setPaidAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("cash");

  const [range, setRange] = useState("month"); // day | month | year

  useEffect(() => {
    async function load() {
      setLoading(true);

      const e = await creditEntryService.listEntries();
      setEntries(e);

      // bills collection (ledger)
      const bills = await ledgerService.listMonthlyLedgers?.();
      setLedgerBills(bills || []);

      setLoading(false);
    }

    load();
  }, []);

  /* ---------------- FILTER RANGE ---------------- */

  function inSelectedRange(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();

    if (range === "day") {
      return d.toDateString() === now.toDateString();
    }

    if (range === "month") {
      return (
        d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      );
    }

    if (range === "year") {
      return d.getFullYear() === now.getFullYear();
    }

    return true;
  }

  const filteredEntries = useMemo(() => {
    return entries.filter((e) => inSelectedRange(e.entryDate));
  }, [entries, range, inSelectedRange]);

  /* ---------------- STATS ---------------- */

const totalCredit = useMemo(() => {
  return filteredEntries.reduce((sum, e) => sum + Number(e.amount || 0), 0);
}, [filteredEntries]);

const totalPaid = useMemo(() => {
  return ledgerBills
    .filter((b) => b.status === "paid")
    .reduce((sum, b) => sum + Number(b.paidAmount || 0), 0);
}, [ledgerBills]);

// const totalOutstanding = useMemo(() => {
//   return ledgerBills.reduce((sum, b) => sum + Number(b.closingDue || 0), 0);
// }, [ledgerBills]);
const totalOutstanding = totalCredit - totalPaid;

  /* ---------------- MARK PAID ---------------- */

function openMarkPaid(bill) {
  setSelectedBill(bill);
  setPaidAmount(bill.netPayable); // auto fill
  setOpenPayment(true);
}
async function handleMarkPaid() {
  if (!selectedBill || !paidAmount) return;

  const result = await ledgerService.markLedgerPaid({
    customerId: selectedBill.customerId,
    monthKey: selectedBill.monthKey,
    paidAmount: Number(paidAmount),
    paymentMode,
  });

  setLedgerBills((prev) =>
    prev.map((b) =>
      b.id === selectedBill.id
        ? {
            ...b,
            status: "paid",
            closingAdvance: result.closingAdvance,
            closingDue: result.closingDue,
          }
        : b,
    ),
  );

  setOpenPayment(false);
  setSelectedBill(null);
}
const numericPaid = Number(paidAmount || 0);
const netPayable = Number(selectedBill?.netPayable || 0);
const difference = numericPaid - netPayable;

const isAdvance = difference > 0;
const isDue = difference < 0;
const isSettled = difference === 0;


// useEffect(() => {
//   async function autoGenerateIfNeeded() {
//     const now = new Date();
//     const today = now.getDate();

//     if (today !== 1) return; // only on 1st

//     const monthKey = `${now.getFullYear()}-${String(now.getMonth()).padStart(
//       2,
//       "0",
//     )}`;

//     const customersList = await customerService.listCustomers();

//     for (const c of customersList) {
//       const existing = await ledgerService.getMonthlyLedger(
//         c.customerId,
//         monthKey,
//       );

//       if (!existing) {
//         await generateMonthlyLedger(c.customerId, c.name, monthKey);
//       }
//     }
//   }

//   autoGenerateIfNeeded();
// }, []);
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <p className="text-xs text-white/50">ADMIN</p>
        <h1 className="text-2xl font-semibold text-white mt-1">
          Business Overview
        </h1>
        <p className="text-sm text-white/60 mt-2">
          Credits issued, payments received and outstanding ledger.
        </p>
      </div>

      {/* RANGE FILTER */}
      <div className="flex gap-2">
        {["day", "month", "year"].map((r) => (
          <Button
            key={r}
            variant={range === r ? "primary" : "ghost"}
            onClick={() => setRange(r)}
          >
            {r === "day" && "Today"}
            {r === "month" && "This Month"}
            {r === "year" && "This Year"}
          </Button>
        ))}
      </div>

      {/* STATS CARDS */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
          <p className="text-xs text-white/50">Total Credit Given</p>
          <h2 className="text-2xl font-semibold text-white mt-2">
            {formatINR(totalCredit)}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
          <p className="text-xs text-white/50">Payments Received</p>
          <h2 className="text-2xl font-semibold text-emerald-400 mt-2">
            {formatINR(totalPaid)}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
          <p className="text-xs text-white/50">Outstanding</p>
          <h2 className="text-2xl font-semibold text-amber-400 mt-2">
            {formatINR(totalOutstanding)}
          </h2>
        </div>
      </div>

      {/* LEDGER TABLE */}
      <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
        <h2 className="text-lg font-semibold text-white mb-4">
          Generated Bills
        </h2>

        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-left text-sm text-white">
            <thead className="bg-white/5 text-xs text-white/60">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Month</th>
                <th className="p-4">Total Credit</th>
                <th className="p-4">Due Carried</th>
                <th className="p-4">Advance Used</th>
                <th className="p-4">Net Payable</th>
                <th className="p-4">Closing Due</th>
                <th className="p-4">Closing Advance</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {ledgerBills.map((b) => (
                <tr key={b.id} className="border-t border-white/10">
                  <td className="p-4">
                    {b.name} ({b.customerId})
                  </td>
                  <td className="p-4">{b.monthKey}</td>

                  <td className="p-4 font-semibold">
                    {formatINR(b.totalCredit)}
                  </td>

                  <td className="p-4 text-amber-400">
                    {formatINR(b.dueCarried || 0)}
                  </td>

                  <td className="p-4 text-blue-400">
                    {formatINR(b.advanceUsed || 0)}
                  </td>

                  <td className="p-4 font-semibold">
                    {formatINR(b.netPayable)}
                  </td>

                  <td className="p-4 text-red-400">
                    {formatINR(b.closingDue || 0)}
                  </td>

                  <td className="p-4 text-green-400">
                    {formatINR(b.closingAdvance || 0)}
                  </td>

                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full capitalize ${
                        b.status === "paid"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td className="p-4">
                    {b.status !== "paid" && (
                      <Button size="sm" onClick={() => openMarkPaid(b)}>
                        Mark Paid
                      </Button>
                    )}
                  </td>
                </tr>
              ))}

              {ledgerBills.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-white/50">
                    No ledger bills yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {loading && (
          <p className="mt-4 text-xs text-white/40">Loading data...</p>
        )}
      </div>
      <Modal
        open={openPayment}
        title="Mark Payment"
        onClose={() => setOpenPayment(false)}
      >
        {selectedBill && (
          <div className="space-y-5">
            {/* Bill Info */}
            <div className="rounded-2xl bg-white/5 p-4 text-sm text-white space-y-2">
              <div className="flex justify-between">
                <span>Customer</span>
                <span className="font-semibold">{selectedBill.name}</span>
              </div>

              <div className="flex justify-between">
                <span>Total Credit</span>
                <span>{formatINR(selectedBill.totalCredit)}</span>
              </div>

              <div className="flex justify-between text-amber-400">
                <span>Due Carried</span>
                <span>{formatINR(selectedBill.dueCarried || 0)}</span>
              </div>

              <div className="flex justify-between text-blue-400">
                <span>Advance Used</span>
                <span>{formatINR(selectedBill.advanceUsed || 0)}</span>
              </div>

              <div className="flex justify-between text-lg font-semibold">
                <span>Net Payable</span>
                <span>{formatINR(netPayable)}</span>
              </div>
            </div>

            <Input
              label="Amount Paid"
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
            />

            {/* Live Calculation */}
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

            <div>
              <label className="text-xs text-white/60">Payment Mode</label>

              <select
                className="w-full mt-2 bg-zinc-900 text-white border border-white/15 rounded-xl px-3 py-2 appearance-none focus:outline-none focus:ring-2 focus:ring-white/20"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
              >
                <option value="cash" className="bg-zinc-900 text-white">
                  Cash
                </option>
                <option value="online" className="bg-zinc-900 text-white">
                  Online
                </option>
              </select>
            </div>

            <Button className="w-full" onClick={handleMarkPaid}>
              Save Payment
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}