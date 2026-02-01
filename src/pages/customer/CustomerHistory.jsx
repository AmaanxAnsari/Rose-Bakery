import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { creditEntryService } from "../../services";
import { groupBy } from "../../lib/filters";
import { formatINR, formatTime } from "../../lib/format";

export default function CustomerHistory() {
  const user = useSelector((s) => s.auth.user);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    async function load() {
      const list = await creditEntryService.listEntriesByCustomer(user?.id);
      setEntries(list);
    }
    if (user?.id) load();
  }, [user?.id]);

  const grouped = useMemo(() => {
    return groupBy(entries, (e) => e.entryDate);
  }, [entries]);

  const dates = useMemo(() => {
    return Object.keys(grouped).sort((a, b) => b.localeCompare(a));
  }, [grouped]);

  return (
    <div className="min-h-[calc(100vh-140px)] bg-black">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div>
          <p className="text-xs font-semibold text-white/50">CUSTOMER</p>
          <h1 className="mt-1 text-2xl font-semibold text-white">
            Credit History
          </h1>
          <p className="mt-1 text-sm text-white/60">
            View all your credit entries date-wise.
          </p>
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950 p-5">
          {dates.map((date) => {
            const dayEntries = grouped[date] || [];
            const dayTotal = dayEntries.reduce(
              (sum, e) => sum + Number(e.amount || 0),
              0,
            );

            return (
              <div
                key={date}
                className="mb-4 overflow-hidden rounded-3xl border border-white/10 bg-white/5"
              >
                <div className="flex items-center justify-between px-5 py-4">
                  <p className="text-sm font-semibold text-white">{date}</p>
                  <p className="text-sm font-semibold text-white">
                    {formatINR(dayTotal)}
                  </p>
                </div>

                <div className="border-t border-white/10">
                  {dayEntries.map((e) => (
                    <div
                      key={e.id}
                      className="flex items-center justify-between px-5 py-3 text-sm"
                    >
                      <p className="text-white/70">
                        Entry • {formatTime(e.createdAt)}
                      </p>
                      <p className="font-semibold text-white">
                        {formatINR(e.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {dates.length === 0 ? (
            <p className="text-sm text-white/50 text-center py-10">
              No credit entries yet.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
