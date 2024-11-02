import { InferSchemaType, model, models, Schema, Types } from 'mongoose';

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String, 
  picture: String
}, { timestamps: true });

const User = models?.User || model('User', userSchema);

type UserSchemaType = InferSchemaType<typeof userSchema>

export interface IUser extends UserSchemaType {
  _id: string;
}

export default User;