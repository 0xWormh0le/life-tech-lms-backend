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
  findById(
    id: string,
  ): Promise<Errorable<Teacher | null, E<'UnknownRuntimeError'>>>
  update(teacher: Teacher): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
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

export default class UpdateTeacherUseCase {
  constructor(
    private readonly teacherRepository: TeacherRepository,
    private readonly humanUserRepository: HumanUserRepository,
    private readonly userRepository: UserRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    input: {
      id: string
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
      | E<'TeacherNotFound'>
      | E<'UserNotFoundError'>
      | E<'HumanUserNotFoundError'>
    >
  > => {
    if (authenticatedUser.role !== UserRoles.internalOperator) {
      return {
        hasError: true,
        error: {
          type: 'PermissionDenied',
          message: 'Access Denied',
        },
        value: null,
      }
    }

    const savedTeacherRes = await this.teacherRepository.findById(input.id)

    if (savedTeacherRes.hasError) {
      return savedTeacherRes
    }

    if (!savedTeacherRes.value) {
      return failureErrorable(
        'TeacherNotFound',
        `teacher not found. teacherId: ${input.id}`,
      )
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

    const teacher: Teacher = {
      ...input,
      id: savedTeacherRes.value.id,
      role: savedTeacherRes.value.role,
      createdAt: savedTeacherRes.value.createdAt,
      createdUserId: savedTeacherRes.value.createdUserId,
    }
    const res = await this.teacherRepository.update(teacher)

    if (res.hasError) {
      return res
    }

    return successErrorable(teacher)
  }
}
