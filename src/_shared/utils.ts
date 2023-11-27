import {
  Errorable,
  E,
  failureErrorable,
} from '../domain/usecases/shared/Errors'

export const excludeNull = <T>(array: (T | null)[]): T[] => {
  return array.filter((e: T | null): e is T => !!e)
}

export const replacePathParams = (
  pathString: string,
  params: { [key: string]: string },
): string => {
  let resultString = pathString

  for (const key in params) {
    if (!Object.prototype.hasOwnProperty.call(params, key)) {
      continue
    }

    const param = params[key]

    resultString = resultString.replace(`{${key}}`, param)
  }

  return resultString
}

export const shouldBeNever = <T>(
  value: never,
): Errorable<T, E<'UnknownRuntimeError'>> => {
  return failureErrorable(
    'UnknownRuntimeError',
    `value should be never. value: ${JSON.stringify(value)}`,
  )
}
