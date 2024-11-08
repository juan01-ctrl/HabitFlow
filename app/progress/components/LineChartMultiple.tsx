"use client"

import { Card, CardHeader, Spinner } from "@nextui-org/react"
import { useIntl }                   from 'react-intl'
import {
  CartesianGrid, Customized, Legend, Line,
  LineChart, Text, XAxis, YAxis
} from "recharts"

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

const chartConfig: ChartConfig = {
 
} satisfies ChartConfig

export function LineChartMultiple() {
  const { formatNumber } = useIntl()
  const { data = [], isFetching: isLoading } = useGetStatistics()


  const tableData = data?.map((stat) => {
    
    const habits = Object.fromEntries(
      stat?.habits
        ?.map((habit) => [habit.name, habit.completion])
    );

    const result = {
      ...habits,
      week: `${dayjs.utc(stat.week).format("DD-MMM")} - ${dayjs(stat.week)
        .add(7, "day")
        .format("DD-MMM")}`,
    };
  
    return result;
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const keys = [...(new Set(tableData?.flatMap(({ week, ...rest }) => ( Object.keys(rest) ))))]

  return (
    <Card className="min-h-[50vh] p-3">
      <CardHeader>
        <CardTitle className="mb-4">Your progress  (by week)</CardTitle>
      </CardHeader>
      <CardContent className="p-0 pb-3 pe-4">
        {
          isLoading ? <div  className="w-100 flex items-center justify-center"> <Spinner /></div>
            : <ChartContainer config={chartConfig}>
              <LineChart
                accessibilityLayer
                style={{ fontWeight: 'bold' }}
                data={tableData}
                margin={{
                  top: 12,
                  left: 0,
                  right: 20,
                }}
              >
                <Customized
                  component={() => {
                    return !data?.length ? (
                      <Text
                        style={{ transform: `translate(50%, 50%)` }}
                        x={0}
                        y={-50}
                        textAnchor="middle"
                        verticalAnchor="middle"
                      >
                      You don&apos;t have any statistics yet. Every Monday the results from the previous week are added.
                      </Text>
                    ) : null;
                  }}
                />
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="week"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickFormatter={(value) => formatNumber(Number(value), { style: 'percent' })}
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
                <Legend iconSize={14} wrapperStyle={{ paddingTop: "10px" }} />
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
            </ChartContainer>}
      </CardContent>
    </Card>
  )
}
