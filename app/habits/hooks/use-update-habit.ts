import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast                           from "react-hot-toast";

import { updateHabit } from "../service";

import { refetchHabits } from "./use-get-habits";


export const useUpdateHabit = (onSuccess?: () => void) => {
  const queryClient = useQueryClient()
    
  return useMutation({
    mutationFn: updateHabit,
    onSuccess: () => {
      onSuccess?.()
      refetchHabits(queryClient)
      toast.success('Updated successfully')
    },
    onError: () => toast.error('Ops! Something went wrong')
  })
}