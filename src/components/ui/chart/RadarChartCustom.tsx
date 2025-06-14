
import React from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface RadarChartCustomProps {
  data: any[];
  xAxisKey: string;
  dataKeys: string[];
  colors: string[];
  legend: boolean;
  tooltip: boolean;
  aspect: number;
}

const RadarChartCustom: React.FC<RadarChartCustomProps> = ({
  data,
  xAxisKey,
  dataKeys,
  colors,
  legend,
  tooltip,
  aspect
}) => {
  if (!dataKeys || dataKeys.length < 2) {
    return <div>At least two data keys are required for radar chart</div>
  }
  return (
    <ResponsiveContainer width="100%" aspect={aspect}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey={xAxisKey} />
        <PolarRadiusAxis angle={30} domain={[0, 150]} />
        {dataKeys.map((key, idx) => (
          <Radar
            key={key}
            name={key}
            dataKey={key}
            stroke={colors[idx % colors.length]}
            fill={colors[idx % colors.length]}
            fillOpacity={0.6}
          />
        ))}
        {tooltip && <Tooltip /> }
        {legend && <Legend /> }
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default RadarChartCustom;
