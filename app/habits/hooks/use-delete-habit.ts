import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast                           from "react-hot-toast";

import { deleteHabit } from "../service";

import { refetchHabits } from "./use-get-habits";


export const useDeleteHabit = (onSuccess: () => void) => {
  const queryClient = useQueryClient()
    
  return useMutation({
    mutationFn: deleteHabit,
    onSuccess: () => {
      onSuccess()
      refetchHabits(queryClient)
      toast.success('Deleted successfully')
    },
    onError: () => toast.error('Ops! Something went wrong')
  })
}