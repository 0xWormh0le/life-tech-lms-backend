import { DataSource } from 'typeorm'
import { URL } from 'url'
import { UserRepository } from '../../../../repositories/UserRepository'
import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'

type Response = Paths.GetAfterLessonCleared.Responses.$200

export class PlayerApiGetAfterLessonClearedExpressHandler {
  constructor(
    private appDataSource: DataSource,
    private codexUsaFronteneBaseUrl: string,
  ) {}

  handler: HandlerWithToken<undefined, {}, {}, Response> = async (_, token) => {
    // User Authentication
    const userRepository = new UserRepository(this.appDataSource)
    const userByAccessTokenResult = await userRepository.getUserByAccessToken(
      token,
    )

    if (userByAccessTokenResult.hasError) {
      console.error(
        `failed to getUserByAccessToken ${token} ${JSON.stringify(
          userByAccessTokenResult.error,
        )}`,
      )

      const response200: Paths.GetAfterLessonCleared.Responses.$200 = {
        type: 'full_url',
        value: new URL('/', this.codexUsaFronteneBaseUrl).toString(),
      }

      return { statusCode: 200, response: response200 }
    }

    if (userByAccessTokenResult.value === null) {
      console.error(
        `failed to getUserByAccessToken ${token} userByAccessTokenResult.value is null somehow`,
      )

      const response200: Paths.GetAfterLessonCleared.Responses.$200 = {
        type: 'full_url',
        value: new URL('/', this.codexUsaFronteneBaseUrl).toString(),
      }

      return { statusCode: 200, response: response200 }
    }

    // Get User Settings
    const requestedUser = userByAccessTokenResult.value

    const response200: Paths.GetAfterLessonCleared.Responses.$200 = {
      type: 'full_url',
      value:
        requestedUser.role === 'teacher' ||
        requestedUser.role === 'administrator'
          ? new URL('/lesson-guidance', this.codexUsaFronteneBaseUrl).toString()
          : new URL('/', this.codexUsaFronteneBaseUrl).toString(),
    }

    return { statusCode: 200, response: response200 }
  }
}
