import { Router } from 'express'
import { UserController } from './UserController.ts'

const UserRouter = Router()
const userController = new UserController()

UserRouter.post('/', userController.create)
UserRouter.get('/:id', userController.findById)
UserRouter.get('/', userController.findAll)
UserRouter.patch('/:id', userController.update)
UserRouter.delete('/:id', userController.delete)

export { UserRouter }
