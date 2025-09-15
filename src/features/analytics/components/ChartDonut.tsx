import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
const palette = ["var(--color-primary)","var(--success)","var(--warning)","var(--danger)","var(--border)"];
export function ChartDonut({ data, nameKey="state", valueKey="value" }:{ data:any[]; nameKey?:string; valueKey?:string }) {
  return (
    <div className="h-64 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey={valueKey} nameKey={nameKey} innerRadius="60%">
            {data.map((_:any, i:number) => <Cell key={i} fill={palette[i % palette.length]} />)}
          </Pie>
          <Tooltip /><Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

