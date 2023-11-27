import { Student } from '../../../entities/codex-v2/Student'
import { E, Errorable, failureErrorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'
import { StudentStudentGroupAffiliation } from '../../../entities/codex-v2/StudentStudentGroupAffiliation'

export interface StudentRepository {
  findByIds(
    ids: string[],
  ): Promise<Errorable<Student[], E<'UnknownRuntimeError'>>>
}

export interface StudentStudentGroupAffiliationRepository {
  findByStudentGroupId(
    studentGroupId: string,
  ): Promise<
    Errorable<StudentStudentGroupAffiliation[], E<'UnknownRuntimeError'>>
  >
}

export default class GetStudentsByStudentGroupIdUseCase {
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly studentStudentGroupAffiliationRepository: StudentStudentGroupAffiliationRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    studentGroupId: string,
  ): Promise<
    Errorable<Student[], E<'UnknownRuntimeError'> | E<'PermissionDenied'>>
  > => {
    if (authenticatedUser.role !== UserRoles.internalOperator) {
      return failureErrorable('PermissionDenied', 'Access Denied')
    }

    const findStudentStudentGroupAffiliationRes =
      await this.studentStudentGroupAffiliationRepository.findByStudentGroupId(
        studentGroupId,
      )

    if (findStudentStudentGroupAffiliationRes.hasError) {
      return findStudentStudentGroupAffiliationRes
    }

    return await this.studentRepository.findByIds(
      findStudentStudentGroupAffiliationRes.value.map((a) => a.studentId),
    )
  }
}
