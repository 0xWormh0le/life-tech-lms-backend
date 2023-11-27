import { Awaited } from './Types'

export type Errorable<T, TError> =
  | { hasError: false; value: T; error: null }
  | { hasError: true; value: null; error: TError }

export type ValueType<TErrorable> = NonNullable<
  TErrorable extends Errorable<infer TValue, infer TError> ? TValue : null
>

export type ValueTypeOfPromiseErroableFunc<
  TFuncWithErrorable extends (args: any) => Promise<Errorable<any, any>>,
> = ValueType<Awaited<ReturnType<TFuncWithErrorable>>>

export type ErrorTypes<TErrorable> = NonNullable<
  TErrorable extends Errorable<infer TValue, infer TError>
    ? TError extends E<infer TErrorType, infer TErrorMessage>
      ? TErrorType
      : null
    : null
>

export interface E<T, TMessage = string> {
  type: T
  message: TMessage
  stack?: any
  internalError?: E<any>
}

export const wrapError = <T>(internalError: E<T>, message: string): E<T> => {
  return {
    ...internalError,
    message: `${message} ${JSON.stringify(internalError)}`,
    internalError,
  }
}

export const fromNativeError = <T>(
  type: T,
  error: Error,
  message?: string,
): E<T> => {
  return {
    type,
    message: `${message ?? ''} ${JSON.stringify(error)}`,
    stack: error.stack,
    internalError: {
      type,
      message: error.message,
      stack: error.stack,
    },
  }
}

export const toPrettyString = <T>(error: E<T>) => {}

export const successErrorable = <T, TError>(value: T): Errorable<T, TError> => {
  return {
    hasError: false,
    error: null,
    value: value,
  }
}

export const failureErrorable = <T, ErrorType>(
  errorType: ErrorType,
  message: string,
  e?: Error | unknown,
): Errorable<T, E<ErrorType>> => {
  if (!e) {
    return {
      hasError: true,
      error: {
        type: errorType,
        message: message,
      },
      value: null,
    }
  }

  return {
    hasError: true,
    error: {
      type: errorType,
      message:
        message +
        ' - ' +
        (e instanceof Error
          ? `${e.name}: ${e.message} stack: ${e.stack ?? ''}`
          : JSON.stringify(e)),
    },
    value: null,
  }
}

export type UnknownRuntimeErrorable<T> = Errorable<T, E<'UnknownRuntimeError'>>

export const unknownRuntimeError: (message: string) => {
  hasError: true
  error: {
    type: 'UnknownRuntimeError'
    message: string
  }
  value: null
} = (message) => ({
  hasError: true,
  error: {
    type: 'UnknownRuntimeError',
    message,
  },
  value: null,
})
