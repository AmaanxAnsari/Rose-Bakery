import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import { creditEntryService } from "../../services";
import { formatINR } from "../../lib/format";

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    async function load() {
      const list = await creditEntryService.listEntriesByCustomer(user?.id);
      setEntries(list);
    }
    if (user?.id) load();
  }, [user?.id]);

  const total = useMemo(() => {
    return entries.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  }, [entries]);

  return (
    <div className="min-h-[calc(100vh-140px)] bg-black">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
          <p className="text-xs font-semibold text-white/50">
            CUSTOMER DASHBOARD
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-white">
            Welcome, {user?.name || "Customer"}
          </h1>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/60">Total credit</p>
            <p className="mt-1 text-3xl font-semibold text-white">
              {formatINR(total)}
            </p>
          </div>

          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            <Button
              variant="ghost"
              onClick={() => navigate("/customer/history")}
            >
              View History
            </Button>
            <Button onClick={() => navigate("/customer/payment")}>
              Make Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
