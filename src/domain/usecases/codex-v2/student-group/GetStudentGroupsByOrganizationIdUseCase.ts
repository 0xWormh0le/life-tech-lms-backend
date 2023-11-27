import { StudentGroup } from '../../../entities/codex-v2/StudentGroup'
import { E, Errorable, failureErrorable } from '../../shared/Errors'
import { User } from '../../../entities/codex-v2/User'
import { UserRoles } from '../../shared/Constants'
import { StudentGroupPackageAssignmentRepository } from '../_shared/repositories/StudentGroupPackageAssignmentRepository'
import { OrganizationRepository } from '../_shared/repositories/OrganizationRepository'
import { AdministratorRepository } from '../_shared/repositories/AdministratorRepository'
import { TeacherRepository } from '../_shared/repositories/TeacherRepository'
import { StudentRepository } from '../_shared/repositories/StudentRepository'
import { StudentGroupRepository } from '../_shared/repositories/StudentGroupRepository'
import {
  UseCaseStudentStudentGroupAffiliationRepository,
  UseCaseTeacherOrganizationAffiliationRepository,
} from '../student-group-package-assignment/GetStudentGroupPackageAssignmentsUseCase'
import { findDistrictIdsByAuthenticatedUser } from '../_shared/utility'

export type UseCaseStudentGroupPackageAssignmentRepository = Pick<
  StudentGroupPackageAssignmentRepository,
  'findAll' | 'findByStudentGroupId'
>

export type UseCaseStudentGroupRepository = Pick<
  StudentGroupRepository,
  'findById' | 'findByIds' | 'findByOrganizationId'
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

export default class GetStudentGroupsByOrganizationIdUseCase {
  constructor(
    private readonly studentGroupRepository: StudentGroupRepository,
    private readonly organizationRepository: UseCaseOrganizationRepository,
    private readonly administratorRepository: UseCaseAdministratorRepository,
    private readonly teacherRepository: UseCaseTeacherRepository,
    private readonly studentRepository: UseCaseStudentRepository,
    private readonly teacherOrganizationAffiliationRepository: UseCaseTeacherOrganizationAffiliationRepository,
    private readonly studentStudentGroupAffiliationRepository: UseCaseStudentStudentGroupAffiliationRepository,
  ) {}

  run = async (
    authenticatedUser: User,
    organizationId: string,
  ): Promise<
    Errorable<StudentGroup[], E<'UnknownRuntimeError'> | E<'PermissionDenied'>>
  > => {
    if (authenticatedUser.role !== UserRoles.internalOperator) {
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

      const organizationRes = await this.organizationRepository.findById(
        organizationId,
      )

      if (organizationRes.hasError) {
        return organizationRes
      } else if (!organizationRes.value) {
        return failureErrorable(
          'UnknownRuntimeError',
          `organization is not found. organizationId: ${organizationId}`,
        )
      }

      if (
        !districtIdsOfAuthenticatedUser.value.includes(
          organizationRes.value.districtId,
        )
      ) {
        return failureErrorable('PermissionDenied', 'Access Denied')
      }
    }

    return await this.studentGroupRepository.findByOrganizationId(
      organizationId,
    )
  }
}
