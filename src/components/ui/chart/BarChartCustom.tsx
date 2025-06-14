
import React from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface BarChartCustomProps {
  data: any[];
  xAxisKey: string;
  yAxisKey?: string;
  dataKeys?: string[];
  colors: string[];
  margin: { top: number; right: number; left: number; bottom: number };
  grid: boolean;
  legend: boolean;
  tooltip: boolean;
  aspect: number;
}

const BarChartCustom: React.FC<BarChartCustomProps> = ({
  data,
  xAxisKey,
  yAxisKey,
  dataKeys,
  colors,
  margin,
  grid,
  legend,
  tooltip,
  aspect
}) => (
  <ResponsiveContainer width="100%" aspect={aspect}>
    <BarChart data={data} margin={margin}>
      {grid && <CartesianGrid strokeDasharray="3 3" />}
      <XAxis dataKey={xAxisKey} />
      <YAxis dataKey={yAxisKey} />
      {tooltip && <Tooltip />}
      {legend && <Legend />}
      {dataKeys && dataKeys.length > 1
        ? dataKeys.map((key, idx) =>
            <Bar key={key} dataKey={key} fill={colors[idx % colors.length]} />
          )
        : (yAxisKey && <Bar dataKey={yAxisKey} fill={colors[0]} />)
      }
    </BarChart>
  </ResponsiveContainer>
);

export default BarChartCustom;
