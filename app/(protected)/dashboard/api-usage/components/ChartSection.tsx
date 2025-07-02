/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, BarChart3 } from "lucide-react";
const STATUS_COLORS = {
  200: "#10b981",
  201: "#3b82f6",
  400: "#f59e0b",
  401: "#ef4444",
  404: "#ef4444",
  429: "#dc2626",
  500: "#7c2d12",
};
export default function ChartSection({ data }: { data: any }) {
  // Prepare chart data
  const statusCodeData = data.statusCodeDistribution.map((item: any) => ({
    name: `${item.statusCode}`,
    value: item.count,
    fill:
      STATUS_COLORS[item.statusCode as keyof typeof STATUS_COLORS] || "#6b7280",
  }));

  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const found = data.hourlyDistribution.find((h: any) => h.hour === hour);
    return {
      hour,
      calls: found?.calls || 0,
      label: `${hour.toString().padStart(2, "0")}:00`,
    };
  });
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Hourly Distribution Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Hourly Request Distribution
          </CardTitle>
          <CardDescription>API requests by hour of day (UTC)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" fontSize={12} tickLine={false} />
              <YAxis fontSize={12} />
              <Tooltip
                formatter={(value) => [`${value} requests`, "Requests"]}
                labelFormatter={(label) => `Hour: ${label}`}
              />
              <Bar dataKey="calls" fill="#3b82f6" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Status Code Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Response Status Codes
          </CardTitle>
          <CardDescription>HTTP status code breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusCodeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusCodeData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} requests`, "Count"]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
