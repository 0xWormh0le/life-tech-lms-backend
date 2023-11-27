import { StudentGroup } from '../../../entities/codex-v2/StudentGroup'
import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface StudentGroupRepository {
  findAll(): Promise<Errorable<StudentGroup[], E<'UnknownRuntimeError'>>>
}

export default class GetStudentGroupsUseCase {
  constructor(
    private readonly studentGroupRepository: StudentGroupRepository,
  ) {}

  run = async (
    authenticatedUser: User,
  ): Promise<
    Errorable<StudentGroup[], E<'UnknownRuntimeError'> | E<'PermissionDenied'>>
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

    return await this.studentGroupRepository.findAll()
  }
}
