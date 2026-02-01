import { formatINR, formatTime } from "../../lib/format";

export default function EntryTable({ rows = [] }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10">
      <table className="w-full text-left text-sm text-white">
        <thead className="bg-white/5 text-xs text-white/60">
          <tr>
            <th className="p-4">Date</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Amount</th>
            <th className="p-4">Created</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((e) => (
            <tr key={e.id} className="border-t border-white/10">
              <td className="p-4 font-semibold">{e.entryDate}</td>
              <td className="p-4">{e.customerId}</td>
              <td className="p-4 font-semibold">{formatINR(e.amount)}</td>
              <td className="p-4 text-white/60 text-xs">
                {formatTime(e.createdAt)}
              </td>
            </tr>
          ))}

          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-6 text-center text-white/50">
                No entries found.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
