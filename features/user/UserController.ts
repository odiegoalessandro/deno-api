import { Request, Response } from 'express'
import { throwlhos } from '../../globals/Throwlhos.ts'
import { IUser } from '../../models/User/IUser.ts'
import { UserRepository } from '../../models/User/UserRepository.ts'


class UserController {
  private userRepository: UserRepository

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.userRepository = userRepository
  }

  create = async (req: Request, res: Response) => {
    // object destructuring garantee that get only the fields we want
    const { name, email, password } = req.body

    const [ user ] = await this.userRepository.create({
      name, 
      email, 
      password,
    } as IUser)

    return res.send_created("User created", user)
  }

  findAll = async (req: Request, res: Response) => {
    const page = Math.max(1, Number(req.query.page) || 1)
    const limit = Math.max(1, Number(req.query.limit) || 10)

    const result = await this.userRepository.paginate(
      [
        { $match: {} },
        { $sort: { createdAt: -1 } }
      ], 
      {
        paginate: {
          page,
          limit
        }
      }
    )

    return res.send_ok("Users found successfully", result)
  }

  findById = async (req: Request, res: Response) => {
    const { id } = req.params
    const user = await this.userRepository.findById(id)

    if (!user) {
      return throwlhos.err_notFound('User not found')
    }

    return res.send_ok("User found successfully", user)
  }

  update = async (req: Request, res: Response) => {
    const { id } = req.params
    const { name, email, password } = req.body
    
    const user = await this.userRepository.updateById(id, {
      name,
      email,
      password,
    } as IUser)

    return res.send_ok("User updated successfully", user)
  }

  delete = async (req: Request, res: Response) => {
    const { id } = req.params
    await this.userRepository.deleteById(id)
    return res.send_noContent("User deleted successfully")
  }
}

export { UserController }
