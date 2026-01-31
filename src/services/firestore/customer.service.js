import customers from "../../mock/customers.json";

// export async function getCustomerById(customerId) {
//   const id = String(customerId).trim().toUpperCase();
//   const found = customers.find((c) => c.customerId === id);
//   await new Promise((r) => setTimeout(r, 250)); // simulate latency
//   return found || null;
// }

// export async function verifyCustomerPasscode(customerId, passcode) {
//   const customer = await getCustomerById(customerId);
//   if (!customer) return { ok: false, message: "Customer not found" };

//   // Phase 1: simple match (later: hashed)
//   if (String(customer.passcode) !== String(passcode)) {
//     return { ok: false, message: "Invalid passcode" };
//   }

//   return { ok: true, customer };
// }

let _customers = [...customers]; // mutable in-memory DB

const wait = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export async function listCustomers() {
  await wait();
  return [..._customers].sort((a, b) =>
    a.customerId.localeCompare(b.customerId),
  );
}

export async function getCustomerById(customerId) {
  const id = String(customerId).trim().toUpperCase();
  await wait();
  return _customers.find((c) => c.customerId === id) || null;
}

export async function createCustomer(payload) {
  await wait();

  const customerId = String(payload.customerId).trim().toUpperCase();

  if (_customers.some((c) => c.customerId === customerId)) {
    return { ok: false, message: "Customer ID already exists" };
  }

  const newCustomer = {
    customerId,
    name: payload.name || "",
    phone: payload.phone || "",
    passcode: payload.passcode || "0000", // phase 1 simple
    status: payload.status || "active",
    createdAt: new Date().toISOString(),
  };

  _customers.unshift(newCustomer);
  return { ok: true, customer: newCustomer };
}

export async function updateCustomer(customerId, updates) {
  await wait();

  const id = String(customerId).trim().toUpperCase();
  const idx = _customers.findIndex((c) => c.customerId === id);

  if (idx === -1) return { ok: false, message: "Customer not found" };

  _customers[idx] = {
    ..._customers[idx],
    ...updates,
    customerId: id,
  };

  return { ok: true, customer: _customers[idx] };
}

export async function deleteCustomer(customerId) {
  await wait();

  const id = String(customerId).trim().toUpperCase();
  const before = _customers.length;
  _customers = _customers.filter((c) => c.customerId !== id);
  const after = _customers.length;

  if (before === after) return { ok: false, message: "Customer not found" };
  return { ok: true };
}

export async function verifyCustomerPasscode(customerId, passcode) {
  const customer = await getCustomerById(customerId);
  if (!customer) return { ok: false, message: "Customer not found" };

  if (String(customer.passcode) !== String(passcode)) {
    return { ok: false, message: "Invalid passcode" };
  }

  return { ok: true, customer };
}
