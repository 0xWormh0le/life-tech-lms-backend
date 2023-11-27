import { DataSource } from 'typeorm'
import GetTeacherOrganizationAffiliationsUseCase from '../../../../../domain/usecases/codex-v2/teacher-organization-affiliation/GetTeacherOrganizationAffiliationsUseCase'
import { RdbTeacherOrganizationAffiliationRepository } from '../../../../repositories/codex-v2/RdbTeacherOrganizationAffiliationRepository'
import {
  CreateTeacherOrganizationAffiliationPayload,
  DeleteTeacherOrganizationAffiliationPayload,
  MutationCreateTeacherOrganizationAffiliationArgs,
  MutationDeleteTeacherOrganizationAffiliationArgs,
  TeacherOrganizationAffiliation,
} from './_gen/resolvers-type'
import { TeacherOrganizationAffiliation as DomainEntityTeacherOrganizationAffiliation } from '../../../../../domain/entities/codex-v2/TeacherOrganizationAffiliation'
import { QueryResult, ResolverWithAuthenticatedUser } from '.'
import { valueOrThrowErr } from './utilities'
import CreateTeacherOrganizationAffiliationUseCase from '../../../../../domain/usecases/codex-v2/teacher-organization-affiliation/CreateTeacherOrganizationAffiliationUseCase'
import SystemDateTimeRepository from '../../../../repositories/codex-v2/SystemDateTimeRepository'
import { RdbOrganizationRepository } from '../../../../repositories/codex-v2/RdbOrganizationRepository'
import { RdbTeacherRepository } from '../../../../repositories/codex-v2/RdbTeacherRepository'
import DeleteTeacherOrganizationAffiliationUseCase from '../../../../../domain/usecases/codex-v2/teacher-organization-affiliation/DeleteTeacherOrganizationAffiliationUseCase'

export class TeacherOrganizationAffiliationResolver {
  getUseCase: GetTeacherOrganizationAffiliationsUseCase

  createUseCase: CreateTeacherOrganizationAffiliationUseCase

  deleteUseCase: DeleteTeacherOrganizationAffiliationUseCase

  constructor(private readonly appDataSource: DataSource) {
    const datetimeRepository = new SystemDateTimeRepository()
    const organizationRepository = new RdbOrganizationRepository(
      this.appDataSource,
    )
    const teacherOrganizationAffiliationRepository =
      new RdbTeacherOrganizationAffiliationRepository(this.appDataSource)
    const teacherRepository = new RdbTeacherRepository(this.appDataSource)

    this.getUseCase = new GetTeacherOrganizationAffiliationsUseCase(
      teacherOrganizationAffiliationRepository,
    )
    this.createUseCase = new CreateTeacherOrganizationAffiliationUseCase(
      teacherOrganizationAffiliationRepository,
      datetimeRepository,
      organizationRepository,
      teacherRepository,
    )
    this.deleteUseCase = new DeleteTeacherOrganizationAffiliationUseCase(
      teacherOrganizationAffiliationRepository,
    )
  }

  query: ResolverWithAuthenticatedUser<
    void,
    QueryResult<TeacherOrganizationAffiliation>
  > = async (user) => {
    const res = await this.getUseCase.run(user)
    const data = valueOrThrowErr(res)

    return {
      items: data.map(this.transformToGraphqlSchema),
      count: data.length,
    }
  }

  create: ResolverWithAuthenticatedUser<
    MutationCreateTeacherOrganizationAffiliationArgs,
    CreateTeacherOrganizationAffiliationPayload
  > = async (user, _parent, { input }) => {
    const res = await this.createUseCase.run(user, input)

    return {
      teacherOrganizationAffiliation: this.transformToGraphqlSchema(
        valueOrThrowErr(res),
      ),
      clientMutationId: input.clientMutationId,
    }
  }

  delete: ResolverWithAuthenticatedUser<
    MutationDeleteTeacherOrganizationAffiliationArgs,
    DeleteTeacherOrganizationAffiliationPayload
  > = async (
    user,
    _parent,
    { input },
  ): Promise<DeleteTeacherOrganizationAffiliationPayload> => {
    const res = await this.deleteUseCase.run(user, input.id)

    valueOrThrowErr(res)

    return {
      id: input.id,
      clientMutationId: input.clientMutationId,
    }
  }

  private transformToGraphqlSchema = (
    domainEntity: DomainEntityTeacherOrganizationAffiliation,
  ): TeacherOrganizationAffiliation => {
    return {
      __typename: 'TeacherOrganizationAffiliation',
      id: domainEntity.id,
      createdUserId: domainEntity.createdUserId,
      organizationId: domainEntity.organizationId,
      teacherId: domainEntity.teacherId,
      createdAt: domainEntity.createdAt.toISOString(),
    }
  }
}
