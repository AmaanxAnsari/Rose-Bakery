import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { creditEntryService, ledgerService } from "../../services";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/firebase.init";
import { formatINR } from "../../lib/format";

export default function CustomerDashboard() {
  const user = useSelector((s) => s.auth.user);

  const [entries, setEntries] = useState([]);
  const [customerData, setCustomerData] = useState(null);
  const [ledgerBills, setLedgerBills] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!user?.id) return;

      setLoading(true);

      const list = await creditEntryService.listEntriesByCustomer(user.id);
      setEntries(list);

      const snap = await getDoc(doc(db, "customers", user.id));
      if (snap.exists()) setCustomerData(snap.data());

      const ledgers = await ledgerService.listCustomerLedgers?.(user.id);
      setLedgerBills(ledgers || []);

      setLoading(false);
    }

    load();
  }, [user?.id]);

  const totalCredit = useMemo(() => {
    return entries.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  }, [entries]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <p className="text-xs text-white/50">CUSTOMER</p>
        <h1 className="text-2xl font-semibold text-white mt-1">
          Welcome, {user?.name}
        </h1>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
          <p className="text-xs text-white/50">Total Credit</p>
          <h2 className="text-2xl font-semibold text-white mt-2">
            {formatINR(totalCredit)}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
          <p className="text-xs text-white/50">Advance Balance</p>
          <h2 className="text-2xl font-semibold text-emerald-400 mt-2">
            {formatINR(customerData?.runningAdvance || 0)}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
          <p className="text-xs text-white/50">Outstanding Due</p>
          <h2 className="text-2xl font-semibold text-amber-400 mt-2">
            {formatINR(customerData?.runningDue || 0)}
          </h2>
        </div>
      </div>

      {/* LEDGER TABLE */}
      <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
        <h2 className="text-lg font-semibold text-white mb-4">
          Monthly Ledgers
        </h2>

        <div className="w-full overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-[900px] w-full text-left text-sm text-white">
            <thead className="bg-white/5 text-xs text-white/60">
              <tr>
                <th className="p-4 whitespace-nowrap">Month</th>
                <th className="p-4 whitespace-nowrap">Total Credit</th>
                <th className="p-4 whitespace-nowrap">Due Carried</th>
                <th className="p-4 whitespace-nowrap">Advance Used</th>
                <th className="p-4 whitespace-nowrap">Net Payable</th>
                <th className="p-4 whitespace-nowrap">Closing Due</th>
                <th className="p-4 whitespace-nowrap">Closing Advance</th>
                <th className="p-4 whitespace-nowrap">Status</th>
              </tr>
            </thead>

            <tbody>
              {ledgerBills.map((b) => (
                <tr key={b.id} className="border-t border-white/10">
                  <td className="p-4 whitespace-nowrap">{b.monthKey}</td>

                  <td className="p-4 font-semibold whitespace-nowrap">
                    {formatINR(b.totalCredit)}
                  </td>

                  <td className="p-4 text-amber-400 whitespace-nowrap">
                    {formatINR(b.dueCarried || 0)}
                  </td>

                  <td className="p-4 text-blue-400 whitespace-nowrap">
                    {formatINR(b.advanceUsed || 0)}
                  </td>

                  <td className="p-4 font-semibold whitespace-nowrap">
                    {formatINR(b.netPayable)}
                  </td>

                  <td className="p-4 text-red-400 whitespace-nowrap">
                    {formatINR(b.closingDue || 0)}
                  </td>

                  <td className="p-4 text-green-400 whitespace-nowrap">
                    {formatINR(b.closingAdvance || 0)}
                  </td>

                  <td className="p-4 whitespace-nowrap">
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
                </tr>
              ))}

              {ledgerBills.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-white/50">
                    No ledger records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {loading && <p className="mt-4 text-xs text-white/40">Loading...</p>}
      </div>
    </div>
  );
}
