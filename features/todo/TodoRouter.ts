import { Router } from 'express'
import { TodoController } from './TodoController.ts'

const todoController = new TodoController()
const TodoRouter = Router()

TodoRouter.post('/', todoController.create)
TodoRouter.get('/', todoController.findAll)
TodoRouter.get('/user/:userId', todoController.findByUser)
TodoRouter.get('/:id', todoController.findById)
TodoRouter.put('/:id/toggle', todoController.toggleStatus)
TodoRouter.delete('/:id', todoController.delete)

export { TodoRouter }
