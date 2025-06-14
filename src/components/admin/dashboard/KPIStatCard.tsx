
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KPIStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
  iconClassName?: string;
  valueClassName?: string;
}

const KPIStatCard: React.FC<KPIStatCardProps> = ({
  title,
  value,
  icon: Icon,
  description,
  iconClassName = "",
  valueClassName = "",
}) => (
  <Card className="mb-8">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${valueClassName}`}>{value}</div>
      <div className="text-sm text-gray-500">
        <Icon className={`inline-block w-4 h-4 mr-1 ${iconClassName}`} />
        {description}
      </div>
    </CardContent>
  </Card>
);

export default KPIStatCard;
