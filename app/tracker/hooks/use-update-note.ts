import { useMutation } from "@tanstack/react-query";

import { updateNote } from "../service";

export const useUpdateNote = (onSuccess?: () => void) => useMutation({
  mutationFn: updateNote,
  onSuccess: () => onSuccess?.()
})