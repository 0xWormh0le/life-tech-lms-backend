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
  findById(
    id: string,
  ): Promise<Errorable<Student | null, E<'UnknownRuntimeError'>>>
  update(student: Student): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
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

export default class UpdateStudentUseCase {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly humanUserRepository: HumanUserRepository,
    private readonly userRepository: UserRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    input: {
      id: string
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
      | E<'StudentNotFound'>
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

    const savedStudentRes = await this.studentRepository.findById(input.id)

    if (savedStudentRes.hasError) {
      return savedStudentRes
    }

    if (!savedStudentRes.value) {
      return failureErrorable(
        'StudentNotFound',
        `student not found. studentId: ${input.id}`,
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

    const student: Student = {
      ...input,
      id: savedStudentRes.value.id,
      role: savedStudentRes.value.role,
      createdAt: savedStudentRes.value.createdAt,
      createdUserId: savedStudentRes.value.createdUserId,
      classlinkTenantId: savedStudentRes.value.classlinkTenantId,
    }
    const res = await this.studentRepository.update(student)

    if (res.hasError) {
      return res
    }

    return successErrorable(student)
  }
}
