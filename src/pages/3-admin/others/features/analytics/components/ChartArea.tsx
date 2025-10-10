import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
export function ChartArea({ data, x="t", yKeys }:{ data:any[]; x?:string; yKeys:{ key:string; label?:string }[] }) {
  return (
    <div className="h-64 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid stroke="var(--border)" />
          <XAxis dataKey={x} stroke="var(--fg)" />
          <YAxis stroke="var(--fg)" />
          <Tooltip />
          <Legend />
          {yKeys.map(k=>(
            <Area key={k.key} type="monotone" dataKey={k.key} name={k.label ?? k.key}
              fill="var(--color-primary)" stroke="var(--color-primary)" />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}


