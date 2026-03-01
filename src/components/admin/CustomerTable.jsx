// import { formatSmartDateTime } from "../../lib/format";
// import Button from "../common/Button";

// // eslint-disable-next-line no-unused-vars
// export default function CustomerTable({ rows = [], onEdit, onDelete }) {
//   return (
//     <div className="overflow-hidden rounded-3xl border border-white/10">
//       <table className="w-full text-left text-sm text-white">
//         <thead className="bg-white/5 text-xs text-white/60">
//           <tr>
//             <th className="p-4">Customer ID</th>
//             <th className="p-4">Name</th>
//             <th className="p-4">Phone</th>
//             <th className="p-4">Advance</th>
//             <th className="p-4">Balance</th>
//             <th className="p-4">Status</th>
//             <th className="p-4">Created At</th>
//             <th className="p-4 text-right">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {rows.map((c) => (
//             <tr key={c.customerId} className="border-t border-white/10">
//               <td className="p-4 font-semibold">{c.customerId}</td>
//               <td className="p-4">{c.name}</td>
//               <td className="p-4">{c.phone}</td>
//               <td className="p-4 text-center">{c.runningAdvance||0}</td>
//               <td className="p-4 text-center">{c.runningDue||0}</td>
//               <td className="p-4">
//                 <span
//                   className={`rounded-xl px-2 py-1 text-xs capitalize ${
//                     c.status === "active"
//                       ? "bg-emerald-500/10 text-emerald-200 border border-emerald-500/20"
//                       : "bg-white/10 text-white/60 border border-white/10"
//                   }`}
//                 >
//                   {c.status}
//                 </span>
//               </td>
//               <td className="p-4">{formatSmartDateTime(c.createdAt)}</td>

//               <td className="p-4">
//                 <div className="flex justify-end">
//                   <Button variant="ghost" onClick={() => onEdit(c)}>
//                     Edit
//                   </Button>
//                   {/* <Button variant="danger" onClick={() => onDelete(c)}>
//                     Delete
//                   </Button> */}
//                 </div>
//               </td>
//             </tr>
//           ))}

//           {rows.length === 0 ? (
//             <tr>
//               <td colSpan={5} className="p-6 text-center text-white/50">
//                 No customers found.
//               </td>
//             </tr>
//           ) : null}
//         </tbody>
//       </table>
//     </div>
//   );
// }
import { MessageCircle, Pencil, Trash2 } from "lucide-react";
import { formatSmartDateTime } from "../../lib/format";
import Button from "../common/Button";

// eslint-disable-next-line no-unused-vars
export default function CustomerTable({ rows = [], onEdit, onDelete }) {
    const handleShareWhatsApp = (c) => {
      if (!c.phone) return;
  
      // Remove non-digits
      const cleanPhone = c.phone.replace(/\D/g, "");
  
      // Add 91 if missing
      const phoneWithCode = cleanPhone.startsWith("91")
        ? cleanPhone
        : `91${cleanPhone}`;
  
      const message = `
  Hello ${c.name || "Customer"} 👋
  
  Welcome to Rose Bakery Credit System!
  
  Your customer account has been successfully created.
  
  🔐 Login Details:
  Customer ID: ${c.customerId}
  PIN: ${c.passcode}
  
  🌐 Login Here:
  https://rose-bakery-credit.web.app/
  
  📊 Account Summary:
  • Advance Balance: ₹${c.runningAdvance || 0}
  • Due Balance: ₹${c.runningDue || 0}
  • Status: ${c.status}
  
  Please keep your PIN confidential.
  
  If you need any help, feel free to contact us.
  
  Thank you for choosing Rose Bakery 🙏
  `.trim();
  
      const url = `https://wa.me/${phoneWithCode}?text=${encodeURIComponent(
        message,
      )}`;
  
      window.open(url, "_blank");
    };
  return (
    <div className="w-full overflow-x-auto rounded-3xl border border-white/10">
      <table className="min-w-[1000px] w-full text-left text-sm text-white">
        <thead className="bg-white/5 text-xs text-white/60">
          <tr>
            <th className="p-4">Customer ID</th>
            <th className="p-4">Name</th>
            <th className="p-4">Phone</th>
            <th className="p-4">Advance</th>
            <th className="p-4">Balance</th>
            <th className="p-4">Status</th>
            <th className="p-4">Created At</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr key={c.customerId} className="border-t border-white/10">
              <td className="p-4 font-semibold">{c.customerId}</td>
              <td className="p-4">{c.name}</td>
              <td className="p-4">{c.phone}</td>
              <td className="p-4 text-center">{c.runningAdvance || 0}</td>
              <td className="p-4 text-center">{c.runningDue || 0}</td>
              <td className="p-4">
                <span
                  className={`rounded-xl px-2 py-1 text-xs capitalize ${
                    c.status === "active"
                      ? "bg-emerald-500/10 text-emerald-200 border border-emerald-500/20"
                      : "bg-white/10 text-white/60 border border-white/10"
                  }`}
                >
                  {c.status}
                </span>
              </td>
              <td className="p-4 whitespace-nowrap">
                {formatSmartDateTime(c.createdAt)}
              </td>
              <td className="p-4">
                <div className="flex justify-end items-center gap-3">
                  {/* Edit */}
                  <button
                    onClick={() => onEdit(c)}
                    className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition"
                    title="Edit Customer"
                  >
                    <Pencil size={18} />
                  </button>

                  {/* WhatsApp Share */}
                  <button
                    onClick={() => handleShareWhatsApp(c)}
                    className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition"
                    title="Share on WhatsApp"
                  >
                    <MessageCircle size={18} />
                  </button>

                  {/* Delete */}
                  {/* <button
                    onClick={() => onDelete?.(c)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition"
                    title="Delete Customer"
                  >
                    <Trash2 size={18} />
                  </button> */}
                </div>
              </td>
              {/* <td className="p-4">
                <div className="flex justify-end">
                  <Button variant="ghost" onClick={() => onEdit(c)}>
                    Edit
                  </Button>
                </div>
              </td> */}
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td colSpan={8} className="p-6 text-center text-white/50">
                No customers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}