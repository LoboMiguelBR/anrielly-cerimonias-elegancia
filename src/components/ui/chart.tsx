import React from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  RadarChart,  // ADDED
  Radar,       // ADDED
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import LineChartCustom from "./chart/LineChartCustom";
import AreaChartCustom from "./chart/AreaChartCustom";
import BarChartCustom from "./chart/BarChartCustom";
import PieChartCustom from "./chart/PieChartCustom";
import RadarChartCustom from "./chart/RadarChartCustom";

interface ChartProps {
  data: any[]
  type:
    | "line"
    | "area"
    | "bar"
    | "pie"
    | "scatter"
    | "radar"
    | "composed"
  xAxisKey: string
  yAxisKey: string
  dataKeys?: string[]
  colors?: string[]
  margin?: { top: number; right: number; left: number; bottom: number }
  grid?: boolean
  legend?: boolean
  tooltip?: boolean
  aspect?: number
  children?: React.ReactNode
}

const Chart = ({
  data,
  type = "line",
  xAxisKey,
  yAxisKey,
  dataKeys,
  colors = ["#8884d8", "#82ca9d", "#ffc658", "#a45de2"],
  margin = { top: 5, right: 30, left: 20, bottom: 5 },
  grid = false,
  legend = false,
  tooltip = true,
  aspect = 4 / 3,
  children,
}: ChartProps) => {
  if (!data) return <div>No data for chart</div>;

  // Centralize props para todos os subcomponentes
  const commonProps = {
    data,
    xAxisKey,
    yAxisKey,
    dataKeys,
    colors,
    margin,
    grid,
    legend,
    tooltip,
    aspect,
  };

  switch (type) {
    case "line":
      return (
        <LineChartCustom {...commonProps} />
      );
    case "area":
      return (
        <AreaChartCustom {...commonProps} />
      );
    case "bar":
      return (
        <BarChartCustom {...commonProps} />
      );
    case "pie":
      return (
        <PieChartCustom
          data={data}
          xAxisKey={xAxisKey}
          yAxisKey={yAxisKey}
          dataKeys={dataKeys}
          colors={colors}
          legend={legend}
          tooltip={tooltip}
          aspect={aspect}
        />
      );
    case "radar":
      return (
        <RadarChartCustom
          data={data}
          xAxisKey={xAxisKey}
          dataKeys={dataKeys || []}
          colors={colors}
          legend={legend}
          tooltip={tooltip}
          aspect={aspect}
        />
      );
    default:
      return <div>Chart type not supported</div>;
  }
};

export default Chart;
