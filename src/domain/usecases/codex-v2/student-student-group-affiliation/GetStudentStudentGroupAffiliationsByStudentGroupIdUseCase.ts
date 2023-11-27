import { StudentStudentGroupAffiliation } from '../../../entities/codex-v2/StudentStudentGroupAffiliation'
import { E, Errorable, failureErrorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface StudentStudentGroupAffiliationRepository {
  findByStudentGroupId(
    studentGroupId: string,
  ): Promise<
    Errorable<StudentStudentGroupAffiliation[], E<'UnknownRuntimeError'>>
  >
}

export default class GetStudentStudentGroupAffiliationsByStudentGroupIdUseCase {
  constructor(
    private readonly studentStudentGroupAffiliationRepository: StudentStudentGroupAffiliationRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    studentGroupId: string,
  ): Promise<
    Errorable<
      StudentStudentGroupAffiliation[],
      E<'UnknownRuntimeError'> | E<'PermissionDenied'>
    >
  > => {
    if (authenticatedUser.role !== UserRoles.internalOperator) {
      return failureErrorable('PermissionDenied', 'Access Denied')
    }

    return await this.studentStudentGroupAffiliationRepository.findByStudentGroupId(
      studentGroupId,
    )
  }
}
