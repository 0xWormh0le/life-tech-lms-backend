import { DataSource } from 'typeorm'
import GetStudentStudentGroupAffiliationsByStudentGroupIdUseCase from '../../../../../domain/usecases/codex-v2/student-student-group-affiliation/GetStudentStudentGroupAffiliationsByStudentGroupIdUseCase'
import { RdbStudentGroupStudentAffiliationRepository } from '../../../../repositories/codex-v2/RdbStudentGroupStudentAffiliationRepository'
import {
  CreateStudentStudentGroupAffiliationPayload,
  DeleteStudentStudentGroupAffiliationPayload,
  MutationCreateStudentStudentGroupAffiliationArgs,
  MutationDeleteStudentStudentGroupAffiliationArgs,
  QueryStudentStudentGroupAffiliationsArgs,
  StudentStudentGroupAffiliation,
} from './_gen/resolvers-type'
import { StudentStudentGroupAffiliation as DomainEntityStudentStudentGroupAffiliation } from '../../../../../domain/entities/codex-v2/StudentStudentGroupAffiliation'
import { QueryResult, ResolverWithAuthenticatedUser } from '.'
import { valueOrThrowErr } from './utilities'
import CreateStudentStudentGroupAffiliationUseCase from '../../../../../domain/usecases/codex-v2/student-student-group-affiliation/CreateStudentStudentGroupAffiliationUseCase'
import SystemDateTimeRepository from '../../../../repositories/codex-v2/SystemDateTimeRepository'
import { RdbStudentGroupRepository } from '../../../../repositories/codex-v2/RdbStudentGroupRepository'
import { RdbStudentRepository } from '../../../../repositories/codex-v2/RdbStudentRepository'
import DeleteStudentStudentGroupAffiliationUseCase from '../../../../../domain/usecases/codex-v2/student-student-group-affiliation/DeleteStudentStudentGroupAffiliationUseCase'

export class StudentGroupStudentAffiliationResolver {
  getUseCase: GetStudentStudentGroupAffiliationsByStudentGroupIdUseCase

  createUseCase: CreateStudentStudentGroupAffiliationUseCase

  deleteUseCase: DeleteStudentStudentGroupAffiliationUseCase

  constructor(private readonly appDataSource: DataSource) {
    const datetimeRepository = new SystemDateTimeRepository()
    const studentGroupRepository = new RdbStudentGroupRepository(
      this.appDataSource,
    )
    const studentStudentGroupAffiliationRepository =
      new RdbStudentGroupStudentAffiliationRepository(this.appDataSource)
    const studentRepository = new RdbStudentRepository(this.appDataSource)

    this.getUseCase =
      new GetStudentStudentGroupAffiliationsByStudentGroupIdUseCase(
        studentStudentGroupAffiliationRepository,
      )
    this.createUseCase = new CreateStudentStudentGroupAffiliationUseCase(
      studentStudentGroupAffiliationRepository,
      datetimeRepository,
      studentGroupRepository,
      studentRepository,
    )
    this.deleteUseCase = new DeleteStudentStudentGroupAffiliationUseCase(
      studentStudentGroupAffiliationRepository,
    )
  }

  query: ResolverWithAuthenticatedUser<
    QueryStudentStudentGroupAffiliationsArgs,
    QueryResult<StudentStudentGroupAffiliation>
  > = async (user, _parent, { studentGroupId }) => {
    const res = await this.getUseCase.run(user, studentGroupId)
    const data = valueOrThrowErr(res)

    return {
      items: data.map(this.transformToGraphqlSchema),
      count: data.length,
    }
  }

  create: ResolverWithAuthenticatedUser<
    MutationCreateStudentStudentGroupAffiliationArgs,
    CreateStudentStudentGroupAffiliationPayload
  > = async (user, _parent, { input }) => {
    const res = await this.createUseCase.run(user, input)

    return {
      studentStudentGroupAffiliation: this.transformToGraphqlSchema(
        valueOrThrowErr(res),
      ),
      clientMutationId: input.clientMutationId,
    }
  }

  delete: ResolverWithAuthenticatedUser<
    MutationDeleteStudentStudentGroupAffiliationArgs,
    DeleteStudentStudentGroupAffiliationPayload
  > = async (
    user,
    _parent,
    { input },
  ): Promise<DeleteStudentStudentGroupAffiliationPayload> => {
    const res = await this.deleteUseCase.run(user, input.id)

    valueOrThrowErr(res)

    return {
      id: input.id,
      clientMutationId: input.clientMutationId,
    }
  }

  private transformToGraphqlSchema = (
    domainEntity: DomainEntityStudentStudentGroupAffiliation,
  ): StudentStudentGroupAffiliation => {
    return {
      __typename: 'StudentStudentGroupAffiliation',
      id: domainEntity.id,
      studentId: domainEntity.studentId,
      studentGroupId: domainEntity.studentGroupId,
      createdUserId: domainEntity.createdUserId,
      createdAt: domainEntity.createdAt.toISOString(),
    }
  }
}
