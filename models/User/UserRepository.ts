import mongoose from 'mongoose'
import { BaseRepository } from '../../base/BaseRepository.ts'
import { dbConnection } from '../../database/Database.ts'
import { IUser } from './IUser.ts'
import { UserRef, UserSchema } from './User.ts'

class UserRepository extends BaseRepository<IUser> {
  constructor(
    model: mongoose.Model<IUser> = dbConnection.model<IUser>('User', UserSchema)
  ) {
    super(model, UserRef)
  }

  findByEmail = (email: string) => {
    return this.model.findOne({ email })
  }
}

export { UserRepository }
