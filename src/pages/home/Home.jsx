import { useMemo, useState } from "react";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import {
  isValidAmount,
  isValidCustomerId,
  isValidPasscode,
} from "../../lib/validators";
import { formatINR } from "../../lib/format";
import { customerService, creditEntryService } from "../../services";
import LoadingScreen from "../../components/LoadingScreen";

export default function Home() {
  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState("");
  const [passcode, setPasscode] = useState("");

  const [openPasscode, setOpenPasscode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({ type: "", message: "" });

  const errors = useMemo(() => {
    const e = {};
    if (customerId && !isValidCustomerId(customerId))
      e.customerId = "Format should be like ROSE001";
    if (amount && !isValidAmount(amount)) e.amount = "Enter valid amount";
    return e;
  }, [customerId, amount]);

  const canSubmit = isValidCustomerId(customerId) && isValidAmount(amount);

  async function handleOpenPasscode() {
    setToast({ type: "", message: "" });

    if (!canSubmit) {
      setToast({
        type: "error",
        message: "Please enter valid Customer ID and Amount.",
      });
      return;
    }

    // Check customer exists
    setLoading(true);
    const customer = await customerService.getCustomerById(customerId);
    setLoading(false);

    if (!customer) {
      setToast({
        type: "error",
        message: "Customer ID not found. Please check again.",
      });
      return;
    }

    setOpenPasscode(true);
  }

  async function handleConfirmPasscode() {
    setToast({ type: "", message: "" });

    if (!isValidPasscode(passcode)) {
      setToast({ type: "error", message: "Passcode must be 4 digits." });
      return;
    }

    setLoading(true);

    const verify = await customerService.verifyCustomerPasscode(
      customerId,
      passcode,
    );
    if (!verify.ok) {
      setLoading(false);
      setToast({
        type: "error",
        message: verify.message || "Invalid passcode",
      });
      return;
    }

    await creditEntryService.addCreditEntry({
      customerId,
      amount,
      createdBy: "customer",
    });

    setLoading(false);
    setOpenPasscode(false);
    setPasscode("");
    setAmount("");
    setToast({ type: "success", message: "Entry saved successfully ✅" });
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-black">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6">
            <p className="text-xs font-semibold text-white/50">
              CUSTOMER ENTRY
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-white">
              Add today’s credit in seconds.
            </h1>
            <p className="mt-2 text-sm text-white/60">
              Enter your Customer ID and amount. Confirm with 4-digit passcode.
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <Input
                label="Customer ID"
                placeholder="ROSE001"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value.toUpperCase())}
                error={errors.customerId}
              />

              <Input
                label="Amount (INR)"
                placeholder="e.g. 120"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                error={errors.amount}
              />

              <Button
                className="w-full py-3"
                disabled={!canSubmit || loading}
                onClick={handleOpenPasscode}
              >
                {loading ? "Please wait..." : "Submit Entry"}
              </Button>

              {toast.message ? (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    toast.type === "success"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                      : "border-red-500/30 bg-red-500/10 text-red-200"
                  }`}
                >
                  {toast.message}
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white p-6 text-black">
            <p className="text-xs font-semibold text-black/50">SUMMARY</p>
            <h2 className="mt-2 text-xl font-semibold">You are adding</h2>

            <div className="mt-5 rounded-3xl border border-black/10 bg-black/[0.03] p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-black/60">Customer</p>
                <p className="text-sm font-semibold">{customerId || "—"}</p>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm text-black/60">Amount</p>
                <p className="text-lg font-semibold">
                  {amount ? formatINR(amount) : "—"}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm text-black/60">Secure confirmation</p>
                <p className="text-sm font-semibold">4-digit passcode</p>
              </div>
            </div>

            <div className="mt-6 text-xs text-black/50">
              Tip: Always confirm passcode so wrong entries never happen.
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={openPasscode}
        title="Confirm Passcode"
        onClose={() => {
          if (!loading) setOpenPasscode(false);
        }}
      >
        <div className="space-y-4">
          <Input
            label="4-digit Passcode"
            placeholder="••••"
            maxLength={4}
            inputMode="numeric"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ""))}
          />

          <div className="flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setOpenPasscode(false)}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              className="w-full"
              onClick={handleConfirmPasscode}
              disabled={loading}
            >
              {loading ? <LoadingScreen label="Saving..." /> : "Confirm & Save"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
