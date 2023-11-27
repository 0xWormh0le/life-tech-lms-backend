import express from 'express'
import { getCurrentInvoke } from '@vendia/serverless-express'

import { Components } from '../_gen/codex-usa-backend-types'
import {
  Handler,
  HandlerWithLambdaEvent,
  HandlerWithToken,
} from './handlers/shared/types'

export const callHandler =
  <TPathParams, TQuery, TBody, TResponse>(
    handler: Handler<TPathParams, TQuery, TBody, TResponse>,
  ) =>
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await handler({
        pathParams: req.params as unknown as TPathParams,
        query: req.query as unknown as TQuery,
        body: req.body as unknown as TBody,
      })

      if (result.headers) {
        res
          .status(result.statusCode)
          .header(result.headers)
          .json(result.response)
      } else {
        res.status(result.statusCode).json(result.response)
      }
    } catch (e) {
      res.status(500).json(<Components.Schemas.Error>{
        error: `runtime error ${e} ${(e as Error).stack}`,
      })
    }
  }

export const callHandlerWithToken =
  <TPathParams, TQuery, TBody, TResponse>(
    handler: HandlerWithToken<TPathParams, TQuery, TBody, TResponse>,
  ) =>
  async (req: express.Request, res: express.Response) => {
    if (!req.token) {
      res.status(500).json(<Components.Schemas.Error>{
        error: `bearer token is not provided. please check request's header ${req.rawHeaders}`,
      })

      return
    }
    try {
      const result = await handler(
        {
          pathParams: req.params as unknown as TPathParams,
          query: req.query as unknown as TQuery,
          body: req.body as unknown as TBody,
        },
        req.token,
      )

      res.status(result.statusCode).json(result.response).set(result.headers)
    } catch (e) {
      res.status(500).json(<Components.Schemas.Error>{
        error: `runtime error ${e} ${(e as Error).stack}`,
      })
    }
  }

export const callHandlerWithLambdaEvent =
  <TPathParams, TQuery, TBody, TResponse>(
    handler: HandlerWithLambdaEvent<TPathParams, TQuery, TBody, TResponse>,
  ) =>
  async (req: express.Request, res: express.Response) => {
    const currentInvoke = getCurrentInvoke()

    try {
      const result = await handler(
        {
          pathParams: req.params as unknown as TPathParams,
          query: req.query as unknown as TQuery,
          body: req.body as unknown as TBody,
        },
        currentInvoke.event ?? null,
        currentInvoke.context ?? null,
      )

      res.status(result.statusCode).json(result.response)
    } catch (e) {
      res.status(500).json(<Components.Schemas.Error>{
        error: `runtime error ${e} ${(e as Error).stack}`,
      })
    }
  }
