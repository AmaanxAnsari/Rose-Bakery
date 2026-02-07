// import { useEffect, useMemo, useState } from "react";
// import Button from "../../components/common/Button";
// import Input from "../../components/common/Input";
// import Modal from "../../components/common/Modal";
// import CustomerTable from "../../components/admin/CustomerTable";
// import { customerService } from "../../services";

// export default function AdminCustomers() {
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [q, setQ] = useState("");

//   const [openForm, setOpenForm] = useState(false);
//   const [editing, setEditing] = useState(null);

//   const [form, setForm] = useState({
//     customerId: "",
//     name: "",
//     phone: "",
//     passcode: "",
//     status: "active",
//   });

//   const filtered = useMemo(() => {
//     const query = q.trim().toUpperCase();
//     if (!query) return rows;
//     return rows.filter(
//       (c) =>
//         c.customerId.includes(query) ||
//         c.name.toUpperCase().includes(query) ||
//         c.phone.includes(query),
//     );
//   }, [rows, q]);

//   async function load() {
//     setLoading(true);
//     const data = await customerService.listCustomers();
//     setRows(data);
//     setLoading(false);
//   }

//   useEffect(() => {
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     load();
//   }, []);

//   function openCreate() {
//     setEditing(null);
//     setForm({
//       customerId: "",
//       name: "",
//       phone: "",
//       passcode: "",
//       status: "active",
//     });
//     setOpenForm(true);
//   }

//   function openEdit(c) {
//     setEditing(c);
//     setForm({
//       customerId: c.customerId,
//       name: c.name,
//       phone: c.phone,
//       passcode: c.passcode,
//       status: c.status,
//     });
//     setOpenForm(true);
//   }

//   async function save() {
//     if (!form.customerId || !form.name || !form.phone || !form.passcode) return;

//     setLoading(true);

//     if (editing) {
//       await customerService.updateCustomer(editing.customerId, {
//         name: form.name,
//         phone: form.phone,
//         passcode: form.passcode,
//         status: form.status,
//       });
//     } else {
//       await customerService.createCustomer({
//         customerId: form.customerId,
//         name: form.name,
//         phone: form.phone,
//         passcode: form.passcode,
//         status: form.status,
//       });
//     }

//     setLoading(false);
//     setOpenForm(false);
//     await load();
//   }

//   async function remove(c) {
//     const ok = confirm(`Delete customer ${c.customerId}?`);
//     if (!ok) return;
//     setLoading(true);
//     await customerService.deleteCustomer(c.customerId);
//     setLoading(false);
//     load();
//   }

//   return (
//     <div className="min-h-[calc(100vh-140px)] bg-black">
//       <div className="mx-auto max-w-6xl px-4 py-10">
//         <div className="flex items-center justify-between gap-3">
//           <div>
//             <p className="text-xs font-semibold text-white/50">ADMIN</p>
//             <h1 className="mt-1 text-2xl font-semibold text-white">
//               Customers
//             </h1>
//             <p className="mt-1 text-sm text-white/60">
//               Create, update and manage customer accounts.
//             </p>
//           </div>

//           <Button onClick={openCreate}>+ Add Customer</Button>
//         </div>

//         <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-5">
//           <Input
//             label="Search"
//             placeholder="ROSE001 / Name / Phone"
//             value={q}
//             onChange={(e) => setQ(e.target.value)}
//           />

//           <div className="mt-5">
//             <CustomerTable
//               rows={filtered}
//               onEdit={openEdit}
//               onDelete={remove}
//             />
//           </div>

//           {loading ? (
//             <p className="mt-4 text-xs text-white/40">Loading...</p>
//           ) : null}
//         </div>
//       </div>

//       <Modal
//         open={openForm}
//         title={editing ? "Edit Customer" : "Add Customer"}
//         onClose={() => setOpenForm(false)}
//       >
//         <div className="space-y-4">
//           <Input
//             label="Customer ID"
//             placeholder="ROSE003"
//             value={form.customerId}
//             onChange={(e) =>
//               setForm((f) => ({
//                 ...f,
//                 customerId: e.target.value.toUpperCase(),
//               }))
//             }
//             disabled={!!editing}
//           />
//           <Input
//             label="Name"
//             placeholder="Customer name"
//             value={form.name}
//             onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
//           />
//           <Input
//             label="Phone"
//             placeholder="919999999999"
//             value={form.phone}
//             onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
//           />
//           <Input
//             label="Passcode (4 digits)"
//             placeholder="1234"
//             value={form.passcode}
//             onChange={(e) =>
//               setForm((f) => ({
//                 ...f,
//                 passcode: e.target.value.replace(/\D/g, "").slice(0, 4),
//               }))
//             }
//           />

//           <div className="flex gap-2">
//             <Button
//               variant="ghost"
//               className="w-full"
//               onClick={() => setOpenForm(false)}
//             >
//               Cancel
//             </Button>
//             <Button className="w-full" onClick={save} disabled={loading}>
//               {loading ? "Saving..." : "Save"}
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import CustomerTable from "../../components/admin/CustomerTable";
import { customerService } from "../../services";

/* 🔥 AUTO INCREMENT HELPER */
function getNextCustomerData(rows) {
  if (!rows.length) {
    return { id: "ROSE001", passcode: "0001" };
  }

  const nums = rows.map((c) => {
    const n = parseInt(c.customerId.replace("ROSE", ""));
    return isNaN(n) ? 0 : n;
  });

  const max = Math.max(...nums);
  const next = max + 1;

  const idNum = String(next).padStart(3, "0");
  const pass = String(next).padStart(4, "0");

  return {
    id: `ROSE${idNum}`,
    passcode: pass,
  };
}

export default function AdminCustomers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    customerId: "",
    name: "",
    phone: "",
    passcode: "",
    status: "active",
  });

  const filtered = useMemo(() => {
    const query = q.trim().toUpperCase();
    if (!query) return rows;
    return rows.filter(
      (c) =>
        c.customerId.includes(query) ||
        c.name.toUpperCase().includes(query) ||
        c.phone.includes(query),
    );
  }, [rows, q]);

  async function load() {
    setLoading(true);
    const data = await customerService.listCustomers();
    setRows(data);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  /* 🔥 CREATE */
  function openCreate() {
    setEditing(null);

    const next = getNextCustomerData(rows);

    setForm({
      customerId: next.id,
      name: "",
      phone: "",
      passcode: next.passcode,
      status: "active",
    });

    setOpenForm(true);
  }

  /* EDIT */
  function openEdit(c) {
    setEditing(c);
    setForm({
      customerId: c.customerId,
      name: c.name,
      phone: c.phone,
      passcode: c.passcode,
      status: c.status,
    });
    setOpenForm(true);
  }

  async function save() {
    if (!form.customerId || !form.name || !form.phone || !form.passcode) return;

    setLoading(true);

    if (editing) {
      await customerService.updateCustomer(editing.customerId, {
        name: form.name,
        phone: form.phone,
        passcode: form.passcode,
        status: form.status,
      });
    } else {
      await customerService.createCustomer({
        customerId: form.customerId,
        name: form.name,
        phone: form.phone,
        passcode: form.passcode,
        status: form.status,
      });
    }

    setLoading(false);
    setOpenForm(false);
    await load();
  }

  async function remove(c) {
    const ok = confirm(`Delete customer ${c.customerId}?`);
    if (!ok) return;

    setLoading(true);
    await customerService.deleteCustomer(c.customerId);
    setLoading(false);
    load();
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-black">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-white/50">ADMIN</p>
            <h1 className="mt-1 text-2xl font-semibold text-white">
              Customers
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Create, update and manage customer accounts.
            </p>
          </div>

          <Button onClick={openCreate}>+ Add Customer</Button>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-5">
          <Input
            label="Search"
            placeholder="ROSE001 / Name / Phone"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <div className="mt-5">
            <CustomerTable
              rows={filtered}
              onEdit={openEdit}
              onDelete={remove}
            />
          </div>

          {loading ? (
            <p className="mt-4 text-xs text-white/40">Loading...</p>
          ) : null}
        </div>
      </div>

      {/* 🔥 MODAL */}
      <Modal
        open={openForm}
        title={editing ? "Edit Customer" : "Add Customer"}
        onClose={() => setOpenForm(false)}
      >
        <div className="space-y-4">
          <Input label="Customer ID" value={form.customerId} disabled />

          <Input
            label="Name"
            placeholder="Customer name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />

          <Input
            label="Phone"
            placeholder="919999999999"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />

          <Input
            label="Passcode (4 digits)"
            value={form.passcode}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                passcode: e.target.value.replace(/\D/g, "").slice(0, 4),
              }))
            }
          />

          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setOpenForm(false)}
            >
              Cancel
            </Button>

            <Button className="w-full" onClick={save} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
