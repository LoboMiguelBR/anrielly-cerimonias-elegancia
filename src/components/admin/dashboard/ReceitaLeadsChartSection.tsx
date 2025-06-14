
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ReceitaLeadsChartSectionProps {
  data: Array<{ name: string; receita: number; leads: number }>;
}

const ReceitaLeadsChartSection: React.FC<ReceitaLeadsChartSectionProps> = ({ data }) => (
  <Card className="mb-8">
    <CardHeader>
      <CardTitle>Receita vs Leads (Mensal)</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="receita" stroke="#8884d8" fill="#8884d8" name="Receita" />
          <Area type="monotone" dataKey="leads" stroke="#82ca9d" fill="#82ca9d" name="Leads" />
        </AreaChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default ReceitaLeadsChartSection;
