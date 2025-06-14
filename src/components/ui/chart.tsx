
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
  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <LineChart
            data={data}
            margin={margin}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis dataKey={yAxisKey} />
            {tooltip && <Tooltip />}
            {legend && <Legend />}
            <Line type="monotone" dataKey={yAxisKey} stroke={colors[0]} activeDot={{ r: 8 }} />
          </LineChart>
        )
      case "area":
        return (
          <AreaChart
            data={data}
            margin={margin}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis dataKey={yAxisKey} />
            {tooltip && <Tooltip />}
            {legend && <Legend />}
            <Area type="monotone" dataKey={yAxisKey} stroke={colors[0]} fill={colors[0]} />
          </AreaChart>
        )
      case "bar":
        return (
          <BarChart
            data={data}
            margin={margin}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis dataKey={yAxisKey} />
            {tooltip && <Tooltip />}
            {legend && <Legend />}
            <Bar dataKey={yAxisKey} fill={colors[0]} />
          </BarChart>
        )
      case "pie":
        return (
          <PieChart width={400} height={400}>
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
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            {tooltip && <Tooltip /> }
            {legend && <Legend /> }
          </PieChart>
        )
      default:
        return <div>Chart type not supported</div>
    }
  }

  const renderMultipleLines = () => {
    if (!dataKeys) {
      return <div>Data keys must be provided for multiple lines</div>
    }

    return (
      <LineChart
        data={data}
        margin={margin}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        {tooltip && <Tooltip />}
        {legend && <Legend />}
        {dataKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index % colors.length]}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    )
  }

  const renderMultipleBars = () => {
    if (!dataKeys) {
      return <div>Data keys must be provided for multiple bars</div>
    }

    return (
      <BarChart
        data={data}
        margin={margin}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisKey} />
        <YAxis />
        {tooltip && <Tooltip /> }
        {legend && <Legend /> }
        {dataKeys.map((key, index) => (
          <Bar key={key} dataKey={key} fill={colors[index % colors.length]} />
        ))}
      </BarChart>
    )
  }

  const renderMultiplePies = () => {
    if (!dataKeys) {
      return <div>Data keys must be provided for multiple pies</div>
    }

    return (
      <PieChart width={800} height={400}>
        {dataKeys.map((key, index) => (
          <Pie
            key={key}
            data={data}
            dataKey={key}
            cx={200 * (index + 1)}
            cy={200}
            outerRadius={80}
            fill={colors[index % colors.length]}
            label
          >
            {data.map((entry, subIndex) => (
              <Cell key={`cell-${subIndex}`} fill={colors[subIndex % colors.length]} />
            ))}
          </Pie>
        ))}
        {tooltip && <Tooltip /> }
        {legend && <Legend /> }
      </PieChart>
    )
  }

  const renderRadarChart = () => {
    if (!dataKeys || dataKeys.length < 2) {
      return <div>At least two data keys are required for radar chart</div>
    }
    return (
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey={xAxisKey} />
        <PolarRadiusAxis angle={30} domain={[0, 150]} />
        {dataKeys.map((key, index) => (
          <Radar
            key={key}
            name={key}
            dataKey={key}
            stroke={colors[index % colors.length]}
            fill={colors[index % colors.length]}
            fillOpacity={0.6}
          />
        ))}
        {tooltip && <Tooltip /> }
        {legend && <Legend /> }
      </RadarChart>
    )
  }

  const renderCustomTooltip = (props: any) => {
    const { active, payload, label } = props
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg bg-white border shadow p-3">
          <p className="font-bold mb-1">{label}</p>
          {payload.map((pld: any, i: number) => (
            <div key={i} className="flex gap-2 items-center">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: pld.color }}
              />
              <span className="font-semibold">{pld.name || pld.dataKey || "Valor"}</span>
              :
              <span>
                {pld.value}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" aspect={aspect} height={400}>
      {dataKeys && dataKeys.length > 1
        ? type === "bar"
          ? renderMultipleBars()
          : type === "pie"
            ? renderMultiplePies()
            : type === "radar"
              ? renderRadarChart()
              : renderMultipleLines()
        : type === "radar"
          ? renderRadarChart()
          : renderChart()}
    </ResponsiveContainer>
  )
}

export default Chart

