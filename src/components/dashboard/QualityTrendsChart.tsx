import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { month: "Aug", passRate: 92, failRate: 8, total: 145 },
  { month: "Sep", passRate: 89, failRate: 11, total: 162 },
  { month: "Oct", passRate: 94, failRate: 6, total: 178 },
  { month: "Nov", passRate: 91, failRate: 9, total: 189 },
  { month: "Dec", passRate: 95, failRate: 5, total: 156 },
  { month: "Jan", passRate: 93, failRate: 7, total: 201 },
];

export function QualityTrendsChart() {
  return (
    <div className="bg-card rounded-xl border border-border/60 p-6 shadow-card">
      <div className="mb-6">
        <h3 className="text-base font-semibold tracking-tight">Quality Trends</h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Pass/fail rates over the last 6 months
        </p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="passRate"
              name="Pass Rate"
              stroke="hsl(var(--success))"
              strokeWidth={2.5}
              dot={{ fill: "hsl(var(--success))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="failRate"
              name="Fail Rate"
              stroke="hsl(var(--destructive))"
              strokeWidth={2.5}
              dot={{ fill: "hsl(var(--destructive))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
