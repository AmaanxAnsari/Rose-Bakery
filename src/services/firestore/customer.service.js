import customers from "../../mock/customers.json";

export async function getCustomerById(customerId) {
  const id = String(customerId).trim().toUpperCase();
  const found = customers.find((c) => c.customerId === id);
  await new Promise((r) => setTimeout(r, 250)); // simulate latency
  return found || null;
}

export async function verifyCustomerPasscode(customerId, passcode) {
  const customer = await getCustomerById(customerId);
  if (!customer) return { ok: false, message: "Customer not found" };

  // Phase 1: simple match (later: hashed)
  if (String(customer.passcode) !== String(passcode)) {
    return { ok: false, message: "Invalid passcode" };
  }

  return { ok: true, customer };
}
