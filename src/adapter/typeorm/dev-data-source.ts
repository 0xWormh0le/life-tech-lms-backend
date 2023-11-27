// DO NOT use this in production environment
// This is ONLY for generating migration
if (process.env.NODE_ENV === 'production') {
  throw new Error(
    `DO NOT use this in production environment (current: ${process.env.NODE_ENV})\nThis is ONLY for generating migration`,
  )
}
import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
import { createAppDataSource } from './data-source'

dotenv.config()
if (!process.env.ROOT_FOLDER_PATH) {
  throw new Error(`process.env.ROOT_FOLDER_PATH is not defined`)
}
if (!process.env.POSTGRES_DATABASE_DIALECT) {
  throw new Error(`process.env.POSTGRES_DATABASE_DIALECT is not defined`)
}
if (!process.env.POSTGRES_DATABASE_HOST) {
  throw new Error(`process.env.POSTGRES_DATABASE_HOST is not defined`)
}
if (!process.env.POSTGRES_DATABASE_PORT) {
  throw new Error(`process.env.POSTGRES_DATABASE_PORT is not defined`)
}
if (!process.env.POSTGRES_DATABASE_USERNAME) {
  throw new Error(`process.env.POSTGRES_DATABASE_USERNAME is not defined`)
}
if (!process.env.POSTGRES_DATABASE_PASSWORD) {
  throw new Error(`process.env.POSTGRES_DATABASE_PASSWORD is not defined`)
}
if (!process.env.POSTGRES_DATABASE_NAME) {
  throw new Error(`process.env.POSTGRES_DATABASE_NAME is not defined`)
}

const POSTGRES_DATABASE_PORT = parseInt(process.env.POSTGRES_DATABASE_PORT, 10)
if (isNaN(POSTGRES_DATABASE_PORT)) {
  throw new Error(`process.env.POSTGRES_DATABASE_PORT is not a number`)
}

export default createAppDataSource({
  POSTGRES_DATABASE_DIALECT: process.env
    .POSTGRES_DATABASE_DIALECT as 'postgres',
  POSTGRES_DATABASE_HOST: process.env.POSTGRES_DATABASE_HOST,
  POSTGRES_DATABASE_PORT: parseInt(process.env.POSTGRES_DATABASE_PORT),
  POSTGRES_DATABASE_USERNAME: process.env.POSTGRES_DATABASE_USERNAME,
  POSTGRES_DATABASE_PASSWORD: process.env.POSTGRES_DATABASE_PASSWORD,
  POSTGRES_DATABASE_NAME: process.env.POSTGRES_DATABASE_NAME,
  ROOT_FOLDER_PATH: process.env.ROOT_FOLDER_PATH,
})
