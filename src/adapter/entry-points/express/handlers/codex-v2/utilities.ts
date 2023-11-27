import { ErrorCode } from './_gen/resolvers-type'
import { E, Errorable } from '../../../../../domain/usecases/shared/Errors'

export function valueOrThrowErr<T>(
  res: Errorable<T, E<'PermissionDenied' | string>>,
) {
  if (res.hasError) {
    console.error(JSON.stringify(res))
    switch (res.error.type) {
      case 'PermissionDenied':
      case 'UnknownRuntimeError':
        throw new GraphqlError(
          res.error.type,
          res.error.message,
          typeof res.error.stack === 'string'
            ? res.error.stack
            : JSON.stringify(res.error.stack),
        )
      default:
        throw new GraphqlError('UnknownRuntimeError', res.error?.message)
    }
  }

  return res.value
}

export class GraphqlError extends Error {
  readonly errorCode: ErrorCode

  constructor(
    errCode: string,
    readonly message: string,
    readonly stack?: string,
  ) {
    super(errCode)

    if (errCode === 'PermissionDenied') {
      this.errorCode = ErrorCode.PermissionDenied
    } else {
      this.errorCode = ErrorCode.UnknownRuntimeError
    }
  }
}
