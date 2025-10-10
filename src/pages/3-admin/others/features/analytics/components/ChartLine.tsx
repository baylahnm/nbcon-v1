import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

export function ChartLine({ data, x="t", yKeys }:{ data:any[]; x?:string; yKeys:{ key:string; label?:string }[] }) {
  return (
    <div className="h-64 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="var(--border)" />
          <XAxis dataKey={x} stroke="var(--fg)" />
          <YAxis stroke="var(--fg)" />
          <Tooltip />
          <Legend />
          {yKeys.map((k,i)=>(
            <Line key={k.key} type="monotone" dataKey={k.key} name={k.label ?? k.key}
              stroke="var(--color-primary)" strokeWidth={2} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


