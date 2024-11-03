import {
  Modal, ModalContent, ModalHeader,
  ModalBody, ModalFooter, Button
} from "@nextui-org/react";

import { useDeleteHabit } from "../hooks/use-delete-habit";

interface Props {
    onOpenChange: () => void
    isOpen: boolean
    _id: string
}

export function DeleteHabitModal ({ onOpenChange, isOpen, _id }: Props) {
  const { mutate } = useDeleteHabit(onOpenChange)
    
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Delete Habit</ModalHeader>
        <ModalBody className="mb-2">
          <p>
            Are you sure you want to delete this habit? This action cannot be undone.
          </p>
          <p>
            Deleting a habit will remove it from your habit tracker permanently.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button color='danger' variant="bordered">
                Cancel
          </Button>
          <Button onClick={() => mutate({ _id })} color='primary'>
                Accept
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}