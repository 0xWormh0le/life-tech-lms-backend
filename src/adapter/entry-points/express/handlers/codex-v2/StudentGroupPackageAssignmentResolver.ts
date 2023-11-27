import { DataSource } from 'typeorm'
import GetStudentGroupPackageAssignmentsUseCase from '../../../../../domain/usecases/codex-v2/student-group-package-assignment/GetStudentGroupPackageAssignmentsUseCase'
import { RdbStudentGroupPackageAssignmentRepository } from '../../../../repositories/codex-v2/RdbStudentGroupPackageAssignmentRepository'
import {
  CreateStudentGroupPackageAssignmentPayload,
  DeleteStudentGroupPackageAssignmentPayload,
  MutationCreateStudentGroupPackageAssignmentArgs,
  MutationDeleteStudentGroupPackageAssignmentArgs,
  QueryStudentGroupPackageAssignmentsArgs,
  StudentGroupPackageAssignment,
} from './_gen/resolvers-type'
import { StudentGroupPackageAssignment as DomainEntityStudentGroupPackageAssignment } from '../../../../../domain/entities/codex-v2/StudentGroupPackageAssignment'
import SystemDateTimeRepository from '../../../../repositories/codex-v2/SystemDateTimeRepository'
import { RdbDistrictRepository } from '../../../../repositories/codex-v2/RdbDistrictRepository'
import { HardCordedCurriculumPackageRepository } from '../../../../repositories/codex-v2/HardCordedCurriculumPackageRepository'
import CreateStudentGroupPackageAssignmentUseCase from '../../../../../domain/usecases/codex-v2/student-group-package-assignment/CreateStudentGroupPackageAssignmentUseCase'
import DeleteStudentGroupPackageAssignmentUseCase from '../../../../../domain/usecases/codex-v2/student-group-package-assignment/DeleteStudentGroupPackageAssignmentUseCase'
import { RdbOrganizationRepository } from '../../../../repositories/codex-v2/RdbOrganizationRepository'
import { RdbStudentGroupRepository } from '../../../../repositories/codex-v2/RdbStudentGroupRepository'
import { RdbDistrictPurchasedPackageRepository } from '../../../../repositories/codex-v2/RdbDistrictPurchasedPackageRepository'
import { valueOrThrowErr } from './utilities'
import { QueryResult, ResolverWithAuthenticatedUser } from '.'
import { RdbAdministratorRepository } from '../../../../repositories/codex-v2/RdbAdministratorRepository'
import { RdbTeacherRepository } from '../../../../repositories/codex-v2/RdbTeacherRepository'
import { RdbTeacherOrganizationAffiliationRepository } from '../../../../repositories/codex-v2/RdbTeacherOrganizationAffiliationRepository'
import { RdbStudentGroupStudentAffiliationRepository } from '../../../../repositories/codex-v2/RdbStudentGroupStudentAffiliationRepository'
import { RdbStudentRepository } from '../../../../repositories/codex-v2/RdbStudentRepository'

export class StudentGroupPackageAssignmentResolver {
  getUseCase: GetStudentGroupPackageAssignmentsUseCase

  createUseCase: CreateStudentGroupPackageAssignmentUseCase

  deleteUseCase: DeleteStudentGroupPackageAssignmentUseCase

  constructor(private readonly appDataSource: DataSource) {
    const datetimeRepository = new SystemDateTimeRepository()
    const studentGroupPackageAssignmentRepository =
      new RdbStudentGroupPackageAssignmentRepository(this.appDataSource)
    const districtRepository = new RdbDistrictRepository(this.appDataSource)
    const curriculumPackageRepository =
      new HardCordedCurriculumPackageRepository()
    const organizationRepository = new RdbOrganizationRepository(
      this.appDataSource,
    )
    const studentGroupRepository = new RdbStudentGroupRepository(
      this.appDataSource,
    )
    const districtPurchasedPackageRepository =
      new RdbDistrictPurchasedPackageRepository(this.appDataSource)
    const administratorRepository = new RdbAdministratorRepository(
      this.appDataSource,
    )
    const teacherRepository = new RdbTeacherRepository(this.appDataSource)
    const teacherOrganizationAffiliationRepository =
      new RdbTeacherOrganizationAffiliationRepository(this.appDataSource)
    const studentStudentGroupAffiliationRepository =
      new RdbStudentGroupStudentAffiliationRepository(this.appDataSource)
    const studentRepository = new RdbStudentRepository(this.appDataSource)

    this.getUseCase = new GetStudentGroupPackageAssignmentsUseCase(
      studentGroupPackageAssignmentRepository,
      studentGroupRepository,
      organizationRepository,
      administratorRepository,
      teacherRepository,
      studentRepository,
      teacherOrganizationAffiliationRepository,
      studentStudentGroupAffiliationRepository,
    )
    this.createUseCase = new CreateStudentGroupPackageAssignmentUseCase(
      datetimeRepository,
      districtRepository,
      organizationRepository,
      studentGroupRepository,
      curriculumPackageRepository,
      districtPurchasedPackageRepository,
      studentGroupPackageAssignmentRepository,
    )
    this.deleteUseCase = new DeleteStudentGroupPackageAssignmentUseCase(
      studentGroupPackageAssignmentRepository,
    )
  }

  query: ResolverWithAuthenticatedUser<
    QueryStudentGroupPackageAssignmentsArgs,
    QueryResult<StudentGroupPackageAssignment>
  > = async (user, _parent, { studentGroupId }) => {
    const res = await this.getUseCase.run(user, studentGroupId ?? null)
    const data = valueOrThrowErr(res)

    return {
      items: data.map(this.transformToGraphqlSchema),
      count: data.length,
    }
  }

  create: ResolverWithAuthenticatedUser<
    MutationCreateStudentGroupPackageAssignmentArgs,
    CreateStudentGroupPackageAssignmentPayload
  > = async (user, _parent, { input }) => {
    const res = await this.createUseCase.run(user, input)

    return {
      studentGroupPackageAssignment: this.transformToGraphqlSchema(
        valueOrThrowErr(res),
      ),
      clientMutationId: input.clientMutationId,
    }
  }

  delete: ResolverWithAuthenticatedUser<
    MutationDeleteStudentGroupPackageAssignmentArgs,
    DeleteStudentGroupPackageAssignmentPayload
  > = async (user, _parent, { input }) => {
    const res = await this.deleteUseCase.run(user, input.id)

    valueOrThrowErr(res)

    return {
      id: input.id,
      clientMutationId: input.clientMutationId,
    }
  }

  private transformToGraphqlSchema = (
    domainEntity: DomainEntityStudentGroupPackageAssignment,
  ): StudentGroupPackageAssignment => {
    return {
      __typename: 'StudentGroupPackageAssignment',
      id: domainEntity.id,
      curriculumBrandId: domainEntity.curriculumBrandId,
      packageCategoryId: domainEntity.curriculumBrandId,
      curriculumPackageId: domainEntity.curriculumPackageId,
      studentGroupId: domainEntity.studentGroupId,
      createdAt: domainEntity.createdAt.toISOString(),
    }
  }
}
