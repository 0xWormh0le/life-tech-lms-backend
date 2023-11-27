import { UserLessonHintStatus } from '../../../entities/codex-v2/UserLessonHintStatus'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'
import { LessonHint } from '../../../entities/codex-v2/LessonHint'
import { UserLessonStatus } from '../../../entities/codex-v2/UserLessonStatus'
import { LessonStep } from '../../../entities/codex-v2/LessonStep'

export interface LessonStepRepository {
  findById(
    id: string,
  ): Promise<Errorable<LessonStep | null, E<'UnknownRuntimeError'>>>
}

export interface LessonHintRepository {
  findById(
    id: string,
  ): Promise<Errorable<LessonHint | null, E<'UnknownRuntimeError'>>>
}

export interface UserLessonStatusRepository {
  findLatestByUserIdLessonId(
    userId: string,
    lessonId: string,
  ): Promise<Errorable<UserLessonStatus | null, E<'UnknownRuntimeError'>>>
}

export interface UserLessonHintStatusRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  create(
    userLessonHintStatus: UserLessonHintStatus,
  ): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface DatetimeRepository {
  now(): Promise<Errorable<Date, E<'UnknownRuntimeError'>>>
}

export default class CreateUserLessonHintStatusUseCase {
  constructor(
    private readonly datetimeRepository: DatetimeRepository,
    private readonly lessonStepRepository: LessonStepRepository,
    private readonly lessonHintRepository: LessonHintRepository,
    private readonly userLessonStatusRepository: UserLessonStatusRepository,
    private readonly userLessonHintStatusRepository: UserLessonHintStatusRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    input: {
      lessonHintId: string
    },
  ): Promise<
    Errorable<
      UserLessonHintStatus,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'LessonHintNotFound'>
      | E<'LessonStepNotFound'>
      | E<'UserLessonStatusNotFound'>
      | E<'UserLessonStatusAlreadyFinished'>
    >
  > => {
    if (
      authenticatedUser.role !== UserRoles.internalOperator &&
      authenticatedUser.role !== UserRoles.student
    ) {
      return failureErrorable('PermissionDenied', 'Access Denied')
    }

    const lessonHintRes = await this.lessonHintRepository.findById(
      input.lessonHintId,
    )

    if (lessonHintRes.hasError) {
      return lessonHintRes
    }

    if (!lessonHintRes.value) {
      return failureErrorable(
        'LessonHintNotFound',
        `lessonHint not found. lessonHintId: ${input.lessonHintId}`,
      )
    }

    const lessonStepRes = await this.lessonStepRepository.findById(
      lessonHintRes.value.lessonStepId,
    )

    if (lessonStepRes.hasError) {
      return lessonStepRes
    }

    if (!lessonStepRes.value) {
      return failureErrorable(
        'LessonStepNotFound',
        `lessonStepNotFound. lessonStepId: ${lessonHintRes.value.lessonStepId}, lessonHintId: ${lessonHintRes.value.id}`,
      )
    }

    const userLessonStatusRes =
      await this.userLessonStatusRepository.findLatestByUserIdLessonId(
        authenticatedUser.id,
        lessonStepRes.value.lessonId,
      )

    if (userLessonStatusRes.hasError) {
      return userLessonStatusRes
    }

    if (!userLessonStatusRes.value) {
      return failureErrorable(
        'UserLessonStatusNotFound',
        `userLessonStatusNotFound. userId: ${authenticatedUser.id}, lessonStepId: ${lessonStepRes.value.id}, lessonHintId: ${input.lessonHintId}`,
      )
    }

    if (userLessonStatusRes.value.finishedAt) {
      return failureErrorable(
        'UserLessonStatusAlreadyFinished',
        `userLessonStatusNotFound. userId: ${
          authenticatedUser.id
        }, lessonStepId: ${lessonStepRes.value.id}, lessonHintId: ${
          input.lessonHintId
        }, finishedAt: ${userLessonStatusRes.value.finishedAt.toISOString()}`,
      )
    }

    const issueIdRes = await this.userLessonHintStatusRepository.issueId()

    if (issueIdRes.hasError) {
      return issueIdRes
    }

    const nowRes = await this.datetimeRepository.now()

    if (nowRes.hasError) {
      return nowRes
    }

    const userLessonHintStatus: UserLessonHintStatus = {
      ...input,
      id: issueIdRes.value,
      userId: authenticatedUser.id,
      userLessonStatusId: userLessonStatusRes.value.id,
      createdAt: nowRes.value,
    }
    const createRes = await this.userLessonHintStatusRepository.create(
      userLessonHintStatus,
    )

    if (createRes.hasError) {
      return createRes
    }

    return successErrorable(userLessonHintStatus)
  }
}
