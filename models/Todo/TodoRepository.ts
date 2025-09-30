import mongoose, { Types } from 'mongoose'
import { BaseRepository } from '../../base/BaseRepository.ts'
import { dbConnection } from '../../database/Database.ts'
import { ITodo } from './ITodo.ts'
import { TodoSchema } from './Todo.ts'

class TodoRepository extends BaseRepository<ITodo> {
  constructor(model: mongoose.Model<ITodo> = dbConnection.model<ITodo>('Todo', TodoSchema)) {
    super(model)
  }

  findByUser = async (userId: Types.ObjectId, page = 1, limit = 10, isCompleted: null | boolean = null) => {
    const filter: Record<string, any> = { userId }

    if(isCompleted !== null){
      filter.isCompleted = isCompleted
    }

    const skip = (page - 1) * limit
    const [todos, total] = await Promise.all([
      this.model.find(filter).skip(skip).limit(limit),
      this.model.countDocuments(filter)
    ])

    return {
      data: todos,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  }
}

export { TodoRepository }
