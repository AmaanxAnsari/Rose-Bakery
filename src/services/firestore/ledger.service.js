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

export async function generateMonthlyLedger(customerId, monthKey) {
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
  const netPayable = totalCredit - runningAdvance + runningDue;

  // 4️⃣ create ledger
  const ledgerRef = doc(
    db,
    "monthly_ledgers",
    ledgerDocId(customerId, monthKey),
  );

  const ledgerData = {
    customerId,
    monthKey,
    totalCredit,
    advanceUsed: runningAdvance,
    dueCarried: runningDue,
    netPayable: netPayable < 0 ? 0 : netPayable,

    paidAmount: 0,
    paymentMode: null,
    paymentDate: null,

    closingAdvance: runningAdvance,
    closingDue: netPayable,

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
