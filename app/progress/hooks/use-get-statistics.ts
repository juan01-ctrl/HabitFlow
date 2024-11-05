import { useQuery } from "@tanstack/react-query";

import { getStatistics } from "../service";


export const useGetStatistics = () => useQuery({
  queryFn: getStatistics,
  queryKey: ['statistics'],
  staleTime: 10 * 60 * 1000
})