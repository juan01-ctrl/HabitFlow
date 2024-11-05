import { InferSchemaType, model, models, Schema, Types } from "mongoose";

const statisticSchema = new Schema({
  week: { 
    type: Date,
    required: true
  },
  completion: {
    // percent of completion from 0 to 1 (1 === 100%)
    type: Number,
    min: 0,
    max: 1,
    required: true
  },
  habitId: {
    type: Schema.Types.ObjectId,
    ref: 'Habit',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, { timestamps: true });

const Statistic = models?.Statistic || model('Statistic', statisticSchema);

export type StatisticSchemaType = InferSchemaType<typeof statisticSchema>

export interface IStatistic extends Omit<StatisticSchemaType, 'habitId' | 'userId'> {
  _id: Types.ObjectId | string;
  habitId: Types.ObjectId | string;
  userId: Types.ObjectId | string;
}

export default Statistic; 