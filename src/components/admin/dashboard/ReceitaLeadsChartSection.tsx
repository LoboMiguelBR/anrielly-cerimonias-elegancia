
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ChartData {
  name: string;
  receita: number;
  leads: number;
}

interface ReceitaLeadsChartSectionProps {
  data: ChartData[];
}

const ReceitaLeadsChartSection = ({ data }: ReceitaLeadsChartSectionProps) => {
  const defaultData = [
    { name: 'Jan', receita: 4000, leads: 8 },
    { name: 'Fev', receita: 3000, leads: 12 },
    { name: 'Mar', receita: 5000, leads: 15 },
    { name: 'Abr', receita: 4500, leads: 10 },
    { name: 'Mai', receita: 6000, leads: 18 },
    { name: 'Jun', receita: 5500, leads: 14 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Receita vs Leads</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="receita" fill="#8884d8" />
            <Bar dataKey="leads" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ReceitaLeadsChartSection;
