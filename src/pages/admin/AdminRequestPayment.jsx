import { useEffect, useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { customerService, creditEntryService } from "../../services";
import { buildUpiUrl } from "../../lib/qr";
import { formatINR } from "../../lib/format";
import { getMonthKey } from "../../lib/filters";
import { makeReceiptText, downloadReceipt } from "../../lib/receipt";
import { upiService } from "../../services/firestore/upi.service";

const SHOP_NAME = "ROSE BAKERY";

function currentMonthKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}


export default function AdminRequestPayment() {
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("ROSE001");
  const [monthKey, setMonthKey] = useState(currentMonthKey());

  const [entries, setEntries] = useState([]);
  const [toast, setToast] = useState("");
  const [activeUpi, setActiveUpi] = useState(null);

  useEffect(() => {
    async function loadUpi() {
      const active = await upiService.getActive();
      setActiveUpi(active);
    }
    loadUpi();
  }, []);

  useEffect(() => {
    async function load() {
      const list = await customerService.listCustomers();
      setCustomers(list);
    }
    load();
  }, []);

  useEffect(() => {
    async function loadEntries() {
      const all = await creditEntryService.listEntriesByCustomer(customerId);
      setEntries(all);
    }
    if (customerId) loadEntries();
  }, [customerId]);

  const customer = useMemo(() => {
    return customers.find((c) => c.customerId === customerId) || null;
  }, [customers, customerId]);

  const monthEntries = useMemo(() => {
    return entries.filter((e) => getMonthKey(e.entryDate) === monthKey);
  }, [entries, monthKey]);

  const total = useMemo(() => {
    return monthEntries.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  }, [monthEntries]);

  const upiUrl = useMemo(() => {
    if (!activeUpi) return "";
    return buildUpiUrl({
      upiId: activeUpi.upiId,
      name: SHOP_NAME,
      amount: total,
      note: `Credit Payment ${monthKey} - ${customerId}`,
    });
  }, [total, monthKey, customerId, activeUpi]);

const whatsappText = useMemo(() => {
  const receipt = makeReceiptText({
    customer,
    monthKey,
    total,
    upiId: activeUpi?.upiId || "Not Configured",
  });

  return `
Hello ${customer?.name || "Customer"} 👋

🧾 ROSE BAKERY CREDIT SUMMARY

Customer ID: ${customerId}
Month: ${monthKey}
Total Due: ${formatINR(total)}

💳 UPI ID: ${activeUpi?.upiId || "Not Configured"}

You can scan the QR or pay directly via UPI ID above.

--- RECEIPT ---
${receipt}

Thank you for your payment 🙏
`.trim();
}, [customer, customerId, monthKey, total, activeUpi]);

  function openWhatsApp() {
    if (!customer?.phone) {
      setToast("Customer phone missing.");
      return;
    }
    const url = `https://wa.me/${customer.phone}?text=${encodeURIComponent(
      whatsappText,
    )}`;
    window.open(url, "_blank");
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-black">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div>
          <p className="text-xs font-semibold text-white/50">ADMIN</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">
            Request Payment
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Generate QR + WhatsApp message for any customer month.
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Left */}
          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-medium text-white/70">
                  Customer
                </label>

                <select
                  className="
      w-full
      rounded-2xl
      border border-white/15
      bg-white/5
      px-4 py-3
      text-sm text-white
      outline-none
      appearance-none
    "
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                >
                  <option value="" className="bg-black text-white">
                    Select customer
                  </option>

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
                placeholder="2026-01"
                value={monthKey}
                onChange={(e) => setMonthKey(e.target.value)}
              />
            </div>

            <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs text-white/50">Total Due</p>
              <p className="mt-1 text-3xl font-semibold text-white">
                {formatINR(total)}
              </p>

              <div className="mt-4 flex gap-2">
                <Button className="w-full" onClick={openWhatsApp}>
                  Send WhatsApp
                </Button>

                <Button
                  className="w-full"
                  variant="ghost"
                  onClick={() => {
                    const receipt = makeReceiptText({
                      customer,
                      monthKey,
                      total,
                      upiId: activeUpi?.upiId || "Not Configured",
                    });
                    downloadReceipt({
                      filename: `receipt_${customerId}_${monthKey}.txt`,
                      text: receipt,
                    });
                  }}
                >
                  Download Receipt
                </Button>
              </div>

              {toast ? (
                <p className="mt-4 text-xs text-red-300">{toast}</p>
              ) : null}
            </div>

            <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs text-white/50">WhatsApp Message</p>
              <textarea
                value={whatsappText}
                readOnly
                className="mt-2 h-40 w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white outline-none"
              />
            </div>
          </div>

          {/* Right */}
          <div className="rounded-3xl border border-white/10 bg-white p-6 text-black">
            <p className="text-xs font-semibold text-black/50">PAYMENT QR</p>
            <h2 className="mt-2 text-xl font-semibold">{SHOP_NAME}</h2>

            <div className="mt-6 flex justify-center">
              <div className="rounded-3xl border border-black/10 p-6 bg-black/[0.03]">
                <QRCodeCanvas value={upiUrl} size={240} />
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-black/10 bg-black/[0.03] p-5">
              <div className="flex justify-between text-sm">
                <span className="text-black/60">Customer</span>
                <span className="font-semibold">{customerId}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-black/60">Month</span>
                <span className="font-semibold">{monthKey}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-black/60">Total</span>
                <span className="font-semibold">{formatINR(total)}</span>
              </div>
            </div>

            <p className="mt-5 text-xs text-black/50">
              UPI ID: {activeUpi?.upiId || "Not Configured"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
