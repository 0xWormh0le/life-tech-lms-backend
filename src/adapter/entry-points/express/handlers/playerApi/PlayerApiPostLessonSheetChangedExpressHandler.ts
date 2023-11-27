import { DataSource } from 'typeorm'

import { Paths } from '../../../_gen/codex-usa-backend-types'
import { HandlerWithToken } from '../shared/types'

import { CreateUserLessonStepStatusUseCase } from '../../../../../domain/usecases/codex/CreateUserLessonStepStatusUseCase'
import { LessonRepository } from '../../../../repositories/LessonRepository'
import { UserRepository } from '../../../../repositories/UserRepository'
import { UserLessonStepStatusRepository } from '../../../../repositories/UserLessonStepStatusRepository'
import { CreateUserLessonStatusUseCase } from '../../../../../domain/usecases/codex/CreateUserLessonStatusUseCase'
import { UserLessonStatusesRepository } from '../../../../repositories/UserLessonStatusesRepository'

type Response =
  | Paths.PostStepPassed.Responses.$200
  | Paths.PostStepPassed.Responses.$401
  | Paths.PostStepPassed.Responses.$404
  | Paths.PostStepPassed.Responses.$500

export class PlayerApiPostLessonSheetChangedExpressHandler {
  constructor(
    private appDataSource: DataSource,
    private lessonPlayerBaseUrl: string,
  ) {}

  handler: HandlerWithToken<
    undefined,
    {},
    Paths.PostStepPassed.RequestBody,
    Response
  > = async (_params, _token) => {
    const response200: Paths.PostStepPassed.Responses.$200 = {}

    return { statusCode: 200, response: response200 }
  }
}
