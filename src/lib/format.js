export function formatINR(amount = 0) {
  const n = Number(amount || 0);
  return n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

export function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function formatTime(createdAt) {
  if (!createdAt) return "--";

  const options = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // ✅ forces AM/PM
  };

  // Firestore Timestamp object support
  if (typeof createdAt?.toDate === "function") {
    return createdAt.toDate().toLocaleTimeString([], options);
  }

  // ISO string / Date
  const d = new Date(createdAt);
  if (isNaN(d.getTime())) return "--";

  return d.toLocaleTimeString([], options);
}
