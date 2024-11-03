import { useMutation } from "@tanstack/react-query";

import { createRecord } from "../service";

export const useCreateRecord = (onSuccess?: () => void) => useMutation({
  mutationFn: createRecord,
  onSuccess: () => onSuccess?.()
})