// // import { useNavigate } from "react-router-dom";
// // import Button from "../../components/common/Button";

// // export default function AdminDashboard() {
// //   const navigate = useNavigate();

// //   return (
// //     <div className="min-h-[calc(100vh-140px)] bg-black">
// //       <div className="mx-auto max-w-6xl px-4 py-10">
// //         <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
// //           <p className="text-xs font-semibold text-white/50">ADMIN</p>
// //           <h1 className="mt-2 text-2xl font-semibold text-white">
// //             Rose Bakery Admin
// //           </h1>
// //           <p className="mt-2 text-sm text-white/60">
// //             Manage customers, entries, and payment requests.
// //           </p>

// //           <div className="mt-6 grid gap-3 sm:grid-cols-3">
// //             <Button
// //               variant="ghost"
// //               onClick={() => navigate("/admin/customers")}
// //             >
// //               Customers
// //             </Button>
// //             <Button variant="ghost" onClick={() => navigate("/admin/entries")}>
// //               Entries
// //             </Button>
// //             <Button onClick={() => navigate("/admin/request-payment")}>
// //               Request Payment
// //             </Button>
// //             <Button onClick={() => navigate("/admin/ledger")}>
// //               Ledger
// //             </Button>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// export default function AdminDashboard() {
//   return (
//     <div>
//       <p className="text-xs text-white/50">ADMIN</p>
//       <h1 className="text-2xl font-semibold text-white mt-1">Dashboard</h1>

//       <p className="text-sm text-white/60 mt-2">
//         Use sidebar to manage customers and ledger.
//       </p>
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import Button from "../../components/common/Button";
import { creditEntryService,ledgerService } from "../../services";
import { formatINR } from "../../lib/format";

export default function AdminDashboard() {
  const [entries, setEntries] = useState([]);
  const [ledgerBills, setLedgerBills] = useState([]);
  console.log(ledgerBills)
  const [loading, setLoading] = useState(false);

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
      .reduce((sum, b) => sum + Number(b.amount || 0), 0);
  }, [ledgerBills]);

  const totalOutstanding = totalCredit - totalPaid;

  /* ---------------- MARK PAID ---------------- */

  async function markPaid(bill) {
    await ledgerService.markLedgerPaid(bill.id);
    setLedgerBills((prev) =>
      prev.map((b) => (b.id === bill.id ? { ...b, status: "paid" } : b)),
    );
  }

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
            variant={range === r ? "default" : "ghost"}
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
                <th className="p-4">Net Payable</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {ledgerBills.map((b) => (
                <tr key={b.id} className="border-t border-white/10">
                  <td className="p-4">
                    {b.customerName} ({b.customerId})
                  </td>
                  <td className="p-4">{b.monthKey}</td>
                  <td className="p-4 font-semibold">{formatINR(b.totalCredit)}</td>
                  <td className="p-4 font-semibold">{formatINR(b.netPayable)}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
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
                      <Button size="sm" onClick={() => markPaid(b)}>
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
    </div>
  );
}