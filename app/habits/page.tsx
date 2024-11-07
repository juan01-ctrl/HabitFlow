'use client'

import {
  Table, TableHeader, TableColumn,
  TableBody, TableRow, TableCell, getKeyValue,
  Tooltip,
  useDisclosure,
  Button,
  Spinner,
  Chip
} from "@nextui-org/react";
import dayjs from "dayjs";

import {DeleteIcon} from "@/app/components/DeleteIcon";
import {EditIcon}   from "@/app/components/EditIcon";

import { DeleteHabitModal }       from "./components/DeleteHabitModal";
import { HabitForm }              from "./components/HabitForm";
import { useGetHabits }           from "./hooks/use-get-habits";
import { IGetHabitsResponseItem } from "./service";


const columns = [
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "description",
    label: "DESCRIPTION",
  },
  {
    key: "categories",
    label: "CATEGORIES",
  },
  {
    key: "daysPerWeek",
    label: "DAYS PER WEEK",
  },
  {
    key: "specificDays",
    label: "SPECIFIC DAYS",
  },
  {
    key: "startDate",
    label: "START DATE",
  },
  {
    key: "actions",
    label: "ACTIONS"
  }
];

function Actions  ({ habit }: { habit: IGetHabitsResponseItem }) {
  console.log({ habit })
  const {
    isOpen: isOpenForm, onOpen: onOpenForm, onOpenChange: onOpenChangeForm
  } = useDisclosure()
  const { 
    isOpen: isOpenDelete, onOpen: onOpenDelete, onOpenChange: onOpenChangeDelete
  } = useDisclosure()

  return (
    <div className="flex items-center gap-2">
      {/* <Tooltip content="Details">
        <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
          <EyeIcon />
        </span>
      </Tooltip> */}
      <Tooltip content="Edit habit">
        <span onClick={onOpenForm} className="text-lg text-default-400 cursor-pointer active:opacity-50">
          <EditIcon />
        </span>
      </Tooltip>
      <Tooltip color="danger" content="Delete habit">
        <span onClick={onOpenDelete} className="text-lg text-danger cursor-pointer active:opacity-50">
          <DeleteIcon />
        </span>
      </Tooltip>
      <HabitForm
        defaultData={habit}
        isOpen={isOpenForm}
        onOpenChange={onOpenChangeForm}
      />
      <DeleteHabitModal
        _id={habit._id}
        isOpen={isOpenDelete}
        onOpenChange={onOpenChangeDelete}
      />
      {/* <HabitForm key={habit._id} defaultData={habit} isOpen={isOpen} onOpenChange={onOpenChange}/> */}
    </div>
  )
}


export default function Habits() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { data, isFetching } = useGetHabits()
      
  const getFormattedValue = (item: IGetHabitsResponseItem, columnKey: string | number) => {
    switch (columnKey) {
    case 'startDate':
      return dayjs(item.startDate).format('MMMM D, YYYY')
    case 'specificDays':
      const specificDays = item?.specificDays
      return `${specificDays.slice(0, 3).join(', ')}${specificDays.length > 3 ? '...' : ''} `
    case 'categories':
      return <div className="flex gap-2">
        {
          item?.categories?.map((category) => (
            <Chip key={category} color='primary'>{category}</Chip>
          ))
        }
      </div>
    case 'actions':
      return <Actions habit={item}/>
    default:
      return getKeyValue(item, columnKey)
    }
  }
  return (
    <div className="p-6 container">
      <div className="flex w-full items-center justify-between mb-2">
        <h1 className="-ms-2 mb-6">📝My Habits</h1>
        <Button color="primary" onClick={onOpen}>
          New
        </Button>
      </div>
      <Table aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key} align="center">{column.label}</TableColumn>}
        </TableHeader>
        <TableBody
          items={data || []}
          isLoading={isFetching}
          emptyContent={<span>
            No habits to display. 
            <span
              onClick={onOpen}
              className='text-primary cursor-pointer'
            > Create one</span>
          </span>
          }
          loadingContent={<Spinner label='Loading...' />}
        >
          {(item) => (
            <TableRow  key={item._id}>
              {
                (columnKey) => <TableCell>
                  {                 
                    getFormattedValue(item, columnKey) || '-'
                  }
                </TableCell>
              }
            </TableRow>
          )}
        </TableBody>
      </Table>
      <HabitForm isOpen={isOpen} onOpenChange={onOpenChange}/>
    </div>
  );
}