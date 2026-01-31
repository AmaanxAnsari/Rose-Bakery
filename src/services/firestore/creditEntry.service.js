import entries from "../../mock/credit_entries.json";
import { todayISO } from "../../lib/format";

let _entries = [...entries]; // in-memory store (mock DB)

export async function addCreditEntry({
  customerId,
  amount,
  createdBy = "customer",
}) {
  const newEntry = {
    id: `e_${Date.now()}`,
    customerId: String(customerId).trim().toUpperCase(),
    amount: Number(amount),
    entryDate: todayISO(),
    createdAt: new Date().toISOString(),
    createdBy,
  };

  _entries.unshift(newEntry);
  await new Promise((r) => setTimeout(r, 250));
  return newEntry;
}

export async function listEntriesByCustomer(customerId) {
  const id = String(customerId).trim().toUpperCase();
  await new Promise((r) => setTimeout(r, 250));
  return _entries.filter((e) => e.customerId === id);
}

export async function listEntries() {
  await new Promise((r) => setTimeout(r, 250));
  return _entries;
}
