import { Express } from 'express'
import { APIGatewayProxyHandler, APIGatewayEvent, Context } from 'aws-lambda'
import serverlessExpress from '@vendia/serverless-express'
import { createApp } from '../express/app'

let app: Express | undefined = undefined

const handler: APIGatewayProxyHandler = async (
  event: APIGatewayEvent,
  context: Context,
) => {
  console.log(
    JSON.stringify(
      {
        logType: 'REQUEST',
        httpMethod: event.httpMethod,
        path: event.path,
        headers: event.headers,
        body: event.body ? JSON.parse(event.body) : null,
        event,
        context,
        env: process.env,
      },
      undefined,
      2,
    ),
  )

  if (!app) {
    app = await createApp()
  }

  const serverlessExpressServer = serverlessExpress({ app })
  const result = await serverlessExpressServer(event, context, () => {})

  console.log(
    JSON.stringify(
      {
        logType: 'RESULT',
        httpMethod: event.httpMethod,
        path: event.path,
        statusCode: result.statusCode,
        resultBody: result.body ? JSON.parse(result.body) : null,
        headers: event.headers,
        body: event.body ? JSON.parse(event.body) : null,
        rawResult: result,
        event,
        context,
        env: process.env,
      },
      undefined,
      2,
    ),
  )

  return result
}

exports.handler = handler
