import { Request, Response } from 'express'
import { Types } from 'mongoose'
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

    if (!description || !userId) {
      return throwlhos.err_badRequest("description and userId are required")
    }

    const [todo] = await this.todoRepository.create({
      description,
      userId,
    } as ITodo)

    return res.send_created("TODO created successfully", todo)
  }


  findAll = async (req: Request, res: Response) => {

    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.max(1, Number(req.query.limit) || 10)
    const result = await this.todoRepository.paginate(
      [
        { $match: { } },
        { $sort: { createdAt: -1 } }
      ], 
      { 
        paginate: 
          { 
            page, 
            limit 
          } 
        }
    )

    return res.send_ok("TODOs found successfully", result)
  }

  findById = async (req: Request, res: Response) => {
    const { id } = req.params
    const todo = await this.todoRepository.findById(id)

    if (!todo) {
      return throwlhos.err_notFound('Todo not found')
    }

    return res.send_ok("TODO found successfully", todo)
  }

  findByUser = async (req: Request, res: Response) => {
    const { userId } = req.params
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.max(1, Number(req.query.limit) || 10)
    const match: Record<string, unknown> = { userId: new Types.ObjectId(userId) }
    const isCompleted: boolean | null =
      req.query.isCompleted === undefined
        ? null
        : req.query.isCompleted === 'true';

    
    if (isCompleted !== null) { 
      match.isCompleted = isCompleted
    }

    const result = await this.todoRepository.paginate(
      [
        { $match: match },
        { $sort: { createdAt: -1 } }
      ],
      {
        paginate: { page, limit }
      }
    )

    return res.send_ok("TODOs by user found successfully", result)
  }

  toggleStatus = async (req: Request, res: Response) => {
    const { id } = req.params

    const todo = await this.todoRepository.findById(id)
    
    if (todo) {
      todo.isCompleted = !todo.isCompleted

      await this.todoRepository.updateById(id, { isCompleted: todo.isCompleted })

      return res.send_ok("TODO updated successfully", todo)
    }
    
    throwlhos.err_notFound('TODO not found')
  }

  delete = async (req: Request, res: Response) => {
    const { id } = req.params
    
    await this.todoRepository.deleteById(id)
    return res.send_noContent("TODO deleted succesfully")
  }
}

export { TodoController }
