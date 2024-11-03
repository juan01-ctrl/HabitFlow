import axios from "axios";

import { IHabit }  from "../models/Habit";
import { IRecord } from "../models/Record";

export type IGetHabitsResponseItem = IHabit & { records: IRecord[] }

export const createHabit = ({ body }: {
    body: Partial<IHabit>
}) => axios.post('/api/habits', body)

export const getHabits = (): Promise<IGetHabitsResponseItem[]> => axios.get('/api/habits')
  .then(({ data }) => data)

export const deleteHabit = ({ _id }: {
    _id: string
}) => axios.delete(`/api/habits/${_id}`)

export const updateHabit = ({ body, _id }) => axios.patch(`/api/habits/${_id}`, body)