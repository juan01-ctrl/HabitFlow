import { useQuery } from "@tanstack/react-query";

import { getRecords } from "../service";

export const useGetNetworks = ({ params }) => useQuery({
  queryFn: () => getRecords({ params }),
  queryKey: ['networks'],
  staleTime: 10 * 60 * 1000
})