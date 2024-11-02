import axios from "axios";

import { IHabit } from "../models/Habit";

export const createHabit = ({ body }: {
    body: Partial<IHabit>
}) => axios.post('/api/habits', body)

export const getHabits = (): Promise<IHabit[]> => axios.get('/api/habits')
  .then(({ data }) => data)

export const deleteHabit = ({ _id }: {
    _id: string
}) => axios.delete(`/api/habits/${_id}`)

export const updateHabit = ({ body, _id }) => axios.patch(`/api/habits/${_id}`, body)