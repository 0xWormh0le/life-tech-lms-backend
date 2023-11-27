import { TeacherOrganizationAffiliation } from '../../../entities/codex-v2/TeacherOrganizationAffiliation'
import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface TeacherOrganizationAffiliationRepository {
  findAll(): Promise<
    Errorable<TeacherOrganizationAffiliation[], E<'UnknownRuntimeError'>>
  >
}

export default class GetTeacherOrganizationAffiliationsUseCase {
  constructor(
    private readonly teacherOrganizationAffiliationRepository: TeacherOrganizationAffiliationRepository,
  ) {}

  run = async (
    authenticatedUser: User,
  ): Promise<
    Errorable<
      TeacherOrganizationAffiliation[],
      E<'UnknownRuntimeError'> | E<'PermissionDenied'>
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

    return await this.teacherOrganizationAffiliationRepository.findAll()
  }
}
