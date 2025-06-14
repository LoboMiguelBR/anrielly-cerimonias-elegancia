
import React from "react";
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, ResponsiveContainer } from "recharts";

interface LineChartCustomProps {
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

const LineChartCustom: React.FC<LineChartCustomProps> = ({
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
    <LineChart data={data} margin={margin}>
      {grid && <CartesianGrid strokeDasharray="3 3" />}
      <XAxis dataKey={xAxisKey} />
      <YAxis dataKey={yAxisKey} />
      {tooltip && <Tooltip />}
      {legend && <Legend />}
      {dataKeys && dataKeys.length > 1
        ? dataKeys.map((key, idx) =>
            <Line key={key} type="monotone" dataKey={key} stroke={colors[idx % colors.length]} activeDot={{ r: 8 }} />
          )
        : (yAxisKey && <Line type="monotone" dataKey={yAxisKey} stroke={colors[0]} activeDot={{ r: 8 }} />)
      }
    </LineChart>
  </ResponsiveContainer>
);

export default LineChartCustom;
