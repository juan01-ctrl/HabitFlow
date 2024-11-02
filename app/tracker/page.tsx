'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { getLocalTimeZone, today }       from '@internationalized/date';
import { 
  Table, TableColumn, TableHeader, TableBody, TableRow, TableCell,
  Spinner,
  Button
} from '@nextui-org/react';
import dynamic                              from 'next/dynamic';
import { ChangeEvent, useEffect, useState } from 'react';

const DatePicker = dynamic(() => import('@nextui-org/react').then((mod) => mod.DatePicker), { ssr: false });


import dayjs from '@/utils/dayjsConfig';

import { useGetHabits }   from '../habits/hooks/use-get-habits';
import { useUpdateHabit } from '../habits/hooks/use-update-habit';
import { useDebounced }   from '../hooks/useDebounce';
import { IHabit }         from '../models/Habit';

import TextBox              from './components/TextBox';
import { useCreateNote }    from './hooks/use-create-note';
import { useGetNoteByDate } from './hooks/use-get-note-by-date';
import { useUpdateNote }    from './hooks/use-update-note';

const days = ['Sun','Mon','Tue','Wed','Thu','Fri', 'Sat'];

export default function TrackingPage() {
  const [startOfWeek, setStartOfWeek] = useState(dayjs.utc().startOf('week'));
  const [content, setContent] = useState('');
  const [noteDate, setNoteDate] = useState(dayjs.utc().startOf('day').toISOString());
  const [noteKey, setNoteKey] = useState(0);
  

  const debouncedValue = useDebounced(content, 500)

  const { data: note, refetch, isLoading: isLoadingNote } = useGetNoteByDate({ params: { date: noteDate } })
  const { data: habits = [], isFetching: isLoading } = useGetHabits();
  const { mutate: update } = useUpdateHabit();
  
  const { mutate: updateNote, isPending: isLoadingUpdateNote } = useUpdateNote(refetch)
  const { mutate: createNote } = useCreateNote(refetch)

  useEffect(() => {
    const noteContent = note?.content || ''

    setNoteKey((prev) => prev + 1);
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
    e: ChangeEvent<HTMLInputElement>, habit: IHabit, date: Date
  ) => {
    const completed = e.target.checked;

    const alreadyExist = habit.records.some((record) => dayjs(record.date).isSame(date));

    const updatedRecords = habit.records.map((record) =>
      dayjs(record.date).isSame(date) ? { ...record, completed } : record
    );

    if (!alreadyExist) {
      updatedRecords.push({ date: date, completed });
    }

    update({ _id: habit._id, body: { records: updatedRecords } });
  };

  const currentDate = dayjs.utc().startOf('day');
  const weekDates = [...Array(7)].map((_, index) => startOfWeek.add(index, 'day').toISOString());
  const isLastWeek = currentDate.startOf('week').isSame(startOfWeek);

  const calculateCompletionPercentage = (habit: IHabit) => {
    const target = habit.daysPerWeek; 
    const completedDays = habit.records
      .filter((record) => record.completed && weekDates.includes(dayjs(record.date).toISOString())).length; 
    return  ((completedDays / target) * 100).toFixed(2); 
  };

  const handlePrevWeek = () => {
    setStartOfWeek(startOfWeek.subtract(1, 'week'));
  };
  const handleNextWeek = () => {
    setStartOfWeek(startOfWeek.add(1, 'week'));
  };

  return (
    <div className='p-6'>
      <div className='lg:flex gap-6'>
        <div className='lg:w-2/3 mt-6 mb-8'>
          <h1 className='mb-6 -ms-2'>📊Habit Tracking</h1>
          <div className="flex items-center justify-between mb-4">
            <Button onClick={handlePrevWeek} className='flex items-center gap-2 cursor-pointer bg-primary-400 text-white'>
              <ArrowLeftIcon width={18} />
              <span>Previous</span>
            </Button>
            <span className='text-gray-600'>{startOfWeek.format('MMM D')} - {startOfWeek.endOf('week').format('MMM D')}</span>
            <Button isDisabled={isLastWeek} onClick={handleNextWeek} className='flex items-center gap-2 cursor-pointer bg-primary-400 text-white'>
              <span>Next</span>
              <ArrowRightIcon width={18} />
            </Button>
          </div>
          <Table className='mt-4'>
            <TableHeader>
              <TableColumn>Habit</TableColumn>
              {days?.map((day, idx) => (
                <TableColumn 
                  key={day}
                  className={dayjs(weekDates[idx]).isSame(currentDate) ? 'bg-primary text-white' : ''}
                >
                  {day}
                </TableColumn>
              ))}
              <TableColumn>Completion (%)</TableColumn>
            </TableHeader>
            <TableBody 
              loadingContent={<Spinner label='Loading...' />}
              isLoading={isLoading}
            >
              {habits.map((habit) => {
                const completionPercentage = Number(calculateCompletionPercentage(habit));
                let color = 'success';

                if (completionPercentage < 75) {
                  color = 'danger';
                } else if (completionPercentage < 100) {
                  color = 'warning';
                }
                return (
                  <TableRow key={habit._id}>
                    <TableCell>{habit.name}</TableCell>
                    {weekDates.map((date) => {
                      const record = habit.records.find((record) => dayjs(record.date).isSame(date));

                      return (
                        <TableCell 
                          key={date}
                          className={`${habit?.specificDays.includes(dayjs.utc(date).format('dddd')) ? 'bg-primary-100': ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={record ? record.completed : false}
                            onChange={(e) => handleCheckboxChange(e, habit, date)}
                          />
                        </TableCell>
                      );
                    })}
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
              : <TextBox isLoading={isLoadingUpdateNote} key={noteKey} content={content} setContent={setContent} />
          }
        </div>
      </div>
    </div>
  );
}
