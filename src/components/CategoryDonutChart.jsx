import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getCategoryColor } from "../utils/categories";

function CustomDonutTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="chart-tooltip">
        <div className="chart-tooltip-header">
          <span
            className="chart-tooltip-dot"
            style={{ backgroundColor: data.color }}
          />
          <span className="chart-tooltip-title">{data.name}</span>
        </div>
        <div className="chart-tooltip-body">
          <span className="chart-tooltip-amount">
            ${Number(data.value).toFixed(2)}
          </span>
          <span className="chart-tooltip-pct">
            ({data.percentage.toFixed(1)}%)
          </span>
        </div>
      </div>
    );
  }
  return null;
}

function CategoryDonutChart({ categoryTotals, totalSpent }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const data = Object.entries(categoryTotals)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => {
      const percentage = totalSpent > 0 ? (value / totalSpent) * 100 : 0;
      return {
        name,
        value: Number(value),
        percentage,
        color: getCategoryColor(name),
      };
    });

  if (data.length === 0) {
    return null;
  }

  const activeItem = activeIndex !== null ? data[activeIndex] : null;

  return (
    <div className="donut-chart-container">
      <div className="donut-chart-wrapper">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Tooltip content={<CustomDonutTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={82}
              paddingAngle={3}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="transparent"
                  style={{
                    filter:
                      activeIndex === index
                        ? "drop-shadow(0 4px 6px rgba(0,0,0,0.15))"
                        : "none",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Donut Label */}
        <div className="donut-center-label">
          {activeItem ? (
            <>
              <span className="donut-center-sub">{activeItem.name}</span>
              <span className="donut-center-main">
                ${activeItem.value.toFixed(0)}
              </span>
            </>
          ) : (
            <>
              <span className="donut-center-sub">Total</span>
              <span className="donut-center-main">
                ${totalSpent.toFixed(0)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryDonutChart;
