// // import { formatINR, formatTime } from "../../lib/format";

// // export default function EntryTable({ rows = [] }) {
// //   return (
// //     <div className="overflow-hidden rounded-3xl border border-white/10">
// //       <table className="w-full text-left text-sm text-white">
// //         <thead className="bg-white/5 text-xs text-white/60">
// //           <tr>
// //             <th className="p-4">Date</th>
// //             <th className="p-4">Customer</th>
// //             <th className="p-4">Amount</th>
// //             <th className="p-4">Created</th>
// //           </tr>
// //         </thead>

// //         <tbody>
// //           {rows.map((e) => (
// //             <tr key={e.id} className="border-t border-white/10">
// //               <td className="p-4 font-semibold">{e.entryDate}</td>
// //               <td className="p-4">{e.customerId}</td>
// //               <td className="p-4 font-semibold">{formatINR(e.amount)}</td>
// //               <td className="p-4 text-white/60 text-xs">
// //                 {formatTime(e.createdAt)}
// //               </td>
// //             </tr>
// //           ))}

// //           {rows.length === 0 ? (
// //             <tr>
// //               <td colSpan={4} className="p-6 text-center text-white/50">
// //                 No entries found.
// //               </td>
// //             </tr>
// //           ) : null}
// //         </tbody>
// //       </table>
// //     </div>
// //   );
// // }
// import { formatINR, formatTime } from "../../lib/format";

// export default function EntryTable({ rows = [] }) {
//   return (
//     <div className="overflow-hidden rounded-3xl border border-white/10">
//       <table className="w-full text-left text-sm text-white">
//         <thead className="bg-white/5 text-xs text-white/60">
//           <tr>
//             <th className="p-4">Date</th>
//             <th className="p-4">Customer</th>
//             <th className="p-4">Amount</th>
//             <th className="p-4">Time</th>
//           </tr>
//         </thead>

//         <tbody>
//           {rows.map((e) => (
//             <tr key={e.id} className="border-t border-white/10">
//               <td className="p-4 font-semibold">{e.entryDate}</td>
//               <td className="p-4">{e.customerId}{e.name ? ` (${e.name})` : ""}</td>
//               <td className="p-4 font-semibold">{formatINR(e.amount)}</td>
//               <td className="p-4 text-white/60 text-xs">
//                 {formatTime(e.createdAt)}
//               </td>
//             </tr>
//           ))}

//           {rows.length === 0 && (
//             <tr>
//               <td colSpan={4} className="p-6 text-center text-white/50">
//                 No entries found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }
import { formatINR, formatTime } from "../../lib/format";

export default function EntryTable({ rows = [] }) {
  if (!rows.length) {
    return (
      <div className="rounded-3xl border border-white/10 p-10 text-center text-white/40">
        No entries found.
      </div>
    );
  }

  /* 🔥 GROUP BY DATE */
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
        console.log("Entry",dayEntries)

        const dayTotal = dayEntries.reduce(
          (sum, e) => sum + Number(e.amount || 0),
          0,
        );

        return (
          <div
            key={date}
            className="overflow-hidden rounded-3xl border border-white/10"
          >
            {/* DAY HEADER */}
            <div className="flex items-center justify-between bg-white/5 px-5 py-4">
              <p className="font-semibold text-white">{date}</p>
              <p className="font-semibold text-white text-lg">
                {formatINR(dayTotal)}
              </p>
            </div>

            {/* TABLE */}
            <table className="w-full text-left text-sm text-white">
              <thead className="bg-white/5 text-xs text-white/50">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Time</th>
                </tr>
              </thead>

              <tbody>
                {dayEntries.map((e) => (
                  <tr key={e.id} className="border-t border-white/10">
                    <td className="p-4">{e.name||e.customerId}</td>
                    <td className="p-4 font-semibold">{formatINR(e.amount)}</td>
                    <td className="p-4 text-xs text-white/60">
                      {formatTime(e.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}
