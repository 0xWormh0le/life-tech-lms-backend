import { TeacherOrganizationAffiliation } from '../../../entities/codex-v2/TeacherOrganizationAffiliation'
import {
  E,
  Errorable,
  failureErrorable,
  successErrorable,
} from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'

export interface TeacherOrganizationAffiliationRepository {
  findById(
    id: string,
  ): Promise<
    Errorable<TeacherOrganizationAffiliation | null, E<'UnknownRuntimeError'>>
  >
  delete(id: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>>
}

export default class DeleteTeacherOrganizationAffiliationUseCase {
  constructor(
    private readonly teacherOrganizationAffiliationRepository: TeacherOrganizationAffiliationRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    id: string,
  ): Promise<
    Errorable<
      void,
      | E<'UnknownRuntimeError'>
      | E<'PermissionDenied'>
      | E<'TeacherOrganizationAffiliationNotFound'>
    >
  > => {
    if (authenticatedUser.role !== UserRoles.internalOperator) {
      return failureErrorable('PermissionDenied', 'Access Denied')
    }

    const savedRes =
      await this.teacherOrganizationAffiliationRepository.findById(id)

    if (savedRes.hasError) {
      return savedRes
    }

    if (!savedRes.value) {
      return failureErrorable(
        'TeacherOrganizationAffiliationNotFound',
        `teacherOrganizationAffiliation not found. id: ${id}`,
      )
    }

    const deletedRes =
      await this.teacherOrganizationAffiliationRepository.delete(id)

    if (deletedRes.hasError) {
      return deletedRes
    }

    return successErrorable(undefined)
  }
}
