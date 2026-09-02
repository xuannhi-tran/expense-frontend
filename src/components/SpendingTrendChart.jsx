import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Activity } from "lucide-react";

function CustomTrendTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="chart-tooltip">
        <span className="chart-tooltip-title">{data.name || label}</span>
        <div className="chart-tooltip-body">
          <span className="chart-tooltip-amount">
            ${Number(payload[0].value).toFixed(2)}
          </span>
          {data.category && (
            <span className="chart-tooltip-sub">({data.category})</span>
          )}
        </div>
      </div>
    );
  }
  return null;
}

function SpendingTrendChart({ allExpenses }) {
  // Prepare activity sequence data from available expense records
  const activityData = useMemo(() => {
    const list = [...(allExpenses || [])];
    // Limit to latest 12 transactions for a clean readable curve
    return list
      .slice(-12)
      .map((item, index) => ({
        index: index + 1,
        name: item.name && item.name.length > 12 ? `${item.name.slice(0, 10)}...` : item.name || `Entry ${index + 1}`,
        amount: Number(item.amount || 0),
        category: item.category || "Other",
      }));
  }, [allExpenses]);

  if (!allExpenses || allExpenses.length === 0) {
    return null;
  }

  return (
    <div className="card trend-chart-card">
      <div className="card-header">
        <h2 className="card-header-title">
          <Activity size={18} />
          <span>Expense Activity</span>
        </h2>
        <span className="card-badge">
          Recent {activityData.length} records
        </span>
      </div>

      <div className="card-body chart-body">
        <div className="trend-chart-container">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={activityData}
              margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-base, #e2e8f0)"
                opacity={0.3}
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "var(--text-muted, #94a3b8)" }}
                axisLine={{ stroke: "var(--border-base, #e2e8f0)", opacity: 0.4 }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--text-muted, #94a3b8)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip content={<CustomTrendTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#spendGradient)"
                dot={{ r: 3.5, fill: "#3b82f6", strokeWidth: 1.5, stroke: "#ffffff" }}
                activeDot={{ r: 6, fill: "#2563eb", stroke: "#ffffff", strokeWidth: 2 }}
                animationDuration={600}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default SpendingTrendChart;
