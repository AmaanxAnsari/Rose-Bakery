export function buildUpiUrl({ upiId, name, amount, note }) {
  const params = new URLSearchParams();
  params.set("pa", upiId);
  params.set("pn", name);
  params.set("am", String(Number(amount || 0)));
  params.set("cu", "INR");
  if (note) params.set("tn", note);

  return `upi://pay?${params.toString()}`;
}
