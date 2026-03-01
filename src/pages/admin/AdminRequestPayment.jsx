import { useEffect, useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { customerService } from "../../services";
import { ledgerService } from "../../services";
import { buildUpiUrl } from "../../lib/qr";
import { formatINR } from "../../lib/format";
import { makeReceiptText, downloadReceipt } from "../../lib/receipt";
import { upiService } from "../../services/firestore/upi.service";

const SHOP_NAME = "ROSE BAKERY";

function currentMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default function AdminRequestPayment() {
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [monthKey, setMonthKey] = useState(currentMonthKey());
  const [ledger, setLedger] = useState(null);
  const [activeUpi, setActiveUpi] = useState(null);
  const [toast, setToast] = useState("");

  /* ---------------- Load UPI ---------------- */

  useEffect(() => {
    async function loadUpi() {
      const active = await upiService.getActive();
      setActiveUpi(active);
    }
    loadUpi();
  }, []);

  /* ---------------- Load Customers ---------------- */

  useEffect(() => {
    async function loadCustomers() {
      const list = await customerService.listCustomers();
      setCustomers(list);
      if (list.length) setCustomerId(list[0].customerId);
    }
    loadCustomers();
  }, []);

  /* ---------------- Load / Generate Ledger ---------------- */
  // FULL CLEAN VERSION

  // 🔥 ONLY CHANGE: remove auto-generation from useEffect

  useEffect(() => {
    async function loadLedger() {
      if (!customerId || !monthKey) return;

      const isValidMonth = /^\d{4}-(0[1-9]|1[0-2])$/.test(monthKey);
      if (!isValidMonth) {
        setLedger(null);
        return;
      }

      const data = await ledgerService.getMonthlyLedger(customerId, monthKey);

      setLedger(data);
    }

    loadLedger();
  }, [customerId, monthKey]);

  async function handleGenerateLedger() {
    const isValidMonth = /^\d{4}-(0[1-9]|1[0-2])$/.test(monthKey);
    if (!isValidMonth) {
      setToast("Invalid Month Format (YYYY-MM)");
      return;
    }

    const existing = await ledgerService.getMonthlyLedger(customerId, monthKey);

    if (existing) {
      setToast("Ledger already exists for this month.");
      return;
    }

    const customer = customers.find((c) => c.customerId === customerId);
    if (!customer) return;

    const newLedger = await ledgerService.generateMonthlyLedger(
      customerId,
      customer.name,
      monthKey,
    );

    setLedger(newLedger);
    setToast("Ledger generated successfully.");
  }

  const customer = useMemo(
    () => customers.find((c) => c.customerId === customerId) || null,
    [customers, customerId],
  );

  /* ---------------- Ledger Values ---------------- */

  const totalCredit = ledger?.totalCredit || 0;
  const dueCarried = ledger?.dueCarried || 0;
  const advanceUsed = ledger?.advanceUsed || 0;
  const netPayable = ledger?.netPayable || 0;

  /* ---------------- UPI URL ---------------- */

  const upiUrl = useMemo(() => {
    if (!activeUpi) return "";
    return buildUpiUrl({
      upiId: activeUpi.upiId,
      name: SHOP_NAME,
      amount: netPayable,
      note: `Credit Payment ${monthKey} - ${customerId}`,
    });
  }, [activeUpi, netPayable, monthKey, customerId]);

  /* ---------------- WhatsApp Message ---------------- */

  const whatsappText = useMemo(() => {
    return `
Hello ${customer?.name || "Customer"} 👋

🧾 ROSE BAKERY MONTHLY STATEMENT

Customer ID: ${customerId}
Month: ${monthKey}

Total Credit: ${formatINR(totalCredit)}
Due Carried: ${formatINR(dueCarried)}
Advance Used: ${formatINR(advanceUsed)}

💰 Net Payable: ${formatINR(netPayable)}

💳 UPI ID: ${activeUpi?.upiId || "Not Configured"}

Please complete the payment at your convenience.

Thank you 🙏
`.trim();
  }, [
    customer,
    customerId,
    monthKey,
    totalCredit,
    dueCarried,
    advanceUsed,
    netPayable,
    activeUpi,
  ]);

  function openWhatsApp() {
    if (!customer?.phone) {
      setToast("Customer phone missing.");
      return;
    }

    // Remove non-digits (spaces, +, -, etc.)
    const cleanPhone = customer.phone.replace(/\D/g, "");

    // Add 91 if not already present
    const phoneWithCode = cleanPhone.startsWith("91")
      ? cleanPhone
      : `91${cleanPhone}`;

    const url = `https://wa.me/${phoneWithCode}?text=${encodeURIComponent(
      whatsappText,
    )}`;

    window.open(url, "_blank");
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-black">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-xs font-semibold text-white/50">ADMIN</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">
          Request Payment
        </h1>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* LEFT SIDE */}
          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-xs text-white/70">Customer</label>
                <select
                  className="w-full  rounded-2xl bg-white/5 border border-white/15 px-4 py-3 text-white"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                >
                  {customers.map((c) => (
                    <option
                      key={c.customerId}
                      value={c.customerId}
                      className="bg-black text-white"
                    >
                      {c.customerId} — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Month Key"
                value={monthKey}
                onChange={(e) => setMonthKey(e.target.value)}
              />
            </div>

            {/* Breakdown Card */}
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5 space-y-3">
              <div className="flex justify-between text-white">
                <span>Total Credit</span>
                <span>{formatINR(totalCredit)}</span>
              </div>

              <div className="flex justify-between text-amber-400">
                <span>Due Carried</span>
                <span>{formatINR(dueCarried)}</span>
              </div>

              <div className="flex justify-between text-blue-400">
                <span>Advance Used</span>
                <span>{formatINR(advanceUsed)}</span>
              </div>

              <div className="flex justify-between text-lg font-semibold text-white">
                <span>Net Payable</span>
                <span>{formatINR(netPayable)}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-5 flex gap-3">
              {!ledger && (
                <Button className="w-full mt-4" onClick={handleGenerateLedger}>
                  Generate Ledger
                </Button>
              )}
              <Button
                className="w-full"
                onClick={openWhatsApp}
                disabled={!netPayable}
              >
                Send WhatsApp
              </Button>

              <Button
                className="w-full"
                variant="ghost"
                onClick={() => {
                  const receipt = makeReceiptText({
                    customer,
                    monthKey,
                    totalCredit,
                    dueCarried,
                    advanceUsed,
                    netPayable,
                    upiId: activeUpi?.upiId || "Not Configured",
                  });

                  downloadReceipt({
                    filename: `receipt_${customerId}_${monthKey}.txt`,
                    text: receipt,
                  });
                }}
              >
                Download Invoice
              </Button>
            </div>

            {/* WhatsApp Preview */}
            <div className="mt-4 rounded-3xl border border-white/10 bg-black p-3">
              <div className="max-h-30 overflow-y-auto rounded-xl bg-zinc-900 p-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                <pre className="text-xs text-green-400 whitespace-pre-wrap wrap-break-word">
                  {whatsappText}
                </pre>
              </div>
            </div>

            {toast && <p className="mt-4 text-xs text-red-300">{toast}</p>}
          </div>

          {/* RIGHT SIDE QR */}
          <div className="rounded-2xl border border-white/10 bg-white p-5 text-black">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold tracking-wide text-black/50">
                  PAYMENT QR
                </p>
                <h2 className="text-lg font-semibold">{SHOP_NAME}</h2>
              </div>

              <div className="text-right text-xs text-black/60">
                <p>{customerId}</p>
                <p>{monthKey}</p>
              </div>
            </div>

            {/* QR */}
            <div className="mt-4 flex justify-center">
              <QRCodeCanvas value={upiUrl} size={180} />
            </div>

            {/* Compact Breakdown */}
            <div className="mt-4 rounded-2xl border border-black/10 bg-black/[0.04] p-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span>Total Credit</span>
                <span>{formatINR(totalCredit)}</span>
              </div>

              <div className="flex justify-between text-amber-600">
                <span>Due Carried</span>
                <span>{formatINR(dueCarried)}</span>
              </div>

              <div className="flex justify-between text-blue-600">
                <span>Advance Used</span>
                <span>{formatINR(advanceUsed)}</span>
              </div>

              <div className="flex justify-between font-semibold text-sm pt-2 border-t border-black/10">
                <span>Net Payable</span>
                <span>{formatINR(netPayable)}</span>
              </div>
            </div>

            <p className="mt-4 text-[11px] text-black/50 text-center">
              UPI ID: {activeUpi?.upiId || "Not Configured"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}