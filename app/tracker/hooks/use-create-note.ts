import { useMutation } from "@tanstack/react-query";

import { createNote } from "../service";

export const useCreateNote = (onSuccess?: () => void) => useMutation({
  mutationFn: createNote,
  onSuccess: () => onSuccess?.()
})