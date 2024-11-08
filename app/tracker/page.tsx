'use client';

import { ArrowLeftIcon, ArrowRightIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import { getLocalTimeZone, today }                              from '@internationalized/date';
import { 
  Table, TableColumn, TableHeader, TableBody, TableRow, TableCell,
  Spinner,
  Button,
  Checkbox,
  Tooltip
} from '@nextui-org/react';
import dynamic                  from 'next/dynamic';
import Link                     from 'next/link';
import {  useEffect, useState } from 'react';

const DatePicker = dynamic(() => import('@nextui-org/react').then((mod) => mod.DatePicker), { ssr: false });


import { HABITS } from '@/enums/paths';
import dayjs      from '@/utils/dayjsConfig';

import { useGetHabits }           from '../habits/hooks/use-get-habits';
import { IGetHabitsResponseItem } from '../habits/service';
import { useDebounced }           from '../hooks/useDebounce';

import TextBox              from './components/TextBox';
import { useCreateNote }    from './hooks/use-create-note';
import { useCreateRecord }  from './hooks/use-create-record';
import { useGetNoteByDate } from './hooks/use-get-note-by-date';
import { useUpdateNote }    from './hooks/use-update-note';
import { useUpdateRecord }  from './hooks/use-update-record';

const days = ['Mon','Tue','Wed','Thu','Fri', 'Sat', 'Sun'];

export default function TrackingPage() {
  const [startOfWeek, setStartOfWeek] = useState(dayjs().startOf('isoWeek'));
  const [content, setContent] = useState('');
  const [noteDate, setNoteDate] = useState(dayjs().startOf('day').toISOString());
  

  const debouncedValue = useDebounced(content, 500) as string

  const { data: note, refetch: refetchNote, isLoading: isLoadingNote } = useGetNoteByDate({ params: { date: noteDate } })
  const { data: habits , isLoading, refetch: refetchHabits } = useGetHabits();
  const { mutate: updateRecord } = useUpdateRecord(refetchHabits)
  const { mutate: createRecord } = useCreateRecord(refetchHabits)
  
  const { mutate: updateNote, isPending: isLoadingUpdateNote } = useUpdateNote()
  const { mutate: createNote } = useCreateNote(refetchNote)

  useEffect(() => {
    const noteContent = note?.content || ''

    setContent(noteContent)
  }, [note])

  useEffect(() => {
    if(debouncedValue) {
      if (note && note?.content !== debouncedValue) {
        updateNote({ body: { _id: note._id, content: debouncedValue }})
      } 
      if(!note) {
        createNote({ body: { date: noteDate, content: debouncedValue }})
      }
    }
  }, [debouncedValue])
  

  const handleCheckboxChange = (
    completed: boolean, habit: IGetHabitsResponseItem, date: Date
  ) => {

    const record = habit.records.find((record) => dayjs(record.date).isSame(date));
    console.log({ record, records: habit.records, date })
    const habitId = habit._id

    if (record) {
      const body = { habitId, completed, _id: record._id  }
  
      updateRecord({ body });
    } else {
      createRecord({ body: { date: dayjs.utc(date), completed, habitId }})
    }

  };

  const currentDate = dayjs().startOf('day');
  const weekDates = [...Array(7)].map((_, index) => startOfWeek.add(index, 'day').toISOString());
  const isLastWeek = currentDate.startOf('isoWeek').isSame(startOfWeek);

  const calculateCompletionPercentage = (habit: IGetHabitsResponseItem) => {
    const target = habit?.daysPerWeek || 0; 
    const completedDays = (habit?.records || [])
      .filter((record) => record.completed && weekDates.includes(dayjs(record.date).startOf('day').toISOString())).length; 
    return  ((completedDays / target) * 100).toFixed(2); 
  };

  const handlePrevWeek = () => {
    setStartOfWeek(startOfWeek.subtract(7, 'day'));
  };
  const handleNextWeek = () => {
    setStartOfWeek(startOfWeek.add(7, 'day'));
  };

  return (
    <div className='p-6 container'>
      <div className='lg:flex gap-6'>
        <div className='lg:w-2/3 mt-6 mb-8'>
          <h1 className='mb-6 -ms-2'>📊Habit Tracking</h1>
          <div className="flex items-center justify-between mb-4">
            <Button onClick={handlePrevWeek} className='flex items-center gap-2 cursor-pointer bg-primary-400 text-white'>
              <ArrowLeftIcon width={18} />
              <span>Previous</span>
            </Button>
            <span className='text-gray-600'>{startOfWeek.format('MMM D')} - {startOfWeek.add(6, 'day').format('MMM D')}</span>
            <Button isDisabled={isLastWeek} onClick={handleNextWeek} className='flex items-center gap-2 cursor-pointer bg-primary-400 text-white'>
              <span>Next</span>
              <ArrowRightIcon width={18} />
            </Button>
          </div>
          <Table className='mt-4'>
            <TableHeader>
              <TableColumn>Habit</TableColumn>
              {
                typeof window !== 'undefined' ? days?.map((day, idx) => {
                  const weekDate = weekDates[idx];
                  const isCurrent = weekDate && dayjs(weekDate).isSame(currentDate.toISOString())

                  return (
                    <TableColumn
                      key={`${day}-${idx}`}
                      className={isCurrent ? 'bg-primary text-white' : ''}
                    >
                      {day}
                    </TableColumn>
                  );
                }) : null
              }
              <TableColumn>Completion (%)</TableColumn>
            </TableHeader>
            <TableBody 
              loadingContent={<Spinner label='Loading...' />}
              isLoading={isLoading}
              emptyContent={<span>
                No habits to display. 
                <Link
                  href={HABITS.ROOT}
                  className='text-primary cursor-pointer'
                > Create one</Link>
              </span>}
            >
              {(habits || [])?.map((habit) => {
                const completionPercentage = Number(calculateCompletionPercentage(habit));
                let color = 'success';

                if (completionPercentage < 75) {
                  color = 'danger';
                } else if (completionPercentage < 100) {
                  color = 'warning';
                }
                return (
                  <TableRow key={habit._id}>
                    <TableCell className='flex gap-1 items-center'>
                      <span> {habit.name}</span>
                      <Tooltip content={
                        <>
                          {
                            habit?.description &&
                            <span>Description: {habit.description}</span>
                          }
                          <span>Days per week: {habit.daysPerWeek}</span>
                        </>
                      }>
                        <InformationCircleIcon width={16} />
                      </Tooltip>
                    </TableCell>
                    {
                      weekDates.map((date) => {
                        const record = habit.records.find((record) => dayjs(record.date).startOf('day').isSame(date));

                        return (
                          <TableCell 
                            key={date}
                            className={`${habit?.specificDays.includes(dayjs.utc(date).format('dddd')) ? 'bg-primary-100': ''}`}
                          >
                            <Checkbox 
                              isDisabled={!isLastWeek}
                              isSelected={record ? record?.completed : false}
                              onValueChange={(selected) => handleCheckboxChange(selected, habit, date)}
                            />
                          </TableCell>
                        );
                      })
                    }
                    <TableCell className={`bg-${color} text-white`}>
                      {completionPercentage}%
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className='h-100 bg-gray-200' style={{ width: '1px'}}/>
        <div className='lg:w-1/3 mt-8 w-full'>
          <h3 className='pt-0 -ms-2 mb-4'>📝 Day notes</h3>
          <div>
            <DatePicker
              className='lg:max-w-full max-w-[284px]'
              label="Date"
              defaultValue={today(getLocalTimeZone())}
              onChange={(d) => setNoteDate(dayjs.utc(d).toISOString())}
            />
          </div>
          {
            isLoadingNote
              ? <div className='py-4 w-100 flex justify-center items-center'><Spinner /></div> 
              : <TextBox note={note} isLoading={isLoadingUpdateNote} content={content} setContent={setContent} />
          }
        </div>
      </div>
    </div>
  );
}
