"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState } from "react";

export default function LeaveStatsChart({ leaves }) {
  if (!leaves || leaves.length === 0) {
    return (
      <div className="text-center text-gray-400 p-6 rounded-3xl bg-gray-900 shadow-md">
        No leave data available to display 📊
      </div>
    );
  }

  // Count leaves by status dynamically
  const stats = leaves.reduce((acc, leave) => {
    const status = leave.status || "Pending";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  if (leaves.deletedCount) {
    stats.Deleted = leaves.deletedCount;
  }

  const data = Object.keys(stats).map((status) => ({
    name: status,
    value: stats[status],
  }));

  const COLORS = {
    Approved: "#10b981", // Green
    Rejected: "#ef4444", // Red
    Pending: "#fbbf24",  // Yellow
    Deleted: "#6b7280",  // Gray
  };

  const HOVER_COLORS = {
    Approved: "#059669", // Dark Green
    Rejected: "#b91c1c", // Dark Red
    Pending: "#f59e0b",  // Dark Yellow
    Deleted: "#4b5563",  // Dark Gray
  };

  const [activeIndex, setActiveIndex] = useState(null);

  // Custom tooltip to make text clearly visible
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      return (
        <div className="bg-gray-800 text-white p-3 rounded-lg shadow-lg border border-gray-700">
          <p className="font-bold text-sm">{name}</p>
          <p className="text-yellow-400 font-semibold text-sm">{value} request{value > 1 ? 's' : ''}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-900 p-6 sm:p-8 rounded-3xl shadow-2xl max-w-4xl mx-auto w-full">
      <h2 className="text-xl sm:text-2xl font-extrabold text-[#ffd200] mb-6 text-center drop-shadow-lg">
        📊 Leave Request Overview
      </h2>

      <div className="w-full h-72 sm:h-80 md:h-96 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius="45%"
              outerRadius="80%"
              paddingAngle={4}
              cornerRadius={10}
              isAnimationActive={true}
              animationDuration={1200}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={activeIndex === index ? HOVER_COLORS[entry.name] : COLORS[entry.name]}
                  stroke="#111827"
                  strokeWidth={2}
                  cursor="pointer"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ fontSize: "0.85rem", marginTop: "10px" }}
              iconType="circle"
              formatter={(value) => {
                const icons = {
                  Approved: "✅",
                  Rejected: "❌",
                  Pending: "⏳",
                  Deleted: "🗑️",
                };
                return `${icons[value] || "ℹ️"} ${value}`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center total requests */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-white font-extrabold text-lg sm:text-xl md:text-2xl">
            {leaves.length}
          </p>
          <p className="text-gray-300 text-sm sm:text-base">Total Requests</p>
        </div>
      </div>
    </div>
  );
}
