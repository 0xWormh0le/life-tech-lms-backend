import path from 'path'
import { DataSource } from 'typeorm'
import { TypeormEntities } from '../typeorm/data-source'

export let appDataSource: DataSource | undefined = undefined

export const setupEnvironment = async () => {
  // Clear database
  appDataSource = new DataSource({
    // These are the same as the values defined in env/api-e2d-test/docker-compose.yaml
    type: 'postgres',
    host: 'localhost',
    port: 25432,
    username: 'codex',
    password: 'codex',
    database: 'codex',
    migrationsRun: true,
    synchronize: false,
    // logging: true,
    entities: TypeormEntities,
    migrations: ['./src/adapter/typeorm/migration/*.js'],
    subscribers: [],
    connectTimeoutMS: 8000,
    dropSchema: true, // remove all data instead of clear each entity data
  })
  await appDataSource
    .initialize()
    .catch((e) =>
      console.log(`appDataSource.initialize failed ${JSON.stringify(e)}`),
    )
}

export const teardownEnvironment = async () => {
  appDataSource?.destroy()
}
