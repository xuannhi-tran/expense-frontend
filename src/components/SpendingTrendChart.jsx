import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { TrendingUp, ReceiptText } from "lucide-react";

/**
 * buildDailySpendingData
 * - Generates all 30 calendar days for the last 30 days (including today)
 * - Initialises each day with 0 spending and 0 count to prevent gaps
 * - Populates amounts based on created_at in browser local timezone
 * - Returns chronological array (oldest on left -> newest on right)
 */
function buildDailySpendingData(expenses = []) {
  const buckets = [];
  const bucketMap = new Map();

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Generate 30 days: oldest (today - 29 days) -> newest (today)
  for (let i = 29; i >= 0; i--) {
    const d = new Date(todayStart.getFullYear(), todayStart.getMonth(), todayStart.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const key = `${year}-${month}-${day}`;

    const item = {
      key,
      dateObj: d,
      dateLabel: d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      fullDate: d.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      amount: 0,
      count: 0,
    };
    buckets.push(item);
    bucketMap.set(key, item);
  }

  // Populate from expenses
  if (Array.isArray(expenses)) {
    expenses.forEach((expense) => {
      if (!expense || !expense.created_at) return;
      const date = new Date(expense.created_at);
      if (Number.isNaN(date.getTime())) return;

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const key = `${year}-${month}-${day}`;

      if (bucketMap.has(key)) {
        const bucket = bucketMap.get(key);
        const amt = Number(expense.amount) || 0;
        bucket.amount = Number((bucket.amount + amt).toFixed(2));
        bucket.count += 1;
      }
    });
  }

  return buckets;
}

/**
 * buildMonthlySpendingData
 * - Generates exactly 12 month buckets (current month + previous 11 months)
 * - Initialises each month with 0 spending and 0 count
 * - Populates amounts based on created_at in browser local timezone
 * - Returns chronological array (oldest month on left -> current month on right)
 */
function buildMonthlySpendingData(expenses = []) {
  const buckets = [];
  const bucketMap = new Map();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Generate 12 months: oldest (current - 11 months) -> newest (current month)
  for (let i = 11; i >= 0; i--) {
    const d = new Date(currentYear, currentMonth - i, 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const key = `${year}-${month}`;

    const shortYear = String(year).slice(-2);
    const monthName = d.toLocaleDateString(undefined, { month: "short" });
    const dateLabel = `${monthName} '${shortYear}`;
    const fullDate = d.toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });

    const item = {
      key,
      dateObj: d,
      dateLabel,
      fullDate,
      amount: 0,
      count: 0,
    };
    buckets.push(item);
    bucketMap.set(key, item);
  }

  // Populate from expenses
  if (Array.isArray(expenses)) {
    expenses.forEach((expense) => {
      if (!expense || !expense.created_at) return;
      const date = new Date(expense.created_at);
      if (Number.isNaN(date.getTime())) return;

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const key = `${year}-${month}`;

      if (bucketMap.has(key)) {
        const bucket = bucketMap.get(key);
        const amt = Number(expense.amount) || 0;
        bucket.amount = Number((bucket.amount + amt).toFixed(2));
        bucket.count += 1;
      }
    });
  }

  return buckets;
}

function CustomSpendingTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const count = data.count || 0;
    const countText = `${count} ${count === 1 ? "transaction" : "transactions"}`;

    return (
      <div className="chart-tooltip">
        <span className="chart-tooltip-title">{data.fullDate || data.dateLabel}</span>
        <div
          className="chart-tooltip-body"
          style={{ display: "flex", flexDirection: "column", gap: "3px", marginTop: "4px" }}
        >
          <span className="chart-tooltip-amount">
            ${Number(data.amount).toFixed(2)} spent
          </span>
          <span className="chart-tooltip-sub" style={{ fontSize: "11.5px", opacity: 0.85 }}>
            {countText}
          </span>
        </div>
      </div>
    );
  }
  return null;
}

function SpendingTrendChart({ allExpenses = [] }) {
  const [mode, setMode] = useState("daily"); // "daily" | "monthly"

  // Derive Daily (last 30 days) and Monthly (last 12 months) datasets from allExpenses
  const dailyData = useMemo(() => {
    return buildDailySpendingData(allExpenses);
  }, [allExpenses]);

  const monthlyData = useMemo(() => {
    return buildMonthlySpendingData(allExpenses);
  }, [allExpenses]);

  const chartData = mode === "daily" ? dailyData : monthlyData;

  if (!allExpenses || allExpenses.length === 0) {
    return (
      <div className="card trend-chart-card">
        <div className="card-header chart-header-row">
          <div className="chart-title-group">
            <h2 className="card-header-title">
              <TrendingUp size={18} />
              <span>Spending Over Time</span>
            </h2>
            <span className="card-badge">Daily spending · Last 30 days</span>
          </div>
        </div>
        <div className="card-body chart-body">
          <div className="empty-state-box" style={{ padding: "32px 16px" }}>
            <div className="empty-state-icon">
              <ReceiptText size={28} />
            </div>
            <h4 className="empty-state-title">No spending data yet</h4>
            <p className="empty-state-desc">
              Add an expense to start building your spending history.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const badgeText =
    mode === "daily"
      ? "Daily spending · Last 30 days"
      : "Monthly spending · Last 12 months";

  return (
    <div className="card trend-chart-card">
      <div className="card-header chart-header-row">
        <div className="chart-title-group">
          <h2 className="card-header-title">
            <TrendingUp size={18} />
            <span>Spending Over Time</span>
          </h2>
          <span className="card-badge">{badgeText}</span>
        </div>

        {/* Segmented Time Range Toggle */}
        <div className="chart-range-toggle" role="group" aria-label="Time range selector">
          <button
            type="button"
            className={`btn-toggle-segment ${mode === "daily" ? "active" : ""}`}
            onClick={() => setMode("daily")}
            aria-pressed={mode === "daily"}
          >
            Daily
          </button>
          <button
            type="button"
            className={`btn-toggle-segment ${mode === "monthly" ? "active" : ""}`}
            onClick={() => setMode("monthly")}
            aria-pressed={mode === "monthly"}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="card-body chart-body">
        <div className="trend-chart-container">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 15, left: -15, bottom: 0 }}
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
                dataKey="dateLabel"
                tick={{ fontSize: 11, fill: "var(--text-muted, #94a3b8)" }}
                axisLine={{ stroke: "var(--border-base, #e2e8f0)", opacity: 0.4 }}
                tickLine={false}
                interval={mode === "daily" ? 4 : 0}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--text-muted, #94a3b8)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip content={<CustomSpendingTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#spendGradient)"
                dot={{ r: 3.5, fill: "#3b82f6", strokeWidth: 1.5, stroke: "#ffffff" }}
                activeDot={{ r: 6, fill: "#2563eb", stroke: "#ffffff", strokeWidth: 2 }}
                animationDuration={400}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default SpendingTrendChart;
