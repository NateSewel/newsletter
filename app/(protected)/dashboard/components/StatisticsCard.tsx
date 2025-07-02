/* eslint-disable @typescript-eslint/no-explicit-any */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

// Stats Card Component
const StatsCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color = "blue",
}: {
  title: string;
  value: string | number;
  description: string;
  icon: any;
  trend?: { value: number; isPositive: boolean };
  color?: string;
}) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div
          className={`p-2 rounded-md ${
            colorClasses[color as keyof typeof colorClasses]
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div
            className={`flex items-center text-xs mt-1 ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            {trend.isPositive ? "+" : ""}
            {trend.value}% from last period
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
