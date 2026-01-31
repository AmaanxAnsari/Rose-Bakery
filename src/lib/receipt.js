import { formatINR } from "./format";

export function makeReceiptText({ customer, monthKey, total, upiId }) {
  return `
Rose Bakery - Credit Receipt

Customer: ${customer?.name || "-"}
Customer ID: ${customer?.customerId || "-"}
Phone: ${customer?.phone || "-"}

Month: ${monthKey}
Total Due: ${formatINR(total)}

Pay via UPI: ${upiId}

Thank you!
`.trim();
}

export function downloadReceipt({ filename = "receipt.txt", text }) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}
