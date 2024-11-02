import { InferSchemaType, model, models, Schema } from "mongoose";


export const WEEK_DAYS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]
const habitSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  categories:[String],
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  daysPerWeek: {
    type: Number,
    min: 1,
    max: 7,
    required: true
  },
  specificDays: { 
    type: [String],
    enum: WEEK_DAYS,
  },
  records: [{ 
    date: { type: Date, required: true },
    completed: { type: Boolean, default: false }, 
  }],
  startDate: {
    type: Date, 
    required: true
  }
}, { timestamps: true });

const Habit = models?.Habit || model('Habit', habitSchema);

export type HabitSchemaType = InferSchemaType<typeof habitSchema>

export interface IHabit extends HabitSchemaType {
  _id: string;
}

export default Habit; 