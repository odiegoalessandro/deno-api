import { Types } from 'mongoose'

export interface IUser extends IUserVirtuals {
  _id: Types.ObjectId,
  name: string,
  email: string,
  password: string,
  createdAt: Date,
  updatedAt: Date
}

export interface IUserVirtuals {
  firstName: string
}