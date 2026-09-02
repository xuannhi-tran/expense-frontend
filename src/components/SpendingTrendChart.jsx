import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { TrendingUp, BarChart3, Activity } from "lucide-react";
import { getCategoryColor } from "../utils/categories";

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
  const [chartType, setChartType] = useState("area"); // 'area' | 'bar'

  // Prepare trend data (recent transactions in chronological sequence)
  const trendData = useMemo(() => {
    const list = [...(allExpenses || [])];
    // Limit to latest 10-15 transactions for readable curve
    return list
      .slice(-12)
      .map((item, index) => ({
        index: index + 1,
        name: item.name.length > 12 ? `${item.name.slice(0, 10)}...` : item.name,
        amount: Number(item.amount || 0),
        category: item.category || "Other",
      }));
  }, [allExpenses]);

  // Prepare Category Comparison Bar Data
  const categoryBarData = useMemo(() => {
    const totals = (allExpenses || []).reduce((acc, item) => {
      const cat = item.category || "Other";
      acc[cat] = (acc[cat] || 0) + Number(item.amount || 0);
      return acc;
    }, {});

    return Object.entries(totals).map(([cat, total]) => ({
      name: cat,
      amount: total,
      color: getCategoryColor(cat),
    }));
  }, [allExpenses]);

  if (!allExpenses || allExpenses.length === 0) {
    return null;
  }

  return (
    <div className="card trend-chart-card">
      <div className="card-header">
        <h2 className="card-header-title">
          <TrendingUp size={18} />
          <span>Spending Analytics</span>
        </h2>

        {/* View Mode Toggle Switch */}
        <div className="chart-toggle-group">
          <button
            type="button"
            className={`chart-toggle-btn ${chartType === "area" ? "active" : ""}`}
            onClick={() => setChartType("area")}
            title="Transaction Activity Curve"
          >
            <Activity size={14} />
            <span>Activity</span>
          </button>
          <button
            type="button"
            className={`chart-toggle-btn ${chartType === "bar" ? "active" : ""}`}
            onClick={() => setChartType("bar")}
            title="Category Comparison Bars"
          >
            <BarChart3 size={14} />
            <span>Categories</span>
          </button>
        </div>
      </div>

      <div className="card-body chart-body">
        <div className="trend-chart-container">
          {chartType === "area" ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart
                data={trendData}
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
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
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
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={categoryBarData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip content={<CustomTrendTooltip />} />
                <Bar
                  dataKey="amount"
                  radius={[6, 6, 0, 0]}
                  animationDuration={800}
                >
                  {categoryBarData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpendingTrendChart;
