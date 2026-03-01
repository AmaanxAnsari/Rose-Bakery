import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  updateDoc,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase.init";

/* ------------------------------------------------ */
/* 🔹 Helpers */
/* ------------------------------------------------ */

function ledgerDocId(customerId, monthKey) {
  return `${customerId}_${monthKey}`;
}

/* ------------------------------------------------ */
/* 🔹 Generate Monthly Bill */
/* ------------------------------------------------ */

export async function generateMonthlyLedger(customerId,name, monthKey) {
  // 1️⃣ get customer
  const customerRef = doc(db, "customers", customerId);
  const customerSnap = await getDoc(customerRef);

  if (!customerSnap.exists()) throw new Error("Customer not found");

  const customer = customerSnap.data();

  const runningAdvance = Number(customer.runningAdvance || 0);
  const runningDue = Number(customer.runningDue || 0);

  // 2️⃣ fetch monthly entries
  const q = query(
    collection(db, "credit_entries"),
    where("customerId", "==", customerId),
  );

  const snap = await getDocs(q);

  const monthEntries = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((e) => e.entryDate.startsWith(monthKey));

  const totalCredit = monthEntries.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0,
  );

  // 3️⃣ calculate payable
// const netPayable = totalCredit + runningDue - runningAdvance;

  // 4️⃣ create ledger
  const ledgerRef = doc(
    db,
    "monthly_ledgers",
    ledgerDocId(customerId, monthKey),
  );
const adjustedNet = totalCredit + runningDue - runningAdvance;

const ledgerData = {
  customerId,
  name,
  monthKey,
  totalCredit,
  advanceUsed: runningAdvance,
  dueCarried: runningDue,

  netPayable: adjustedNet > 0 ? adjustedNet : 0,

  paidAmount: 0,
  paymentMode: null,
  paymentDate: null,

  closingAdvance: adjustedNet < 0 ? Math.abs(adjustedNet) : 0,
  closingDue: adjustedNet > 0 ? adjustedNet : 0,

  status: "generated",
  createdAt: new Date(),
};

  await setDoc(ledgerRef, ledgerData);

  return ledgerData;
}

/* ------------------------------------------------ */
/* 🔹 List All Ledgers (Dashboard use) */
/* ------------------------------------------------ */

export async function listMonthlyLedgers() {
  const q = query(
    collection(db, "monthly_ledgers"),
    orderBy("createdAt", "desc")
  );

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/* ------------------------------------------------ */
/* 🔹 Get Single Monthly Ledger */
/* ------------------------------------------------ */

export async function getMonthlyLedger(customerId, monthKey) {
  const ledgerRef = doc(
    db,
    "monthly_ledgers",
    ledgerDocId(customerId, monthKey),
  );

  const snap = await getDoc(ledgerRef);

  if (snap.exists()) {
    return { id: snap.id, ...snap.data() };
  }

  return null;
}
// export async function listCustomerLedgers(customerId) {
//   const q = query(
//     collection(db, "monthly_ledgers"),
//     where("customerId", "==", customerId),
//     orderBy("createdAt", "desc"),
//   );

//   const snap = await getDocs(q);
//   return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
// }
export async function listCustomerLedgers(customerId) {
  const q = query(
    collection(db, "monthly_ledgers"),
    where("customerId", "==", customerId),
  );

  const snap = await getDocs(q);

  const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  return data.sort(
    (a, b) =>
      new Date(b.createdAt?.seconds * 1000) -
      new Date(a.createdAt?.seconds * 1000),
  );
}
/* ------------------------------------------------ */
/* 🔹 Mark Payment */
/* ------------------------------------------------ */

export async function markLedgerPaid({
  customerId,
  monthKey,
  paidAmount,
  paymentMode,
}) {
  const ledgerRef = doc(
    db,
    "monthly_ledgers",
    ledgerDocId(customerId, monthKey),
  );
  const ledgerSnap = await getDoc(ledgerRef);

  if (!ledgerSnap.exists()) throw new Error("Ledger not found");

  const ledger = ledgerSnap.data();
  const netPayable = Number(ledger.netPayable || 0);

  let closingAdvance = 0;
  let closingDue = 0;

  if (paidAmount > netPayable) {
    closingAdvance = paidAmount - netPayable;
  } else if (paidAmount < netPayable) {
    closingDue = netPayable - paidAmount;
  }

  // update ledger
  await updateDoc(ledgerRef, {
    paidAmount,
    paymentMode,
    paymentDate: new Date(),
    closingAdvance,
    closingDue,
    status: "paid",
  });

  // update customer running balances
  const customerRef = doc(db, "customers", customerId);
  await updateDoc(customerRef, {
    runningAdvance: closingAdvance,
    runningDue: closingDue,
  });

  return { closingAdvance, closingDue };
}
/* ------------------------------------------------ */
/* 🔴 Delete Monthly Ledger */
/* ------------------------------------------------ */

export async function deleteMonthlyLedger(customerId, monthKey) {
  const ledgerRef = doc(
    db,
    "monthly_ledgers",
    ledgerDocId(customerId, monthKey),
  );

  const snap = await getDoc(ledgerRef);
  if (!snap.exists()) throw new Error("Ledger not found");

  const ledger = snap.data();

  // ⚠️ If bill was already paid, revert customer balances
  if (ledger.status === "paid") {
    const customerRef = doc(db, "customers", customerId);

    await updateDoc(customerRef, {
      runningAdvance: 0,
      runningDue: 0,
    });
  }

  await deleteDoc(ledgerRef);

  return true;
}