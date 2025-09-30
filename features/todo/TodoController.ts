import { Request, Response } from 'express'
import { throwlhos } from '../../globals/Throwlhos.ts'
import { ITodo } from '../../models/Todo/ITodo.ts'
import { TodoRepository } from '../../models/Todo/TodoRepository.ts'

class TodoController {
  private todoRepository: TodoRepository

  constructor(todoRepository: TodoRepository = new TodoRepository()) {
    this.todoRepository = todoRepository
  }

  create = async (req: Request, res: Response) => {
    const { description, userId } = req.body

    const [todo] = await this.todoRepository.create({
      description,
      userId,
    } as ITodo)

    return res.status(201).json(todo)
  }

  findAll = async (req: Request, res: Response) => {
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.max(1, Number(req.query.limit) || 10)
    const skip = (page - 1) * limit

    const [todos, total] = await Promise.all([
      this.todoRepository.findMany({}).skip(skip).limit(limit),
      this.todoRepository.countDocuments({})
    ])

    return res.status(200).json({
      data: todos,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    })
  }

  findById = async (req: Request, res: Response) => {
    const { id } = req.params
    const todo = await this.todoRepository.findById(id)

    if (!todo) {
      return throwlhos.err_notFound('Todo not found')
    }

    return res.status(200).json(todo)
  }

  findByUser = async (req: Request, res: Response) => {
    const { userId } = req.params
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.max(1, Number(req.query.limit) || 10)
    const isCompleted: boolean = req.query.isCompleted || null

    const result = await this.todoRepository.findByUser(userId, page, limit, isCompleted)

    return res.status(200).json(result)
  }

  toggleStatus = async (req: Request, res: Response) => {
    const { id } = req.params

    const todo = await this.todoRepository.findById(id)
    
    if (todo) {
      todo.isCompleted = !todo.isCompleted

      await this.todoRepository.updateById(id, { isCompleted: todo.isCompleted })

      return res.status(200).json(todo)
    }
    
    throwlhos.err_notFound('Todo not found')
  }

  delete = async (req: Request, res: Response) => {
    const { id } = req.params
    await this.todoRepository.deleteById(id)
    return res.status(204).send()
  }
}

export { TodoController }
