import { Types } from 'mongoose';

export interface ITodo {
  _id: Types.ObjectId;
  description: string;
  isCompleted: boolean;
}