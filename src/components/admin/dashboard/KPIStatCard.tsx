
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KPIStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
  iconClassName?: string;
  valueClassName?: string;
}

const KPIStatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  iconClassName = "text-gray-600",
  valueClassName = "text-gray-900"
}: KPIStatCardProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-gray-50">
            <Icon className={`w-6 h-6 ${iconClassName}`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className={`text-2xl font-bold ${valueClassName}`}>{value}</p>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KPIStatCard;
