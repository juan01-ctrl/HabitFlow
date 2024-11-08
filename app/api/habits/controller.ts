import { Types } from "mongoose";

import Habit, { IHabit } from "@/app/models/Habit";
import Record            from "@/app/models/Record";

export async function createHabit(data: Partial<IHabit>) {
  const newHabit = await Habit.create(data);
  return newHabit;
}

export const getHabits = async (userId: string) => {
  const objectIdUserId = new Types.ObjectId(userId);

  const habits = await Habit.aggregate([
    { $match: { userId: objectIdUserId, deletedAt: { $exists: false } } },
    {
      $lookup: {
        from: 'records',         
        localField: '_id',       
        foreignField: 'habitId', 
        as: 'records'     
      }
    }
  ]);
  
  return habits;
};

export const updateHabit = async (_id: string, updates: Partial<IHabit>) => {
  const habit = await Habit.findOneAndUpdate(
    { _id },
    updates,
    { new: true, runValidators: true }
  );

  if (!habit) {
    throw new Error('Habit not found or you do not have permission to edit it.');
  }

  return habit;
};

export const deleteHabit = async (_id: string) => {
  const result = await Habit.updateOne({ _id }, { deletedAt: new Date() });
  await Record.deleteMany({ habitId: _id })

  return result;
};