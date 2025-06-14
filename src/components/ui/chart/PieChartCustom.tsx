
import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface PieChartCustomProps {
  data: any[];
  xAxisKey: string;
  yAxisKey: string;
  dataKeys?: string[];
  colors: string[];
  legend: boolean;
  tooltip: boolean;
  aspect: number;
}

const PieChartCustom: React.FC<PieChartCustomProps> = ({
  data,
  xAxisKey,
  yAxisKey,
  dataKeys,
  colors,
  legend,
  tooltip,
  aspect
}) => {
  if (dataKeys && dataKeys.length > 1) {
    // Multi pies
    return (
      <ResponsiveContainer width="100%" aspect={aspect}>
        <PieChart>
          {dataKeys.map((key, idx) => (
            <Pie
              key={key}
              data={data}
              dataKey={key}
              nameKey={xAxisKey}
              cx={200 * (idx + 1)}
              cy={200}
              outerRadius={80}
              fill={colors[idx % colors.length]}
              label
            >
              {data.map((_entry, subIdx) => (
                <Cell key={`cell-${subIdx}`} fill={colors[subIdx % colors.length]} />
              ))}
            </Pie>
          ))}
          {tooltip && <Tooltip /> }
          {legend && <Legend /> }
        </PieChart>
      </ResponsiveContainer>
    );
  }
  // Single pie
  return (
    <ResponsiveContainer width="100%" aspect={aspect}>
      <PieChart>
        <Pie
          data={data}
          dataKey={yAxisKey}
          nameKey={xAxisKey}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill={colors[0]}
          label
        >
          {data.map((_entry, idx) => (
            <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
          ))}
        </Pie>
        {tooltip && <Tooltip /> }
        {legend && <Legend /> }
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartCustom;
