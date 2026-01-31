export function isValidCustomerId(id = "") {
  return /^ROSE\d{3}$/.test(String(id).trim().toUpperCase());
}

export function isValidAmount(amount) {
  const n = Number(amount);
  return Number.isFinite(n) && n > 0;
}

export function isValidPasscode(code = "") {
  return /^\d{4}$/.test(String(code).trim());
}
