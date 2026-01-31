
export default function AdminDashboard() {
  return (
    <div className="min-h-[calc(100vh-140px)] bg-black">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
          <p className="text-xs font-semibold text-white/50">ADMIN DASHBOARD</p>
          <h1 className="mt-2 text-2xl font-semibold text-white">
            Rose Bakery Admin
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Next: Customers management + entries filtering + request payment.
          </p>
        </div>
      </div>
    </div>
  );
}
