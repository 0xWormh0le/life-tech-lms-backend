import { DataSource } from 'typeorm'

import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'
import CreateExternalMozerLessonPlayerActionLogUseCase from '../../../../../external/lesson-player/domain/usecases/CreateExternalMozerLessonPlayerActionLogUseCase'
import { S3ExternalMozerLessonPlayerActionLogRepository } from '../../../../../external/lesson-player/adapter/repositories/S3ExternalMozerLessonPlayerActionLogRepository'
import SystemDateTimeRepository from '../../../../repositories/codex-v2/SystemDateTimeRepository'
import { findUserByToken } from '../_shared/findUserByToken'

type Response =
  | Paths.PostActionLog.Responses.$200
  | Paths.PostActionLog.Responses.$401
  | Paths.PostActionLog.Responses.$404
  | Paths.PostActionLog.Responses.$500

export class PlayerApiPostActionLogExpressHandler {
  constructor(
    private appDataSource: DataSource,
    private staticFilesBaseUrl: string,
    private lessonPlayerBaseUrl: string,
  ) {}

  handler: HandlerWithToken<
    undefined,
    {},
    Paths.PostActionLog.RequestBody,
    Response
  > = async (params, token) => {
    console.log(`/action_log: params: ${JSON.stringify(params)}`)
    const userRes = await findUserByToken(token, this.appDataSource)
    if (userRes.hasError) {
      const errorType = userRes.error.type
      switch (errorType) {
        case 'PermissionDenied':
          const response401: Paths.PostActionLog.Responses.$401 = {
            login_status: 'no',
          }
          return { statusCode: 401, response: response401 }

        case 'UnknownRuntimeError':
          const response500: Paths.PostActionLog.Responses.$500 = {
            error: JSON.stringify(userRes.error),
          }
          return { statusCode: 500, response: response500 }
        default:
          const checkAllCoveredInCase: never = errorType
          throw new Error(checkAllCoveredInCase)
      }
    }
    const authenticatedUser = userRes.value

    const s3ExternalMozerLessonPlayerActionLogRepository =
      new S3ExternalMozerLessonPlayerActionLogRepository()
    const systemDateTimeRepository = new SystemDateTimeRepository()

    const useCase = new CreateExternalMozerLessonPlayerActionLogUseCase(
      s3ExternalMozerLessonPlayerActionLogRepository,
      systemDateTimeRepository,
    )
    await useCase.run(authenticatedUser, params.body)

    const response200: Paths.PostActionLog.Responses.$200 = {}

    return { statusCode: 200, response: response200 }
  }
}
