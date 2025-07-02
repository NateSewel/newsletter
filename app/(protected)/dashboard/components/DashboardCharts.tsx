/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
export function MethodCharts({ data }: { data: any }) {
  const methodData = data.apiCallsByMethod.map((item: any) => ({
    name: item.method,
    value: item.count,
  }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>HTTP Methods Distribution</CardTitle>
        <CardDescription>Request methods breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={methodData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {methodData.map((entry: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ProtectionCharts({ data }: { data: any }) {
  const protectionData = data.protectionStats.map((item: any) => ({
    name: item.protected ? "Protected" : "Public",
    value: item.count,
  }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Security</CardTitle>
        <CardDescription>Protection status distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={protectionData}
              cx="50%"
              cy="50%"
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
            >
              {protectionData.map((entry: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.name === "Protected" ? "#10b981" : "#6b7280"}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-2 mt-4">
          {protectionData.map((item: any) => (
            <div
              key={item.name}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    item.name === "Protected" ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                <span>{item.name}</span>
              </div>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
