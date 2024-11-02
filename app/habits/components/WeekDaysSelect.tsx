import { Select, SelectItem } from "@nextui-org/react";

import { WEEK_DAYS } from "@/app/models/Habit";

interface Props {
  onChange: (data: string) => void
}

export function WeekDaysSelect ({ onChange, defaultValue }: Props) {
  console.log()
  return (
    <Select
      defaultSelectedKeys={defaultValue}
      onChange={(e) => onChange(e.target.value.split(','))}
      label="Specific Days"
      placeholder="Select the days of the week (optional)"
      selectionMode="multiple"
    >
      {
        WEEK_DAYS.map((day) => (
          <SelectItem key={day}>
            {day}
          </SelectItem>
        ))
      }
    </Select>
  )
}