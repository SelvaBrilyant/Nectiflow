import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatisticCardProps = {
  icon: React.ReactNode;
  count: string;
  label: string;
  bgColor?: string;
};

export default function StatisticCard({ icon, count, label, bgColor = "bg-blue-50" }: StatisticCardProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-sm">
      <CardContent className="p-0">
        <div className="flex items-center p-6">
          <div className={cn("p-3 rounded-lg mr-4", bgColor)}>
            {icon}
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{count}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}