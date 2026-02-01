import Button from "../common/Button";

export default function CustomerTable({ rows = [], onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10">
      <table className="w-full text-left text-sm text-white">
        <thead className="bg-white/5 text-xs text-white/60">
          <tr>
            <th className="p-4">Customer ID</th>
            <th className="p-4">Name</th>
            <th className="p-4">Phone</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.customerId} className="border-t border-white/10">
              <td className="p-4 font-semibold">{c.customerId}</td>
              <td className="p-4">{c.name}</td>
              <td className="p-4">{c.phone}</td>
              <td className="p-4">
                <span
                  className={`rounded-xl px-2 py-1 text-xs ${
                    c.status === "active"
                      ? "bg-emerald-500/10 text-emerald-200 border border-emerald-500/20"
                      : "bg-white/10 text-white/60 border border-white/10"
                  }`}
                >
                  {c.status}
                </span>
              </td>
              <td className="p-4">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => onEdit(c)}>
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => onDelete(c)}>
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}

          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-6 text-center text-white/50">
                No customers found.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
