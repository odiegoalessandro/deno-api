import express from "express"
import { Env } from '../config/Env.ts'
import { ApiRouter } from '../routes/ApiRouter.ts'
import { AbstractEnvironment } from './AbstractEnvironment.ts'

export class ApiEnvironment extends AbstractEnvironment {
  constructor() {
    const port = Env.port ?? 3000

    super(port)
  } 

  public run = () => {
    const server = express()
    
    this.initializeDefaultMiddlewares(server)
    
    server.use(ApiRouter)

    this.listen(server)
  }
}