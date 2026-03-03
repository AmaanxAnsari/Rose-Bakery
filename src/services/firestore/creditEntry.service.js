
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase.init";
import { todayISO } from "../../lib/format";

const colRef = collection(db, "credit_entries");

// export async function addCreditEntry({ customerId, amount,name, createdBy = "customer" }) {
//   const payload = {
//     customerId: String(customerId).trim().toUpperCase(),
//     amount: Number(amount),
//     name:name,
//     entryDate: todayISO(),
//     createdAt: serverTimestamp(),
//     createdBy,
//   };

//   const ref = await addDoc(colRef, payload);

//   return { id: ref.id, ...payload };
// }

export async function addCreditEntry({
  customerId,
  amount,
  name,
  createdBy = "customer",
  entryDateOverride, // 👈 new optional param
}) {
  const isoDate = entryDateOverride || todayISO();

  const payload = {
    customerId: String(customerId).trim().toUpperCase(),
    amount: Number(amount),
    name,
    entryDate: isoDate, // string for filters
    createdAt: entryDateOverride
      ? Timestamp.fromDate(new Date(entryDateOverride))
      : serverTimestamp(),
    createdBy,
  };

  const ref = await addDoc(colRef, payload);

  return { id: ref.id, ...payload };
}
export async function updateCreditEntry(id, updates) {
  const ref = doc(db, "credit_entries", id);

  await updateDoc(ref, {
    ...updates,
  });

  return true;
}
export async function deleteCreditEntry(id) {
  const ref = doc(db, "credit_entries", id);
  await deleteDoc(ref);
  return true;
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
