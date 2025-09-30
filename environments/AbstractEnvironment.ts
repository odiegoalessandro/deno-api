import express, { Express } from 'express'
import morgan from 'morgan'
import responser from 'responser'
import { Swagger } from '../docs/Swagger.ts'

export abstract class AbstractEnvironment {
  public port: number
  public ip: string = 'localhost'

  constructor(port: number) {
    if (!port || isNaN(port)) {
      throw Error(`Porta inválida: ${port}`)
    }
    this.port = port
  }

  protected initializeDefaultMiddlewares(server: Express): void {
    server.use(morgan('dev'))
    server.use(responser.default)
    server.use(express.json())
    server.use(express.urlencoded({ extended: true }))
    server.use(new Swagger().setupAndServe())
  }

  protected listen(server: Express): void {
    server.listen(this.port, this.ip, () => {
      console.log(`Listening at ${this.ip || 'localhost'}:${this.port}`)
    })
  }
}
