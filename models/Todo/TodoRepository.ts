import mongoose from 'mongoose'
import { BaseRepository } from '../../base/BaseRepository.ts'
import { dbConnection } from '../../database/Database.ts'
import { ITodo } from './ITodo.ts'
import { TodoSchema } from './Todo.ts'

class TodoRepository extends BaseRepository<ITodo> {
  constructor(model: mongoose.Model<ITodo> = dbConnection.model<ITodo>('Todo', TodoSchema)) {
    super(model)
  }
}

export { TodoRepository }
