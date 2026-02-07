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

export function formatDateTime(createdAt) {
  if (!createdAt) return "--";

  let dateObj;

  // Firestore timestamp support
  if (typeof createdAt?.toDate === "function") {
    dateObj = createdAt.toDate();
  } else {
    dateObj = new Date(createdAt);
  }

  if (isNaN(dateObj.getTime())) return "--";

  const datePart = dateObj.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const timePart = dateObj.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${datePart} • ${timePart}`;
}
export function formatSmartDateTime(createdAt) {
  if (!createdAt) return "--";

  let d;

  // Firestore timestamp support
  if (typeof createdAt?.toDate === "function") {
    d = createdAt.toDate();
  } else {
    d = new Date(createdAt);
  }

  if (isNaN(d.getTime())) return "--";

  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const inputDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const timePart = d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Today
  if (inputDate.getTime() === today.getTime()) {
    return `Today • ${timePart}`;
  }

  // Yesterday
  if (inputDate.getTime() === yesterday.getTime()) {
    return `Yesterday • ${timePart}`;
  }

  // Same year
  if (d.getFullYear() === now.getFullYear()) {
    const datePart = d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
    return `${datePart} • ${timePart}`;
  }

  // Different year
  const fullDate = d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return `${fullDate} • ${timePart}`;
}
