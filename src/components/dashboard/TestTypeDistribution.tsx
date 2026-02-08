import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Chemical Testing", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Mechanical Testing", value: 28, color: "hsl(var(--chart-2))" },
  { name: "Electrical Testing", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Environmental", value: 12, color: "hsl(var(--chart-4))" },
  { name: "Other", value: 5, color: "hsl(var(--chart-5))" },
];

export function TestTypeDistribution() {
  return (
    <div className="bg-card rounded-xl border border-border/60 p-6 shadow-card">
      <div className="mb-6">
        <h3 className="text-base font-semibold tracking-tight">Test Distribution</h3>
        <p className="text-sm text-muted-foreground mt-0.5">By test category this month</p>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value: number) => [`${value}%`, "Percentage"]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-sm text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
