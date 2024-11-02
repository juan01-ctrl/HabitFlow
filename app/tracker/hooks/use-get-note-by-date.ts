import { useQuery } from "@tanstack/react-query";

import { getNoteByDate } from "../service";

const QUERY_KEY = ['note']

export const useGetNoteByDate = ({ params }) => useQuery({
  enabled: !!params?.date,
  queryFn: () => getNoteByDate({ params }),
  queryKey: [...QUERY_KEY, params],
  staleTime: 60 * 60 * 1000 
})