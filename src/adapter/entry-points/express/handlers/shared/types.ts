import { APIGatewayEvent, Context } from 'aws-lambda'

export type HandlerParameters<TPathParams, TQuery, TBody> = {
  pathParams: TPathParams
  query: TQuery
  body: TBody
}

export type HandlerResponse<TResponse> = Promise<{
  response: TResponse
  statusCode: number
  headers?: Record<string, string>
}>

export type Handler<TPathParams, TQuery, TBody, TResponse> = (
  params: HandlerParameters<TPathParams, TQuery, TBody>,
) => HandlerResponse<TResponse>

export type HandlerWithToken<TPathParams, TQuery, TBody, TResponse> = (
  params: HandlerParameters<TPathParams, TQuery, TBody>,
  token: string,
) => HandlerResponse<TResponse>

export type HandlerWithLambdaEvent<TPathParams, TQuery, TBody, TResponse> = (
  params: HandlerParameters<TPathParams, TQuery, TBody>,
  lambdaEvent: APIGatewayEvent | null,
  lambdaContext: Context | null,
) => HandlerResponse<TResponse>
