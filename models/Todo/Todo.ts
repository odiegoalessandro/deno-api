import { Types } from 'mongoose'
import { BaseSchema } from '../../base/BaseSchema.ts'
import { ITodo } from './ITodo.ts'

export class Todo implements ITodo {
  _id: ITodo['_id']
  description: ITodo['description']
  isCompleted: ITodo['isCompleted']
  userId: ITodo['userId']

  constructor({ _id, description, isCompleted, userId }: ITodo) {
    this._id = _id
    this.description = description
    this.isCompleted = isCompleted
    this.userId = userId
  }
}

class TodoSchemaClass extends BaseSchema {
  constructor() {
    super({
      description: { type: String, required: true },
      isCompleted: { type: Boolean, default: false },
      userId: { type: Types.ObjectId, ref: 'User', required: true }
    })
  }
}

const TodoSchema = new TodoSchemaClass().schema
TodoSchema.loadClass(Todo)

export { TodoSchema }
