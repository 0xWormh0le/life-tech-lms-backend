import { Student } from '../../../entities/codex-v2/Student'
import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface StudentRepository {
  findAll(): Promise<Errorable<Student[], E<'UnknownRuntimeError'>>>
}

export default class GetStudentsUseCase {
  constructor(private readonly studentRepository: StudentRepository) {}

  run = async (
    authenticatedUser: User,
  ): Promise<
    Errorable<Student[], E<'UnknownRuntimeError'> | E<'PermissionDenied'>>
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

    return await this.studentRepository.findAll()
  }
}
