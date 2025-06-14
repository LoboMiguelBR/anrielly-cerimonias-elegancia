
import React from "react";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface AreaChartCustomProps {
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

const AreaChartCustom: React.FC<AreaChartCustomProps> = ({
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
    <AreaChart data={data} margin={margin}>
      {grid && <CartesianGrid strokeDasharray="3 3" />}
      <XAxis dataKey={xAxisKey} />
      <YAxis dataKey={yAxisKey} />
      {tooltip && <Tooltip />}
      {legend && <Legend />}
      {dataKeys && dataKeys.length > 1
        ? dataKeys.map((key, idx) =>
            <Area key={key} type="monotone" dataKey={key} stroke={colors[idx % colors.length]} fill={colors[idx % colors.length]} />
          )
        : (yAxisKey && <Area type="monotone" dataKey={yAxisKey} stroke={colors[0]} fill={colors[0]} />)
      }
    </AreaChart>
  </ResponsiveContainer>
);

export default AreaChartCustom;
