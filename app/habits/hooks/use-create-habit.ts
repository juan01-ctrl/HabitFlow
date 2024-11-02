import {  useMutation, useQueryClient } from "@tanstack/react-query";
import toast                            from "react-hot-toast";

import { createHabit } from "../service";

import { refetchHabits } from "./use-get-habits";


export const useCreateHabit = (onSuccess: () => void) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createHabit,
    onSuccess: () => {
      onSuccess()
      refetchHabits(queryClient)
      toast.success('Created successfully')
    },
    onError: () => toast.error('Ops! Something went wrong')
  })}