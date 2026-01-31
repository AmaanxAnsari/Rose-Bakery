import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-140px)] bg-black">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
          <p className="text-xs font-semibold text-white/50">ADMIN</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">
            Rose Bakery Admin
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Manage customers, entries, and payment requests.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/customers")}
            >
              Customers
            </Button>
            <Button variant="ghost" onClick={() => navigate("/admin/entries")}>
              Entries
            </Button>
            <Button onClick={() => navigate("/admin/request-payment")}>
              Request Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
