import { formatINR } from "./format";

/* ----------------------------------------
   MAKE RECEIPT TEXT (ADMIN + CUSTOMER)
----------------------------------------- */

export function makeReceiptText({
  customer,
  monthKey,
  total, // backward compatibility
  totalCredit = 0,
  dueCarried = 0,
  advanceUsed = 0,
  netPayable,
  upiId,
}) {
  // 🔥 If old "total" passed → treat it as netPayable
  const finalPayable =
    typeof netPayable === "number"
      ? netPayable
      : typeof total === "number"
        ? total
        : 0;

  const hasBreakdown =
    totalCredit !== 0 || dueCarried !== 0 || advanceUsed !== 0;

  return `
ROSE BAKERY - MONTHLY CREDIT STATEMENT
---------------------------------------

Customer: ${customer?.name || "-"}
Customer ID: ${customer?.customerId || "-"}
Phone: ${customer?.phone || "-"}

Month: ${monthKey}

${
  hasBreakdown
    ? `
Total Credit: ${formatINR(totalCredit)}
Due Carried: ${formatINR(dueCarried)}
Advance Used: ${formatINR(advanceUsed)}

---------------------------------------
NET PAYABLE: ${formatINR(finalPayable)}
---------------------------------------
`
    : `
Total Due: ${formatINR(finalPayable)}
`
}

Pay via UPI: ${upiId || "Not Configured"}

Generated on: ${new Date().toLocaleString("en-IN")}

Thank you for your continued support 🙏
`.trim();
}

/* ----------------------------------------
   DOWNLOAD RECEIPT
----------------------------------------- */

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
