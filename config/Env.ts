import is from '@zarco/isness';
import { load } from "https://deno.land/std@0.201.0/dotenv/mod.ts";

await load({
  envPath: ".env.local",
  examplePath: ".env.example",
  defaultsPath: ".env.defaults",
  allowEmptyValues: false,
  export: true,
});

export class Env {
  static get(name: string, fallback = ""): string {
    return Deno.env.get(name) ?? fallback;
  }

  static get object() {
    return Deno.env.toObject();
  }

  static getDatabasePasswordByUsername(databaseUsername: string): string {
    if (!databaseUsername) throw Error('Please provide a database username!')

    const password = Deno.env.get(`DATABASE_PASSWORD_FOR_${databaseUsername}`)
    if (!password) throw Error(`No password found for ${databaseUsername}`)
    return password
  }

  static get jwtSecret() {
    return Deno.env.get('JWT_SECRET') ??
      'SDNuuJ3zhxLoZiYVXiBEq+X6H2SgIAnXE+ZIB7Fk5dk='
  }

  static get jwtAuthAlgorithm() {
    return 'HS256'
  }

  static get mongodbUsername(): string | null {
    const mongodbUsername = Deno.env.get('MONGODB_USERNAME')
    if (!mongodbUsername) {
      return null
    }
    return mongodbUsername
  }

  static get mongodbHostname(): string | null {
    const mongodbHostname = Deno.env.get('MONGODB_HOSTNAME')
   
    if (!mongodbHostname) {
      return null
    }
   
    return mongodbHostname
  }

  static get mongodbDatabase(): string | null {
    const mongodbDatabase = Deno.env.get('MONGODB_DATABASE')

    if (!mongodbDatabase) {
      return null
    }
    
    return mongodbDatabase
  }

  static get mongodbMaxPoolSize(): number | null {
    const mongodbMaxPoolSize = Deno.env.get('MONGODB_MAX_POOL_SIZE')

    if (!mongodbMaxPoolSize) {
      return null
    }

    if (!is.number(mongodbMaxPoolSize)) throw new Error(`Invalid MONGODB_MAX_POOL_SIZE: ${mongodbMaxPoolSize}`)

    return Number(mongodbMaxPoolSize)
  }

  static get authAccessTokenExpiration() {
    return 36000000 // 10 hours
  }
}