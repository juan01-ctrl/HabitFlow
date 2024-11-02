import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import {
  Modal, ModalContent, ModalHeader, ModalBody, Button,
  Input, DatePicker
} from "@nextui-org/react";
import { useForm } from "react-hook-form"; 

import { IHabit } from "@/app/models/Habit";
import dayjs      from '@/utils/dayjsConfig';

import { useCreateHabit } from "../hooks/use-create-habit";
import { useUpdateHabit } from "../hooks/use-update-habit";

import { DaysPerWeekSelect } from "./DaysPerWeekSelect";
import { WeekDaysSelect }    from "./WeekDaysSelect";


interface Props {
  onOpenChange: () => void;
  isOpen: boolean;
  defaultData?: Partial<IHabit>;
}

export function HabitForm({ isOpen, onOpenChange, defaultData }: Props) {
  const action = defaultData ? 'Edit' : 'Create';
  const { mutate: create } = useCreateHabit(onOpenChange);
  const { mutate: update } = useUpdateHabit(onOpenChange);

  const mutate = defaultData 
    ? (data: IHabit) => {
      const { _id, ...body } = data
      update({ body, _id })
    }
    : (data: IHabit) => create({ body: data })

  const { register, handleSubmit, setValue } = useForm<IHabit>({
    defaultValues: defaultData || {}
  });

  const onSubmit = (data: IHabit) => {
    console.log({categories: data?.categories})
    const categories = data?.categories?.trim().split(',')
    console.log(2, categories)
    mutate({ ...data, categories });
  }

  console.log({ defaultData})
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">{action} Habit</ModalHeader>
        <ModalBody className="mb-2">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input 
              label="Name" 
              placeholder="E.g., Read for 30 minutes daily" 
              {...register("name", { required: true })} 
            />
            <Input 
              label="Description" 
              placeholder="Briefly describe the habit (optional)" 
              {...register("description")} 
            />
            <Input 
              label="Categories (separated by comma)" 
              placeholder="E.g., Health, Productivity, Personal" 
              {...register("categories")}
            />
            <DatePicker
              label="Start Date"
              minValue={today(getLocalTimeZone())}
              defaultValue={parseDate(dayjs.utc(defaultData?.startDate).format("YYYY-MM-DD")) }
              onChange={(date) => setValue("startDate", dayjs(date).toDate())}
            />
            <DaysPerWeekSelect
              {...register("daysPerWeek")}
              onChange={(data: string) => setValue("daysPerWeek", data)}
            />
            <WeekDaysSelect
              defaultValue={defaultData?.specificDays}
              onChange={(data: string) => setValue("specificDays", data)}
            />
            <Button type="submit" color="primary">
              {action}
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
