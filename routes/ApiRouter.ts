import { Request, Response, Router } from 'express'
import { TodoRouter } from '../features/todo/TodoRouter.ts'
import { UserRouter } from '../features/user/UserRouter.ts'

const ApiRouter = Router()

// deno-lint-ignore no-unused-vars
ApiRouter.get('/api/status', (req: Request, res: Response) => {
  return res.send(200);
})

ApiRouter.use("/user", UserRouter)
ApiRouter.use("/todo", TodoRouter)

export { ApiRouter }
