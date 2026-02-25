// import entries from "../../mock/credit_entries.json";
// import { todayISO } from "../../lib/format";

// let _entries = [...entries]; // in-memory store (mock DB)

// export async function addCreditEntry({
//   customerId,
//   amount,
//   createdBy = "customer",
// }) {
//   const newEntry = {
//     id: `e_${Date.now()}`,
//     customerId: String(customerId).trim().toUpperCase(),
//     amount: Number(amount),
//     entryDate: todayISO(),
//     createdAt: new Date().toISOString(),
//     createdBy,
//   };

//   _entries.unshift(newEntry);
//   await new Promise((r) => setTimeout(r, 250));
//   return newEntry;
// }

// export async function listEntriesByCustomer(customerId) {
//   const id = String(customerId).trim().toUpperCase();
//   await new Promise((r) => setTimeout(r, 250));
//   return _entries.filter((e) => e.customerId === id);
// }

// export async function listEntries() {
//   await new Promise((r) => setTimeout(r, 250));
//   return _entries;
// }
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase.init";
import { todayISO } from "../../lib/format";

const colRef = collection(db, "credit_entries");

export async function addCreditEntry({ customerId, amount,name, createdBy = "customer" }) {
  const payload = {
    customerId: String(customerId).trim().toUpperCase(),
    amount: Number(amount),
    name:name,
    entryDate: todayISO(),
    createdAt: serverTimestamp(),
    createdBy,
  };

  const ref = await addDoc(colRef, payload);

  return { id: ref.id, ...payload };
}

export async function listEntriesByCustomer(customerId) {
  const id = String(customerId).trim().toUpperCase();

  const q = query(
    colRef,
    where("customerId", "==", id),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function listEntries() {
  const q = query(colRef, orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
