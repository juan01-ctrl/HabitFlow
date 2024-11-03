import { InferSchemaType, model, models, Schema, Types } from "mongoose";

const recordSchema = new Schema({
  date: { 
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
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

const Record = models?.Record || model('Record', recordSchema);

export type RecordSchemaType = InferSchemaType<typeof recordSchema>

export interface IRecord extends Omit<RecordSchemaType, 'habitId' | 'userId'> {
  _id: Types.ObjectId | string;
  habitId: Types.ObjectId | string;
  userId: Types.ObjectId | string;
}

export default Record; 