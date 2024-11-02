import { QueryClient, useQuery } from "@tanstack/react-query";

import { getHabits } from "../service";

const queryKey = ['habits']

export const useGetHabits = () => useQuery({
  queryFn: getHabits,
  queryKey,
  staleTime: 60 * 60 * 1000,
  placeholderData: [],
  retry: 3
})

export const refetchHabits = (client: QueryClient) => {
  client.refetchQueries({ queryKey })
}