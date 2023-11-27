import { Teacher } from '../../../entities/codex-v2/Teacher'
import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface TeacherRepository {
  findAll(): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>>
}

export default class GetTeachersUseCase {
  constructor(private readonly teacherRepository: TeacherRepository) {}

  run = async (
    authenticatedUser: User,
  ): Promise<
    Errorable<Teacher[], E<'UnknownRuntimeError'> | E<'PermissionDenied'>>
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

    return await this.teacherRepository.findAll()
  }
}
