"use client"

import { Card, CardHeader }                      from "@nextui-org/react"
import { useIntl }                               from 'react-intl'
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import { CardContent, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import dayjs from "@/utils/dayjsConfig"

import { useGetStatistics } from "../hooks/use-get-statistics"

export const description = "A multiple line chart"

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ]

const chartConfig: ChartConfig = {
  
  // test: {
  //   label: "Desktop",
  //   color: "#000000",
  // },
  'test 1': {
    label: "Completion",
    color: "#010101",
  },
} satisfies ChartConfig

export function LineChartMultiple() {
  const { formatNumber } = useIntl()
  const { data = [] } = useGetStatistics()


  const tableData = data?.map((stat) => {
    const sortedHabits = Object.fromEntries(
      stat?.habits
        ?.map((habit) => [habit.name, habit.completion])
        .sort(([, a], [, b]) => b - a) // Sort descending by completion
    );
  
    const result = {
      ...sortedHabits,
      week: `${dayjs.utc(stat.week).format("DD-MMM")} - ${dayjs(stat.week)
        .add(7, "day")
        .format("DD-MMM")}`,
    };
  
    return result;
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const keys = [...(new Set(tableData?.flatMap(({ week, ...rest }) => ( Object.keys(rest) ))))]

  console.log(keys)




  const chartColors = [
    '#1f77b4', 
    '#ff7f0e', 
    '#2ca02c', 
    '#d62728', 
    '#9467bd', 
    '#8c564b', 
    '#e377c2', 
    '#7f7f7f', 
    '#bcbd22', 
    '#17becf'  
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="mb-4">Your progress  (by week)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            style={{ fontWeight: 'bold' }}
            data={tableData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip 
              className="bg-white"
              cursor={false} 
              content={<ChartTooltipContent 
                formatter={(value, label, i) => <div className="flex gap-1 items-center">
                  <div
                    className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: i.color }}
                  />
                  {label}: {formatNumber(Number(value), { style: 'percent' })} 
                </div>} />} 
            />
            {
              keys?.map((key, idx) =>  <Line
                key={key}
                dataKey={key}
                type="monotone"
                stroke={chartColors[idx]}
                strokeWidth={2}
                dot={true}
              />)
            }
  
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
