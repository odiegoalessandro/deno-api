import express, { Express } from 'express'
import morgan from 'morgan'

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
    server.use(express.json())
    server.use(express.urlencoded({ extended: true }))
    server.use(morgan('dev'))
  }

  protected listen(server: Express): void {
    server.listen(this.port, this.ip, () => {
      console.log(`Listening at ${this.ip || '0.0.0.0'}:${this.port}`)
    })
  }
}
