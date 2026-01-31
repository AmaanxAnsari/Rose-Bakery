import { useEffect, useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useSelector } from "react-redux";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { creditEntryService, customerService } from "../../services";
import { formatINR } from "../../lib/format";
import { getMonthKey } from "../../lib/filters";
import { buildUpiUrl } from "../../lib/qr";
import { makeReceiptText, downloadReceipt } from "../../lib/receipt";

const UPI_ID = "rosebakery@upi"; // dummy for now
const SHOP_NAME = "ROSE BAKERY";

export default function CustomerPayment() {
  const user = useSelector((s) => s.auth.user);
  const [entries, setEntries] = useState([]);
  const [customer, setCustomer] = useState(null);

  const [monthKey, setMonthKey] = useState("2026-01");

  useEffect(() => {
    async function load() {
      const list = await creditEntryService.listEntriesByCustomer(user?.id);
      setEntries(list);

      const c = await customerService.getCustomerById(user?.id);
      setCustomer(c);
    }
    if (user?.id) load();
  }, [user?.id]);

  const monthEntries = useMemo(() => {
    return entries.filter((e) => getMonthKey(e.entryDate) === monthKey);
  }, [entries, monthKey]);

  const total = useMemo(() => {
    return monthEntries.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  }, [monthEntries]);

  const upiUrl = useMemo(() => {
    return buildUpiUrl({
      upiId: UPI_ID,
      name: SHOP_NAME,
      amount: total,
      note: `Credit Payment ${monthKey} - ${user?.id}`,
    });
  }, [total, monthKey, user?.id]);

  return (
    <div className="min-h-[calc(100vh-140px)] bg-black">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div>
          <p className="text-xs font-semibold text-white/50">CUSTOMER</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">
            Make Payment
          </h1>
          <p className="mt-1 text-sm text-white/60">
            View month total and pay via QR.
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Left */}
          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5">
            <Input
              label="Month Key (YYYY-MM)"
              placeholder="2026-01"
              value={monthKey}
              onChange={(e) => setMonthKey(e.target.value)}
            />

            <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs text-white/50">Customer</p>
              <p className="mt-1 text-white font-semibold">
                {customer?.name || "—"} ({user?.id})
              </p>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-white/60">Total Due</p>
                <p className="text-xl font-semibold text-white">
                  {formatINR(total)}
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  className="w-full"
                  onClick={() => {
                    const receipt = makeReceiptText({
                      customer: { ...customer, customerId: user?.id },
                      monthKey,
                      total,
                      upiId: UPI_ID,
                    });

                    downloadReceipt({
                      filename: `receipt_${user?.id}_${monthKey}.txt`,
                      text: receipt,
                    });
                  }}
                >
                  Download Receipt
                </Button>

                <Button
                  className="w-full"
                  variant="ghost"
                  onClick={() => {
                    // Copy UPI link
                    navigator.clipboard.writeText(upiUrl);
                    alert("UPI Payment link copied ✅");
                  }}
                >
                  Copy UPI Link
                </Button>
              </div>

              <p className="mt-4 text-xs text-white/40">
                You can pay by scanning QR or sharing UPI link.
              </p>
            </div>

            <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs text-white/50 mb-2">Entries count</p>
              <p className="text-white font-semibold">{monthEntries.length}</p>
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
                <span className="text-black/60">Month</span>
                <span className="font-semibold">{monthKey}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-black/60">Total</span>
                <span className="font-semibold">{formatINR(total)}</span>
              </div>
            </div>

            <p className="mt-5 text-xs text-black/50">
              UPI ID: {UPI_ID} (dummy)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
