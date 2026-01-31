export function getMonthKey(dateISO) {
  // dateISO: "YYYY-MM-DD"
  if (!dateISO) return "";
  return dateISO.slice(0, 7);
}

export function groupBy(arr = [], keyFn) {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
}

export function inDateRange(dateISO, fromISO, toISO) {
  if (!dateISO) return false;

  const d = new Date(dateISO);
  const from = fromISO ? new Date(fromISO) : null;
  const to = toISO ? new Date(toISO) : null;

  if (from && d < from) return false;
  if (to) {
    // include end date till 23:59
    const t = new Date(to);
    t.setHours(23, 59, 59, 999);
    if (d > t) return false;
  }

  return true;
}
