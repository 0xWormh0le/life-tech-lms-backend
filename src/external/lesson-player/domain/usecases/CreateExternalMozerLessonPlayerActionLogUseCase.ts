import { ExternalMozerLessonPlayerActionLog } from '../entities/ExternalMozerLessonPlayerActionLog'
import {
  E,
  Errorable,
  successErrorable,
} from '../../../../domain/usecases/shared/Errors'
import { User } from '../../../../domain/entities/codex-v2/User'

export interface ExternalMozerLessonPlayerActionLogRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  create(
    externalMozerLessonPlayerActionLog: ExternalMozerLessonPlayerActionLog,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface DatetimeRepository {
  now(): Promise<Errorable<Date, E<'UnknownRuntimeError'>>>
}

export default class CreateExternalMozerLessonPlayerActionLogUseCase {
  constructor(
    private readonly externalMozerLessonPlayerActionLogRepository: ExternalMozerLessonPlayerActionLogRepository,
    private readonly datetimeRepository: DatetimeRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    input: Omit<
      ExternalMozerLessonPlayerActionLog,
      'id' | 'userId' | 'createdAt'
    >,
  ): Promise<
    Errorable<
      ExternalMozerLessonPlayerActionLog,
      E<'UnknownRuntimeError'> | E<'PermissionDenied'> | E<'DuplicatedName'>
    >
  > => {
    const issueIdRes =
      await this.externalMozerLessonPlayerActionLogRepository.issueId()

    if (issueIdRes.hasError) {
      return issueIdRes
    }

    const nowRes = await this.datetimeRepository.now()

    if (nowRes.hasError) {
      return nowRes
    }

    const externalMozerLessonPlayerActionLog: ExternalMozerLessonPlayerActionLog =
      {
        ...input,
        id: issueIdRes.value,
        userId: authenticatedUser.id,
        createdAt: nowRes.value,
      }
    const createRes =
      await this.externalMozerLessonPlayerActionLogRepository.create(
        externalMozerLessonPlayerActionLog,
      )

    if (createRes.hasError) {
      return createRes
    }

    return successErrorable(externalMozerLessonPlayerActionLog)
  }
}
