import { Paths } from '../../../../_gen/codex-usa-backend-types'
import { HandlerWithLambdaEvent } from '../../shared/types'

type Response =
  | Paths.MaintenanceHealthCheck.Responses.$200
  | Paths.MaintenanceHealthCheck.Responses.$500

export class MaintenanceHealthCheckExpressHandler {
  handler: HandlerWithLambdaEvent<undefined, undefined, undefined, Response> =
    async (_, lambdaEvent /*, lambdaContext*/) => {
      if (!lambdaEvent) {
        return {
          statusCode: 200,
          response: {
            message: 'OK',
          },
        }
      }

      const ipAddress = lambdaEvent.headers['X-Forwarded-For']
      const userAgent = lambdaEvent.requestContext.identity.userAgent

      return {
        statusCode: 200,
        response: {
          message: `OK - ipAddress: ${ipAddress} userAgent: ${userAgent}`,
        },
      }
    }
}
