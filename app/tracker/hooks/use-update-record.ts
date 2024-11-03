import { useMutation } from "@tanstack/react-query";

import { updateRecord } from "../service";

export const useUpdateRecord = (onSuccess?: () => void) => useMutation({
  mutationFn: updateRecord,
  onSuccess: () => onSuccess?.()
})