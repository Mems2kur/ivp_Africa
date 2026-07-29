"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface DataPoint {
  month: string;
  registrations: number;
}

const data: DataPoint[] = [
  { month: "Jan", registrations: 120 },
  { month: "Feb", registrations: 210 },
  { month: "Mar", registrations: 180 },
  { month: "Apr", registrations: 340 },
  { month: "May", registrations: 310 },
  { month: "Jun", registrations: 420 },
  { month: "Jul", registrations: 360 },
  { month: "Aug", registrations: 450 },
  { month: "Sep", registrations: 400 },
  { month: "Oct", registrations: 470 },
  { month: "Nov", registrations: 440 },
];

export function MonthlyPerformance() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900 sm:text-base">
          Monthly Activity Performance Trend
        </h2>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="h-2 w-2 rounded-full bg-[#8A38F5]" />
          Platform Registrations
        </div>
      </div>

      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#F0F0F0" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#9CA3AF" }}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #EDE7F8",
                fontSize: 13,
              }}
            />
            <Line
              type="monotone"
              dataKey="registrations"
              stroke="#8A38F5"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#8A38F5" }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}