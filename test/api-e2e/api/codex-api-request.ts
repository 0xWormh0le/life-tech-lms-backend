import axios, { AxiosResponse, AxiosError } from 'axios'
import type { UnionToIntersection, Get } from 'type-fest'

import { E, Errorable } from '../../../src/domain/usecases/shared/Errors'
import { replacePathParams } from '../../../src/_shared/utils'
import { paths } from '../_gen/codex-api-schema'

export const isAxiosError = (error: any): error is AxiosError => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return !!error.isAxiosError
}

//
// Type utilities for generated API schema
//
/* eslint-disable @typescript-eslint/ban-types */
type GetOrEmpty<TBase, Path extends string | readonly string[]> = Get<
  TBase,
  Path
> extends Object
  ? Get<TBase, Path>
  : {}
/* eslint-enable @typescript-eslint/ban-types */
export type UrlPaths = keyof paths

export type HttpMethods = keyof UnionToIntersection<paths[keyof paths]>

export type HttpMethodsFilteredByPath<Path extends UrlPaths> = HttpMethods &
  keyof UnionToIntersection<paths[Path]>

export type StatusCodes<
  Path extends UrlPaths,
  Method extends HttpMethods,
> = keyof Get<paths, `${Path}.${Method}.responses`>

export type RequestPathParameters<
  Path extends UrlPaths,
  Method extends HttpMethods,
> = GetOrEmpty<paths, `${Path}.${Method}.parameters.path`>

export type RequestQueryParameters<
  Path extends UrlPaths,
  Method extends HttpMethods,
> = GetOrEmpty<paths, `${Path}.${Method}.parameters.query`>

export type RequestData<
  Path extends UrlPaths,
  Method extends HttpMethods,
> = Get<paths, `${Path}.${Method}.requestBody.content.application/json`>

export type SuceessResponseData<
  Path extends UrlPaths,
  Method extends HttpMethods,
> = Get<paths, `${Path}.${Method}.responses.200.content.application/json`>

export type ErrorResponseData<
  Path extends UrlPaths,
  Method extends HttpMethods,
  Status extends StatusCodes<Path, Method>,
> = Status extends 400
  ? Get<paths, `${Path}.${Method}.responses.400.content.application/json`>
  : Status extends 401
  ? Get<paths, `${Path}.${Method}.responses.401.content.application/json`>
  : Status extends 403
  ? Get<paths, `${Path}.${Method}.responses.403.content.application/json`>
  : Status extends 404
  ? Get<paths, `${Path}.${Method}.responses.404.content.application/json`>
  : Status extends 422
  ? Get<paths, `${Path}.${Method}.responses.422.content.application/json`>
  : Status extends 500
  ? Get<paths, `${Path}.${Method}.responses.500.content.application/json`>
  : Status extends 501
  ? Get<paths, `${Path}.${Method}.responses.501.content.application/json`>
  : Status extends 502
  ? Get<paths, `${Path}.${Method}.responses.502.content.application/json`>
  : Status extends 503
  ? Get<paths, `${Path}.${Method}.responses.503.content.application/json`>
  : Status extends 505
  ? Get<paths, `${Path}.${Method}.responses.505.content.application/json`>
  : undefined

type ErrorStatusResponse<Path extends UrlPaths, Method extends HttpMethods> = {
  status: StatusCodes<Path, Method>
  data: ErrorResponseData<Path, Method, StatusCodes<Path, Method>>
}

//
// Helpers wrapping axios
//
export type AxiosConfigWrapper<
  Path extends UrlPaths,
  Method extends HttpMethods,
> = {
  url: Path
  method: Method & HttpMethodsFilteredByPath<Path>
  pathParams?: RequestPathParameters<Path, Method>
  queryParams?: RequestQueryParameters<Path, Method>
  data?: RequestData<Path, Method>
  headers?: { [key: string]: string }
}

export async function request<
  Path extends UrlPaths,
  Method extends HttpMethods,
>(
  config: AxiosConfigWrapper<Path, Method>,
): Promise<
  Errorable<
    SuceessResponseData<Path, Method>,
    | E<'ErrorStatusResponse', ErrorStatusResponse<Path, Method>>
    | E<'ErrorUnkown', { error: Error }>
  >
> {
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
  }

  if (config.headers) {
    // append and overwrite headers
    for (const key in config.headers) {
      const element = config.headers[key]

      headers[key] = element
    }
  }

  let urlWithParams = config.url as string

  if (config.pathParams) {
    // Replace path parameters
    if (!((config.pathParams as unknown) instanceof Object)) {
      throw new Error(
        `swagger definition for ${config.url}.${
          config.method
        }.parameters.path is incorrect ${JSON.stringify(config.pathParams)}`,
      )
    }
    urlWithParams = replacePathParams(
      config.url,
      config.pathParams as { [key: string]: string },
    )
  }

  try {
    const result = await axios.request<
      SuceessResponseData<Path, Method>,
      AxiosResponse<SuceessResponseData<Path, Method>>,
      AxiosConfigWrapper<Path, Method>['data']
    >({
      ...config,
      url: urlWithParams,
      params: config.queryParams,
      headers,
    })

    if (result.status !== 200 && result.status !== 204) {
      return {
        hasError: true,
        error: {
          type: 'ErrorStatusResponse',
          message: {
            status: result.status as StatusCodes<Path, Method>,
            data: result.data as ErrorResponseData<
              Path,
              Method,
              StatusCodes<Path, Method>
            >,
          },
        },
        value: null,
      }
    }

    return {
      hasError: false,
      error: null,
      value: result.data,
    }
  } catch (e: unknown) {
    return {
      hasError: true,
      error: {
        type: 'ErrorUnkown',
        message: {
          error: e as Error,
        },
      },
      value: null,
    }
  }
}
