import { DataSource } from 'typeorm'
import UpdateStudentUseCase from '../../../../../domain/usecases/codex-v2/student/UpdateStudentUseCase'
import CreateStudentUseCase from '../../../../../domain/usecases/codex-v2/student/CreateStudentUseCase'
import { RdbStudentRepository } from '../../../../repositories/codex-v2/RdbStudentRepository'
import SystemDateTimeRepository from '../../../../repositories/codex-v2/SystemDateTimeRepository'
import {
  Student,
  MutationCreateStudentArgs,
  CreateStudentPayload,
  MutationUpdateStudentArgs,
  UpdateStudentPayload,
  QueryStudentsArgs,
} from './_gen/resolvers-type'
import { Student as DomainEntityStudent } from '../../../../../domain/entities/codex-v2/Student'
import { valueOrThrowErr } from './utilities'
import { QueryResult, ResolverWithAuthenticatedUser } from '.'
import GetStudentsByStudentGroupIdUseCase from '../../../../../domain/usecases/codex-v2/student/GetStudentsByStudentGroupIdUseCase'
import { RdbStudentGroupStudentAffiliationRepository } from '../../../../repositories/codex-v2/RdbStudentGroupStudentAffiliationRepository'
import { RdbHumanUserRepository } from '../../../../repositories/codex-v2/RdbHumanUserRepository'
import { RdbUserRepository } from '../../../../repositories/codex-v2/RdbUserRepository'

type ResolverStudentResponse = Omit<Student, 'humanUser'>
export class StudentResolver {
  getUseCase: GetStudentsByStudentGroupIdUseCase

  updateUseCase: UpdateStudentUseCase

  createUseCase: CreateStudentUseCase

  constructor(private readonly appDataSource: DataSource) {
    const datetimeRepository = new SystemDateTimeRepository()
    const studentRepository = new RdbStudentRepository(this.appDataSource)
    const humanUserRepository = new RdbHumanUserRepository(this.appDataSource)
    const userRepository = new RdbUserRepository(this.appDataSource)
    const studentGroupStudentAffiliationRepository =
      new RdbStudentGroupStudentAffiliationRepository(this.appDataSource)

    this.getUseCase = new GetStudentsByStudentGroupIdUseCase(
      studentRepository,
      studentGroupStudentAffiliationRepository,
    )
    this.updateUseCase = new UpdateStudentUseCase(
      studentRepository,
      humanUserRepository,
      userRepository,
    )
    this.createUseCase = new CreateStudentUseCase(
      datetimeRepository,
      studentRepository,
      humanUserRepository,
      userRepository,
    )
  }

  query: ResolverWithAuthenticatedUser<
    QueryStudentsArgs,
    QueryResult<ResolverStudentResponse>
  > = async (user, _parent, { studentGroupId }) => {
    const res = await this.getUseCase.run(user, studentGroupId)
    const data = valueOrThrowErr(res)

    return {
      items: data.map(this.transformToGraphqlSchema),
      count: data.length,
    }
  }

  create: ResolverWithAuthenticatedUser<
    MutationCreateStudentArgs,
    Omit<CreateStudentPayload, 'student'> & { student: ResolverStudentResponse }
  > = async (user, _parent, { input }) => {
    const res = await this.createUseCase.run(user, {
      ...input,
      externalLmsStudentId: input.externalLmsStudentId ?? null,
      isDeactivated: input.isDeactivated ?? false,
    })

    return {
      student: this.transformToGraphqlSchema(valueOrThrowErr(res)),
      clientMutationId: input.clientMutationId,
    }
  }

  update: ResolverWithAuthenticatedUser<
    MutationUpdateStudentArgs,
    Omit<UpdateStudentPayload, 'student'> & { student: ResolverStudentResponse }
  > = async (user, _parent, { input }) => {
    const res = await this.updateUseCase.run(user, {
      ...input,
      externalLmsStudentId: input.externalLmsStudentId ?? null,
      isDeactivated: input.isDeactivated ?? false,
    })

    return {
      student: this.transformToGraphqlSchema(valueOrThrowErr(res)),
      clientMutationId: input.clientMutationId,
    }
  }

  private transformToGraphqlSchema = (
    domainEntity: DomainEntityStudent,
  ): ResolverStudentResponse => {
    return {
      __typename: 'Student',
      id: domainEntity.id,
      userId: domainEntity.userId,
      role: domainEntity.role,
      nickName: domainEntity.nickName,
      externalLmsStudentId: domainEntity.externalLmsStudentId ?? '',
      isDeactivated: domainEntity.isDeactivated,
      createdUserId: domainEntity.createdUserId,
      createdAt: domainEntity.createdAt.toISOString(),
    }
  }
}
