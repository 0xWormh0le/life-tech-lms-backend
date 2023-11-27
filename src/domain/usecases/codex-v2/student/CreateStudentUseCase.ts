import { Student } from '../../../entities/codex-v2/Student'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface StudentRepository {
  issueId(): Promise<Errorable<string, E<'UnknownRuntimeError'>>>
  create(student: Student): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
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

export default class CreateStudentUseCase {
  constructor(
    private readonly datetimeRepository: DatetimeRepository,
    private readonly studentRepository: StudentRepository,
    private readonly humanUserRepository: HumanUserRepository,
    private readonly userRepository: UserRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    input: {
      userId: string
      nickName: string
      externalLmsStudentId: string | null
      isDeactivated: boolean
    },
  ): Promise<
    Errorable<
      Student,
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

    const issueIdRes = await this.studentRepository.issueId()

    if (issueIdRes.hasError) {
      return issueIdRes
    }

    const nowRes = await this.datetimeRepository.now()

    if (nowRes.hasError) {
      return nowRes
    }

    const student: Student = {
      ...input,
      id: issueIdRes.value,
      role: 'student',
      createdUserId: authenticatedUser.id,
      classlinkTenantId: null,
      createdAt: nowRes.value,
    }
    const createRes = await this.studentRepository.create(student)

    if (createRes.hasError) {
      return createRes
    }

    return successErrorable(student)
  }
}
