
import { InferSchemaType, Schema, model, models } from 'mongoose';

const noteSchema = new Schema({
  content: {
    type: String,
    required: true, 
  },
  date: {
    type: Date,
    default: Date.now,
    unique: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
}, {
  timestamps: true
});

const Note = models?.Note || model('Note', noteSchema);

export type NoteSchemaType = InferSchemaType<typeof noteSchema>

export interface INote extends NoteSchemaType {
  _id: string;
}

export default Note; 