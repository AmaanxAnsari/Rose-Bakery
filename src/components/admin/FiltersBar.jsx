import Input from "../common/Input";
import Button from "../common/Button";

export default function FiltersBar({ filters, setFilters, onApply, onReset }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="grid gap-3 md:grid-cols-4">
        <Input
          label="Customer ID"
          placeholder="ROSE001"
          value={filters.customerId}
          onChange={(e) =>
            setFilters((f) => ({
              ...f,
              customerId: e.target.value.toUpperCase(),
            }))
          }
        />
        <Input
          label="From Date"
          type="date"
          value={filters.from}
          onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
        />
        <Input
          label="To Date"
          type="date"
          value={filters.to}
          onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
        />
        <Input
          label="Month Key (YYYY-MM)"
          placeholder="2026-01"
          value={filters.monthKey}
          onChange={(e) =>
            setFilters((f) => ({ ...f, monthKey: e.target.value }))
          }
        />
      </div>

      <div className="mt-4 flex gap-2">
        <Button onClick={onApply}>Apply Filters</Button>
        <Button variant="ghost" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
