import { Teacher } from '../../../entities/codex-v2/Teacher'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface TeacherRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  create(teacher: Teacher): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export interface HumanUserRepository {
  findByUserId(
    userId: string,
  ): Promise<Errorable<unknown | null, E<'UnknownRuntimeError'>>>
}

export interface UserRepository {
  findById(
    userId: string,
  ): Promise<Errorable<unknown | null, E<'UnknownRuntimeError'>>>
}

export interface DatetimeRepository {
  now(): Promise<Errorable<Date, E<'UnknownRuntimeError'>>>
}

export default class CreateTeacherUseCase {
  constructor(
    private readonly datetimeRepository: DatetimeRepository,
    private readonly teacherRepository: TeacherRepository,
    private readonly humanUserRepository: HumanUserRepository,
    private readonly userRepository: UserRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    input: {
      userId: string
      firstName: string
      lastName: string
      externalLmsTeacherId: string | null
      isDeactivated: boolean
    },
  ): Promise<
    Errorable<
      Teacher,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'UserNotFoundError'>
      | E<'HumanUserNotFoundError'>
    >
  > => {
    if (authenticatedUser.role !== UserRoles.internalOperator) {
      return failureErrorable('PermissionDenied', 'Access Denied')
    }

    const humanUser = await this.humanUserRepository.findByUserId(input.userId)
    const user = await this.userRepository.findById(input.userId)

    if (humanUser.value === null) {
      return failureErrorable(
        'HumanUserNotFoundError',
        `User not found from input.userId: ${input.userId}`,
      )
    }

    if (user.value === null) {
      return failureErrorable(
        'UserNotFoundError',
        `User not found from input.userId: ${input.userId}`,
      )
    }

    const issueIdRes = await this.teacherRepository.issueId()

    if (issueIdRes.hasError) {
      return issueIdRes
    }

    const nowRes = await this.datetimeRepository.now()

    if (nowRes.hasError) {
      return nowRes
    }

    const teacher: Teacher = {
      ...input,
      id: issueIdRes.value,
      role: 'teacher',
      createdUserId: authenticatedUser.id,
      createdAt: nowRes.value,
    }
    const createRes = await this.teacherRepository.create(teacher)

    if (createRes.hasError) {
      return createRes
    }

    return successErrorable(teacher)
  }
}
