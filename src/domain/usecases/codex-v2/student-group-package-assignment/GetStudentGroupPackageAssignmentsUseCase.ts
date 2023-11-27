import { StudentGroupPackageAssignment } from '../../../entities/codex-v2/StudentGroupPackageAssignment'
import { E, Errorable, failureErrorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'
import { StudentGroupRepository } from '../_shared/repositories/StudentGroupRepository'
import { OrganizationRepository } from '../_shared/repositories/OrganizationRepository'
import { AdministratorRepository } from '../_shared/repositories/AdministratorRepository'
import { TeacherRepository } from '../_shared/repositories/TeacherRepository'
import { StudentRepository } from '../_shared/repositories/StudentRepository'
import { StudentStudentGroupAffiliationRepository } from '../_shared/repositories/StudentStudentGroupAffiliationRepository'
import { TeacherOrganizationAffiliationRepository } from '../_shared/repositories/TeacherOrganizationAffiliatioRepository'
import {
  findDistrictIdByStudentGroupId,
  findDistrictIdsByAuthenticatedUser,
} from '../_shared/utility'
import { StudentGroupPackageAssignmentRepository } from '../_shared/repositories/StudentGroupPackageAssignmentRepository'

export type UseCaseStudentGroupPackageAssignmentRepository = Pick<
  StudentGroupPackageAssignmentRepository,
  'findAll' | 'findByStudentGroupId'
>

export type UseCaseStudentGroupRepository = Pick<
  StudentGroupRepository,
  'findById' | 'findByIds'
>

export type UseCaseOrganizationRepository = Pick<
  OrganizationRepository,
  'findById' | 'findByIds'
>

export type UseCaseAdministratorRepository = Pick<
  AdministratorRepository,
  'findByUserId'
>

export type UseCaseTeacherRepository = Pick<TeacherRepository, 'findByUserId'>

export type UseCaseStudentRepository = Pick<StudentRepository, 'findByUserId'>

export type UseCaseStudentStudentGroupAffiliationRepository = Pick<
  StudentStudentGroupAffiliationRepository,
  'findByStudentId'
>

export type UseCaseTeacherOrganizationAffiliationRepository = Pick<
  TeacherOrganizationAffiliationRepository,
  'findByTeacherId'
>

export default class GetStudentGroupPackageAssignmentsUseCase {
  constructor(
    private readonly studentGroupPackageAssignmentRepository: UseCaseStudentGroupPackageAssignmentRepository,
    private readonly studentGroupRepository: UseCaseStudentGroupRepository,
    private readonly organizationRepository: UseCaseOrganizationRepository,
    private readonly administratorRepository: UseCaseAdministratorRepository,
    private readonly teacherRepository: UseCaseTeacherRepository,
    private readonly studentRepository: UseCaseStudentRepository,
    private readonly teacherOrganizationAffiliationRepository: UseCaseTeacherOrganizationAffiliationRepository,
    private readonly studentStudentGroupAffiliationRepository: UseCaseStudentStudentGroupAffiliationRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    studentGroupId: string | null,
  ): Promise<
    Errorable<
      StudentGroupPackageAssignment[],
      E<'UnknownRuntimeError'> | E<'PermissionDenied'>
    >
  > => {
    if (!studentGroupId) {
      if (authenticatedUser.role !== UserRoles.internalOperator) {
        return failureErrorable('PermissionDenied', 'Access Denied')
      }

      return await this.studentGroupPackageAssignmentRepository.findAll()
    }

    const districtIdsOfAuthenticatedUser =
      await findDistrictIdsByAuthenticatedUser(
        authenticatedUser,
        this.administratorRepository,
        this.organizationRepository,
        this.teacherRepository,
        this.teacherOrganizationAffiliationRepository,
        this.studentGroupRepository,
        this.studentRepository,
        this.studentStudentGroupAffiliationRepository,
      )

    if (districtIdsOfAuthenticatedUser.hasError) {
      return districtIdsOfAuthenticatedUser
    }

    const districtIdOfTargetStudentGroup = await findDistrictIdByStudentGroupId(
      studentGroupId,
      this.organizationRepository,
      this.studentGroupRepository,
    )

    if (districtIdOfTargetStudentGroup.hasError) {
      return districtIdOfTargetStudentGroup
    }

    if (
      authenticatedUser.role !== 'internalOperator' &&
      !districtIdsOfAuthenticatedUser.value.includes(
        districtIdOfTargetStudentGroup.value,
      )
    ) {
      return failureErrorable('PermissionDenied', 'Access Denied')
    }

    return await this.studentGroupPackageAssignmentRepository.findByStudentGroupId(
      studentGroupId,
    )
  }
}
