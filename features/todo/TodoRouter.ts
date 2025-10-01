import { Router } from 'express'
import { Types } from 'mongoose'
import { validateRequest } from "../../middlewares/validateRequest.ts"
import { TodoController } from './TodoController.ts'

const TodoRouter = Router()
const todoController = new TodoController()

/**
 * @openapi
 * /todo:
 *   post:
 *     summary: Cria uma nova tarefa
 *     tags: [Todo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tarefa criada
 */
TodoRouter.post(
  '/', 
  validateRequest(
    ['description', 'userId'],
    {
      userId: {
        validator: (v: string) => Types.ObjectId.isValid(v),
        message: 'userId inválido',
        isRequired: true
      },
      description: {
        validator: (v: string) => typeof v === 'string' && v.trim().length > 0,
        message: 'description deve ser uma string não vazia',
        isRequired: true
      }
    }
  ), 
  todoController.create
)

/**
 * @openapi
 * /todo:
 *   get:
 *     summary: Lista todas as tarefas
 *     tags: [Todo]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de tarefas
 */
TodoRouter.get('/', todoController.findAll)

/**
 * @openapi
 * /todo/user/{userId}:
 *   get:
 *     summary: Lista tarefas de um usuário
 *     tags: [Todo]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: isCompleted
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Lista de tarefas do usuário
 */
TodoRouter.get(
  '/user/:userId',
  validateRequest(
    ['userId'],
    {
      userId: {
        validator: (v: string) => Types.ObjectId.isValid(v),
        message: 'userId inválido',
        isRequired: true
      }
    },
    "params"
  ),
  todoController.findByUser
)

/**
 * @openapi
 * /todo/{id}:
 *   get:
 *     summary: Busca tarefa por ID
 *     tags: [Todo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Tarefa encontrada
 *       404:
 *         description: Tarefa não encontrada
 */
TodoRouter.get(
  '/:id',  
  validateRequest(
    ['id'],
    {
      id: {
        validator: (v: string) => Types.ObjectId.isValid(v),
        message: 'id inválido',
        isRequired: true
      }
    },
    "params"
  ), 
  todoController.findById
)

/**
 * @openapi
 * /todo/{id}/toggle:
 *   patch:
 *     summary: Alterna status da tarefa (concluída/não concluída)
 *     tags: [Todo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Tarefa atualizada
 *       404:
 *         description: Tarefa não encontrada
 */
TodoRouter.patch(
  '/:id/toggle', 
  validateRequest(
    ['id'],
    { id: { 
        validator: (v: string) => Types.ObjectId.isValid(v), 
        message: 'id inválido', 
        isRequired: true
      } 
    },
    "params"
  ),
  todoController.toggleStatus
)

/**
 * @openapi
 * /todo/{id}:
 *   delete:
 *     summary: Deleta uma tarefa
 *     tags: [Todo]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       204:
 *         description: Tarefa deletada
 */
TodoRouter.delete(
  '/:id',
  validateRequest(
    ['id'],
    { id: { 
        validator: (v: string) => Types.ObjectId.isValid(v), 
        message: 'id inválido', 
        isRequired: true
      } 
    },
    "params"
  ),
  todoController.delete
)

export { TodoRouter }
