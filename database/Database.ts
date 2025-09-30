import is from '@zarco/isness'
import mongoose from 'mongoose'
import { Env } from '../config/Env.ts'
import { Print } from '../utilities/static/Print.ts'

const print = new Print()

export interface IDatabaseConnection {
  username: string
  hostname: string
  database: string
}

export class Database {
  private username: string
  private password: string
  private hostname: string
  private database: string

  private printConnectionStringOnConnect = true

  constructor(databaseConnection: IDatabaseConnection) {
    print.info('Connection', databaseConnection)

    this.hostname = databaseConnection.hostname
    this.database = databaseConnection.database
    this.username = databaseConnection.username
    this.password = Env.getDatabasePasswordByUsername(this.username)
    this.validate()
  }

  private validate = (): void => {
    if (!this.username) {
      throw Error('[Database] Please provide a database username!')
    }
    if (!this.hostname) {
      throw Error('[Database] Please provide a database hostname!')
    }
    if (!this.database) {
      throw Error('[Database] Please provide a database name!')
    }
    if (!this.password) {
      throw Error('[Database] Please provide a database password!')
    }
  }

  public get connectionString(): string {
    if (this.hostname.includes('ondigitalocean')) {
      return `mongodb+srv://${this.username}:${this.password}@${this.hostname}/${this.database}?tls=true&authSource=admin`
    }
    return `mongodb+srv://${this.username}:${this.password}@${this.hostname}/${this.database}`
  }

  public connect = (): mongoose.Connection => {
    try {
      if (this.printConnectionStringOnConnect) {
        print.info(this.connectionString)
      }
      // filtra propriedades que não estão no schema
      mongoose.set('strictQuery', false)

      const options: mongoose.ConnectOptions = {
        maxPoolSize: this.getMaxPoolSize(), // Adjust pool size as needed
      }

      const connection = mongoose.createConnection(this.connectionString, options)

      connection.on('connected', () => {
        print.success(
          `Successfully connected to ${this.database} at ${this.hostname}`,
        )
      })

      return connection
    } catch (error) {
      print.error(`Error connecting to database: ${error}`)
      throw error
    }
  }

  private getMaxPoolSize = (): number => {
    if (Env.mongodbMaxPoolSize) return Env.mongodbMaxPoolSize

    const defaultMaxPoolSize = 20;

    if (!is.number(defaultMaxPoolSize as any)) {
      new Print().info(`Invalid default maxPoolSize value: ${defaultMaxPoolSize}, using 10`)
      return 10
    }

    return Number(defaultMaxPoolSize)
  }
}

const databaseConfiguration: IDatabaseConnection = {
  username: Env.mongodbUsername ?? '',
  hostname: Env.mongodbHostname ?? '', 
  database: Env.mongodbDatabase ?? '',
}

const database = new Database(databaseConfiguration);

export const connectionString = database.connectionString;

const dbConnection = database.connect();

export { dbConnection }
