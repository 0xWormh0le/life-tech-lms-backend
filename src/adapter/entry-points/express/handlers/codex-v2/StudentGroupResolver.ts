import { DataSource } from 'typeorm'
import GetStudentGroupsUseCase from '../../../../../domain/usecases/codex-v2/student-group/GetStudentGroupsUseCase'
import UpdateStudentGroupUseCase from '../../../../../domain/usecases/codex-v2/student-group/UpdateStudentGroupUseCase'
import CreateStudentGroupUseCase from '../../../../../domain/usecases/codex-v2/student-group/CreateStudentGroupUseCase'
import { RdbStudentGroupRepository } from '../../../../repositories/codex-v2/RdbStudentGroupRepository'
import {
  CreateStudentGroupPayload,
  MutationCreateStudentGroupArgs,
  MutationUpdateStudentGroupArgs,
  QueryStudentGroupsArgs,
  StudentGroup,
  UpdateStudentGroupPayload,
} from './_gen/resolvers-type'
import { StudentGroup as DomainEntityStudentGroup } from '../../../../../domain/entities/codex-v2/StudentGroup'
import { QueryResult, ResolverWithAuthenticatedUser } from '.'
import { valueOrThrowErr } from './utilities'
import SystemDateTimeRepository from '../../../../repositories/codex-v2/SystemDateTimeRepository'
import { RdbOrganizationRepository } from '../../../../repositories/codex-v2/RdbOrganizationRepository'
import GetStudentGroupsByOrganizationIdUseCase from '../../../../../domain/usecases/codex-v2/student-group/GetStudentGroupsByOrganizationIdUseCase'
import { RdbAdministratorRepository } from '../../../../repositories/codex-v2/RdbAdministratorRepository'
import { RdbTeacherRepository } from '../../../../repositories/codex-v2/RdbTeacherRepository'
import { RdbTeacherOrganizationAffiliationRepository } from '../../../../repositories/codex-v2/RdbTeacherOrganizationAffiliationRepository'
import { RdbStudentGroupStudentAffiliationRepository } from '../../../../repositories/codex-v2/RdbStudentGroupStudentAffiliationRepository'
import { RdbStudentRepository } from '../../../../repositories/codex-v2/RdbStudentRepository'

type ResolverStudentGroupResponse = Omit<
  StudentGroup,
  'studentGroupPurchasedPackages' | 'administrators' | 'students'
>

export class StudentGroupResolver {
  getUseCase: GetStudentGroupsUseCase

  getByOrganizationUseCase: GetStudentGroupsByOrganizationIdUseCase

  updateUseCase: UpdateStudentGroupUseCase

  createUseCase: CreateStudentGroupUseCase

  constructor(private readonly appDataSource: DataSource) {
    const datetimeRepository = new SystemDateTimeRepository()
    const organizationRepository = new RdbOrganizationRepository(
      this.appDataSource,
    )
    const studentGroupRepository = new RdbStudentGroupRepository(
      this.appDataSource,
    )
    const administratorRepository = new RdbAdministratorRepository(
      this.appDataSource,
    )
    const teacherRepository = new RdbTeacherRepository(this.appDataSource)
    const studentRepository = new RdbStudentRepository(this.appDataSource)
    const teacherOrganizationAffiliationRepository =
      new RdbTeacherOrganizationAffiliationRepository(this.appDataSource)
    const studentStudentGroupAffiliationRepository =
      new RdbStudentGroupStudentAffiliationRepository(this.appDataSource)

    this.getUseCase = new GetStudentGroupsUseCase(studentGroupRepository)
    this.getByOrganizationUseCase = new GetStudentGroupsByOrganizationIdUseCase(
      studentGroupRepository,
      organizationRepository,
      administratorRepository,
      teacherRepository,
      studentRepository,
      teacherOrganizationAffiliationRepository,
      studentStudentGroupAffiliationRepository,
    )
    this.createUseCase = new CreateStudentGroupUseCase(
      datetimeRepository,
      organizationRepository,
      studentGroupRepository,
    )
    this.updateUseCase = new UpdateStudentGroupUseCase(
      datetimeRepository,
      organizationRepository,
      studentGroupRepository,
    )
  }

  query: ResolverWithAuthenticatedUser<
    QueryStudentGroupsArgs,
    QueryResult<ResolverStudentGroupResponse>
  > = async (user, _parent, { organizationId }) => {
    const res = organizationId
      ? await this.getByOrganizationUseCase.run(user, organizationId)
      : await this.getUseCase.run(user)
    const data = valueOrThrowErr(res)

    return {
      items: data.map(this.transformToGraphqlSchema),
      count: data.length,
    }
  }

  create: ResolverWithAuthenticatedUser<
    MutationCreateStudentGroupArgs,
    CreateStudentGroupPayload
  > = async (user, _parent, { input }) => {
    const res = await this.createUseCase.run(user, {
      ...input,
      classlinkTenantId: input.classlinkTenantId ?? null,
      externalLmsStudentGroupId: input.externalLmsStudentGroupId ?? null,
      grade: input.grade ?? null,
    })

    return {
      studentGroup: this.transformToGraphqlSchema(valueOrThrowErr(res)),
      clientMutationId: input.clientMutationId,
    }
  }

  update: ResolverWithAuthenticatedUser<
    MutationUpdateStudentGroupArgs,
    UpdateStudentGroupPayload
  > = async (user, _parent, { input }) => {
    const res = await this.updateUseCase.run(user, {
      ...input,
      classlinkTenantId: input.classlinkTenantId ?? null,
      externalLmsStudentGroupId: input.externalLmsStudentGroupId ?? null,
      grade: input.grade ?? null,
    })

    return {
      studentGroup: this.transformToGraphqlSchema(valueOrThrowErr(res)),
      clientMutationId: input.clientMutationId,
    }
  }

  private transformToGraphqlSchema = (
    domainEntity: DomainEntityStudentGroup,
  ): ResolverStudentGroupResponse => {
    return {
      __typename: 'StudentGroup',
      id: domainEntity.id,
      name: domainEntity.name,
      grade: domainEntity.grade,
      externalLmsStudentGroupId: domainEntity.externalLmsStudentGroupId,
      createdUserId: domainEntity.createdUserId,
      updatedUserId: domainEntity.updatedUserId,
      createdAt: domainEntity.createdAt.toISOString(),
      updatedAt: domainEntity.updatedAt.toISOString(),
      organizationId: domainEntity.organizationId,
      classlinkTenantId: domainEntity.classlinkTenantId,
    }
  }
}
