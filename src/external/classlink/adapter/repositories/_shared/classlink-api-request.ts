import axios, { AxiosResponse } from 'axios'
import type { UnionToIntersection, Get } from 'type-fest'
import { paths } from '../../../../../adapter/_gen/classlink-api-schema'
import { E, Errorable } from '../../../../../domain/usecases/shared/Errors'
import { replacePathParams } from '../../../../../_shared/utils'

export const CLASSLINK_API_BASE_URL = 'https://oneroster-proxy.classlink.io/'

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

export type StatusCodes<Path extends UrlPaths, Method extends HttpMethods> =
  | keyof Get<paths, `${Path}.${Method}.responses`>
  | 401

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
> = Get<paths, `${Path}.${Method}.responses.200.schema`>

export type ErrorResponseData<
  Path extends UrlPaths,
  Method extends HttpMethods,
  Status extends StatusCodes<Path, Method>,
> = Status extends 400
  ? Get<paths, `${Path}.${Method}.responses.400`>
  : Status extends 401
  ? Get<paths, `${Path}.${Method}.responses.401`>
  : Status extends 403
  ? Get<paths, `${Path}.${Method}.responses.403`>
  : Status extends 404
  ? Get<paths, `${Path}.${Method}.responses.404`>
  : Status extends 422
  ? Get<paths, `${Path}.${Method}.responses.422`>
  : Status extends 500
  ? Get<paths, `${Path}.${Method}.responses.500`>
  : Status extends 501
  ? Get<paths, `${Path}.${Method}.responses.501`>
  : Status extends 502
  ? Get<paths, `${Path}.${Method}.responses.502`>
  : Status extends 503
  ? Get<paths, `${Path}.${Method}.responses.503`>
  : Status extends 505
  ? Get<paths, `${Path}.${Method}.responses.505`>
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
  httpsAgent?: any
}

axios.interceptors.request.use((request) => {
  // console.log('Starting Classlink Request: ', request.url)
  return request
})
axios.interceptors.response.use(
  (response) => {
    // console.log('Classlink Response: ', response.status, response.data)
    return response
  },
  (error) => {
    // console.log(
    //   'Classlink Request Error: ',
    //   error.response?.status,
    //   error.response.data,
    // )
    return error.response
  },
)

export async function classlinkApiRequest<
  Path extends UrlPaths,
  Method extends HttpMethods,
>(
  config: AxiosConfigWrapper<Path, Method> & { appId: string },
): Promise<
  Errorable<
    SuceessResponseData<Path, Method>,
    | E<'ErrorStatusResponse', ErrorStatusResponse<Path, Method>>
    | E<'ErrorUnkown', { error: Error }>
  >
> {
  const headers: { [key: string]: string } = {
    'Content-Type': 'application/json',
    accept: 'application/json',
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
      return {
        hasError: true,
        error: {
          type: 'ErrorUnkown',
          message: {
            error: new Error(
              `swagger definition for ${config.url}.${
                config.method
              }.parameters.path is incorrect ${JSON.stringify(
                config.pathParams,
              )}`,
            ),
          },
        },
        value: null,
      }
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
      baseURL: `${CLASSLINK_API_BASE_URL}${config.appId}/`,
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
            status: result?.status as StatusCodes<Path, Method>,
            data: result?.data as ErrorResponseData<
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
      value: result?.data,
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
