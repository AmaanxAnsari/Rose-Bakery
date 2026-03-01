// import { formatINR, formatTime } from "../../lib/format";
// import Button from "../common/Button";

// export default function EntryTable({
//   rows = [],
//   onEdit,
//   onDelete,
//   showActions = true, // 👈 NEW PROP
// }) {
//   if (!rows.length) {
//     return (
//       <div className="rounded-3xl border border-white/10 p-10 text-center text-white/40">
//         No entries found.
//       </div>
//     );
//   }

//   /* 🔥 GROUP BY DATE */
//   const grouped = rows.reduce((acc, e) => {
//     if (!acc[e.entryDate]) acc[e.entryDate] = [];
//     acc[e.entryDate].push(e);
//     return acc;
//   }, {});

//   const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

//   return (
//     <div className="space-y-4">
//       {dates.map((date) => {
//         const dayEntries = grouped[date];

//         const dayTotal = dayEntries.reduce(
//           (sum, e) => sum + Number(e.amount || 0),
//           0,
//         );

//         return (
//           <div
//             key={date}
//             className="overflow-hidden rounded-3xl border border-white/10"
//           >
//             {/* DAY HEADER */}
//             <div className="flex items-center justify-between bg-white/5 px-5 py-4">
//               <p className="font-semibold text-white">{date}</p>
//               <p className="font-semibold text-white text-lg">
//                 {formatINR(dayTotal)}
//               </p>
//             </div>

//             {/* TABLE */}
//             <table className="w-full table-fixed text-sm text-white">
//               <thead className="bg-white/5 text-xs text-white/50">
//                 <tr>
//                   <th className="p-4 w-1/3 text-left">Customer</th>
//                   <th className="p-4 w-1/6 text-center">Amount</th>
//                   <th className="p-4 w-1/6 text-center">Time</th>

//                   {/* 👇 ACTION HEADER CONDITIONAL */}
//                   {showActions && (
//                     <th className="p-4 w-1/3 text-center">Action</th>
//                   )}
//                 </tr>
//               </thead>

//               <tbody>
//                 {dayEntries.map((e) => (
//                   <tr key={e.id} className="border-t border-white/10">
//                     <td className="p-4 text-left">{e.name || e.customerId}</td>

//                     <td className="p-4 text-center font-semibold">
//                       {formatINR(e.amount)}
//                     </td>

//                     <td className="p-4 text-center text-xs text-white/60">
//                       {formatTime(e.createdAt)}
//                     </td>

//                     {/* 👇 ACTION CELL CONDITIONAL */}
//                     {showActions && (
//                       <td className="p-4">
//                         <div className="flex justify-center gap-3">
//                           <Button onClick={() => onEdit?.(e)} variant="primary">
//                             Edit
//                           </Button>

//                           <Button
//                             onClick={() => onDelete?.(e)}
//                             variant="danger"
//                           >
//                             Delete
//                           </Button>
//                         </div>
//                       </td>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         );
//       })}
//     </div>
//   );
// }
import { Pencil, Trash2 } from "lucide-react";
import { formatINR, formatTime } from "../../lib/format";
import Button from "../common/Button";

export default function EntryTable({
  rows = [],
  onEdit,
  onDelete,
  showActions = true,
}) {
  if (!rows.length) {
    return (
      <div className="rounded-3xl border border-white/10 p-10 text-center text-white/40">
        No entries found.
      </div>
    );
  }

  const grouped = rows.reduce((acc, e) => {
    if (!acc[e.entryDate]) acc[e.entryDate] = [];
    acc[e.entryDate].push(e);
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-4">
      {dates.map((date) => {
        const dayEntries = grouped[date];

        const dayTotal = dayEntries.reduce(
          (sum, e) => sum + Number(e.amount || 0),
          0,
        );

        return (
          <div key={date} className="rounded-3xl border border-white/10">
            {/* DAY HEADER */}
            <div className="flex items-center justify-between bg-white/5 px-5 py-4">
              <p className="font-semibold text-white">{date}</p>
              <p className="font-semibold text-white text-lg">
                {formatINR(dayTotal)}
              </p>
            </div>

            {/* 🔥 SCROLL WRAPPER */}
            <div className="w-full overflow-x-auto">
              <table className="min-w-[700px] w-full text-sm text-white">
                <thead className="bg-white/5 text-xs text-white/50">
                  <tr>
                    <th className="p-4 text-left whitespace-nowrap">
                      Customer
                    </th>
                    <th className="p-4 text-center whitespace-nowrap">
                      Amount
                    </th>
                    <th className="p-4 text-center whitespace-nowrap">Time</th>

                    {showActions && (
                      <th className="p-4 text-center whitespace-nowrap">
                        Action
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {dayEntries.map((e) => (
                    <tr key={e.id} className="border-t border-white/10">
                      <td className="p-4 whitespace-nowrap">
                        {e.name || e.customerId}
                      </td>

                      <td className="p-4 text-center font-semibold whitespace-nowrap">
                        {formatINR(e.amount)}
                      </td>

                      <td className="p-4 text-center text-xs text-white/60 whitespace-nowrap">
                        {formatTime(e.createdAt)}
                      </td>

                      {showActions && (
                        <td className="p-4">
                          <div className="flex justify-center items-center gap-3">
                            {/* Edit Button */}
                            <button
                              onClick={() => onEdit?.(e)}
                              className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition"
                              title="Edit Entry"
                            >
                              <Pencil size={18} />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => onDelete?.(e)}
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                              title="Delete Entry"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}