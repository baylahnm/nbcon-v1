import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
export function ChartBar({ data, xKey, yKey }:{ data:any[]; xKey:string; yKey:string }) {
  return (
    <div className="h-64 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="var(--border)" />
          <XAxis dataKey={xKey} stroke="var(--fg)" />
          <YAxis stroke="var(--fg)" />
          <Tooltip />
          <Bar dataKey={yKey} fill="var(--color-primary)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

