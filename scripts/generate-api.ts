import { execSync } from 'child_process'
import { existsSync, readFileSync, rmdirSync, rmSync, writeFileSync } from 'fs'
import parseArgs from 'command-line-args'
import parseUsage from 'command-line-usage'
import SwaggerParser from '@apidevtools/swagger-parser'
import { join } from 'path'
import yaml from 'js-yaml'

type CLIArguments = {
  apiName?: string
}

const main = async () => {
  const args = parseArgs([
    { name: 'apiName', alias: 'n', type: String },
  ]) as CLIArguments

  if (!args.apiName) {
    console.log(
      parseUsage([
        {
          header: 'Options',
          optionList: [
            {
              name: 'apiName',
              alias: 'i',
              typeLabel: '(codex-usa-backend|lesson-player-api)',
              description: 'Name for APIs',
            },
          ],
        },
      ]),
    )

    return
  }

  const apiName = args.apiName
  const rootDirPath = execSync('git rev-parse --show-toplevel')
    .toString()
    .trim()
  const genDirPath = `${rootDirPath}/src/adapter/entry-points/_gen`

  // Dereference swagger yaml file
  const swaggerDefinition = await SwaggerParser.dereference(
    join(rootDirPath, `swagger/reference/${apiName}.yaml`),
  )

  writeFileSync(
    join(rootDirPath, `swagger/dereference-${apiName}.yaml`),
    yaml.dump(swaggerDefinition, { indent: 2 }),
  )

  // Generate express server router
  if (existsSync(`${genDirPath}/${apiName}-server`)) {
    rmdirSync(`${genDirPath}/${apiName}-server`, { recursive: true })
  }
  execSync(
    `docker run -v $(pwd):/app -w /app --rm -u $(id -u):$(id -g) openapitools/openapi-generator-cli:v6.2.1 generate -i /app/swagger/dereference-${apiName}.yaml -g nodejs-express-server -o /app/src/adapter/entry-points/_gen/${apiName}-server`,
  )
  execSync(`npx tsc ${genDirPath}/${apiName}-server/**/*.js ${genDirPath}/${apiName}-server/index.js ${genDirPath}/${apiName}-server/expressServer.js  --declaration --allowJs --emitDeclarationOnly
`)

  // Generate type defeinisions
  if (existsSync(`${genDirPath}/${apiName}-types.d.ts`)) {
    rmSync(`${genDirPath}/${apiName}-types.d.ts`)
  }
  execSync(
    `npx dtsgen -o ${genDirPath}/${apiName}-types.d.ts ${genDirPath}/${apiName}-server/api/openapi.yaml`,
  )

  const contentOfTypeDTs = readFileSync(
    `${genDirPath}/${apiName}-types.d.ts`,
  ).toString()
  const replaced = contentOfTypeDTs.replace(
    /declare namespace/g,
    'export declare namespace',
  )

  writeFileSync(`${genDirPath}/${apiName}-types.d.ts`, replaced)
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(
      'message' in e
        ? { message: e.message.toString() }
        : 'no message from err',
    )
    console.error(
      'stdout' in e ? { stdout: e.stdout.toString() } : 'no stdout from err',
    )
    console.error(
      'stderr' in e ? { stderr: e.stderr.toString() } : 'no stderr from err',
    )
    console.error(
      'output' in e ? { output: e.output.toString() } : 'no output from err',
    )
    process.exit('status' in e ? e.status : 1)
  })
