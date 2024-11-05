"use client"

import { Card, CardFooter, CardHeader }          from "@nextui-org/react"
import dayjs                                     from "dayjs"
import { TrendingUp }                            from "lucide-react"
import { useIntl }                               from 'react-intl'
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import { CardContent, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

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
  // completion: {
  //   label: "Completion",
  //   color: "#000000",
  // },
} satisfies ChartConfig

export function LineChartMultiple() {
  const { formatNumber } = useIntl()
  const { data = [] } = useGetStatistics()

  const tableData = data?.map((stat) => ({
    ...stat,
    week: `${dayjs(stat.week).format('DD-MMM')} - ${dayjs(stat.week).add(7, 'day').format('DD-MMM')}`
  }))

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const keys = [...(new Set(data?.flatMap(({ week, ...rest }) => ( Object.keys(rest) ))))]

  console.log(keys)




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
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip 
              cursor={false} 
              content={<ChartTooltipContent 
                formatter={(value, label) => `${label}: ${formatNumber(Number(value), { style: 'percent' })} `} />} 
            />
            {
              keys?.map((key) =>  <Line
                key={key}
                dataKey={key}
                type="monotone"
                stroke="#000000"
                strokeWidth={2}
                dot={true}
              />)
            }
  
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
