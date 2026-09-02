import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { getCategoryColor } from "../utils/categories";

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
        <ResponsiveContainer width="100%" height={210}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={84}
              paddingAngle={3}
              dataKey="value"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              animationDuration={600}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="transparent"
                  style={{
                    filter:
                      activeIndex === index
                        ? "drop-shadow(0 4px 10px rgba(0,0,0,0.35))"
                        : "none",
                    cursor: "pointer",
                    transform: activeIndex === index ? "scale(1.04)" : "scale(1)",
                    transformOrigin: "center center",
                    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Dynamic Center Donut Readout */}
        <div className="donut-center-label">
          {activeItem ? (
            <>
              <span
                className="donut-center-sub"
                style={{ color: activeItem.color, fontWeight: 700 }}
              >
                {activeItem.name}
              </span>
              <span className="donut-center-main">
                ${activeItem.value.toFixed(2)}
              </span>
              <span className="donut-center-pct">
                {activeItem.percentage.toFixed(1)}% of total
              </span>
            </>
          ) : (
            <>
              <span className="donut-center-sub">Total Spent</span>
              <span className="donut-center-main">
                ${totalSpent.toFixed(2)}
              </span>
              <span className="donut-center-pct">
                {data.length} {data.length === 1 ? "category" : "categories"}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoryDonutChart;
