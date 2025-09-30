import { BaseSchema } from '../../base/BaseSchema.ts'
import { ITodo } from './ITodo.ts'

export class Todo implements ITodo {
  _id: ITodo['_id']
  description: ITodo['description']
  isCompleted: ITodo['isCompleted']

  constructor({ _id, description, isCompleted }: ITodo) {
    this._id = _id
    this.description = description
    this.isCompleted = isCompleted
  }

  toggleCompletion(): void {
    this.isCompleted = !this.isCompleted
  }
}

class TodoSchemaClass extends BaseSchema {
  constructor() {
    super({
      description: { type: String, required: true },
      isCompleted: { type: Boolean, default: false },
    })
  }
}

const TodoSchema = new TodoSchemaClass().schema
TodoSchema.loadClass(Todo)

export { TodoSchema }
