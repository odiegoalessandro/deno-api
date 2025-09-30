import is from '@zarco/isness'
import { BaseSchema } from '../../base/BaseSchema.ts'
import { IUser } from './IUser.ts'

export const UserRef = []

export class User implements IUser {
  _id: IUser['_id']
  name: IUser['name']
  email: IUser['email']
  password: IUser['password']
  createdAt: IUser['createdAt']
  updatedAt: IUser['updatedAt']

  constructor(data: IUser) {
    this._id = data._id
    this.name = data.name
    this.email = data.email
    this.password = data.password
    this.createdAt = data.createdAt
    this.updatedAt = data.updatedAt
  }

  get firstName(): string {
    return this.name.split(' ')[0]
  }
}

class UserSchemaClass extends BaseSchema {
  constructor() {
    super({
      name: { 
        type: String, 
        required: true, 
        validate: {
          validator: is.string
        }
      },
      email: { 
        type: String, 
        required: true, 
        unique: true,
        validate: {
          validator: is.email
        }
      },
      password: { 
        type: String, 
        required: true,
      },
    })
  }
}

const UserSchema = new UserSchemaClass().schema

UserSchema.loadClass(User)

export { UserSchema }
