import { StudentStudentGroupAffiliation } from '../../../entities/codex-v2/StudentStudentGroupAffiliation'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface StudentStudentGroupAffiliationRepository {
  findById(
    id: string,
  ): Promise<
    Errorable<StudentStudentGroupAffiliation | null, E<'UnknownRuntimeError'>>
  >
  delete(id: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export default class DeleteStudentStudentGroupAffiliationUseCase {
  constructor(
    private readonly studentStudentGroupAffiliationRepository: StudentStudentGroupAffiliationRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    id: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'StudentStudentGroupAffiliationNotFound'>
    >
  > => {
    if (authenticatedUser.role !== UserRoles.internalOperator) {
      return failureErrorable('PermissionDenied', 'Access Denied')
    }

    const savedRes =
      await this.studentStudentGroupAffiliationRepository.findById(id)

    if (savedRes.hasError) {
      return savedRes
    }

    if (!savedRes.value) {
      return failureErrorable(
        'StudentStudentGroupAffiliationNotFound',
        `studentStudentGroupAffiliation not found. id: ${id}`,
      )
    }

    const deletedRes =
      await this.studentStudentGroupAffiliationRepository.delete(id)

    if (deletedRes.hasError) {
      return deletedRes
    }

    return successErrorable(undefined)
  }
}
