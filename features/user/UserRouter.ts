import { Router } from 'express'
import { UserController } from './UserController.ts'

const UserRouter = Router()
const userController = new UserController()

/**
 * @openapi
 * /user:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário criado
 */
UserRouter.post('/', userController.create)

/**
 * @openapi
 * /user/{id}:
 *   get:
 *     summary: Busca usuário por ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *       404:
 *         description: Usuário não encontrado
 */
UserRouter.get('/:id', userController.findById)

/**
 * @openapi
 * /user:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [User]
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
 *         description: Lista de usuários
 */
UserRouter.get('/', userController.findAll)

/**
 * @openapi
 * /user/{id}:
 *   patch:
 *     summary: Atualiza um usuário
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado
 */
UserRouter.patch('/:id', userController.update)

/**
 * @openapi
 * /user/{id}:
 *   delete:
 *     summary: Deleta um usuário
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Usuário deletado
 */
UserRouter.delete('/:id', userController.delete)

export { UserRouter }
