'use client'

import { LineChartMultiple } from "./components/LineChartMultiple"
import { useGetNetworks }    from "./hooks/use-get-networks"

function Progress  () {
  const { data } = useGetNetworks({ params: {} })

  console.log({ data })
  return (
    <div className="container py-6">
      <h1 className="text-center">Coming Soon! 🙈</h1>
      <LineChartMultiple />
    </div>
  )
}
    
export default Progress
    