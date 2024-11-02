import { Select, SelectItem } from "@nextui-org/react";


interface Props {
  onChange: (data: string) => void
}

export function DaysPerWeekSelect ({ onChange, ...props }: Props) {
  const options = Array.from({ length: 7 }, (_, i) => i + 1);

  return (
    <Select
      label="Days Per Week"
      placeholder="Select number of days"
      {...props}
      onChange={(e) => onChange(e.target.value)}
    >
      {
        options.map((qty) => (
          <SelectItem key={qty}>
            {qty.toString()}
          </SelectItem>
        ))
      }
    </Select>
  )
}