import { DataSource } from 'typeorm'
import GetTeachersUseCase from '../../../../../domain/usecases/codex-v2/teacher/GetTeachersUseCase'
import UpdateTeacherUseCase from '../../../../../domain/usecases/codex-v2/teacher/UpdateTeacherUseCase'
import CreateTeacherUseCase from '../../../../../domain/usecases/codex-v2/teacher/CreateTeacherUseCase'
import { RdbTeacherRepository } from '../../../../repositories/codex-v2/RdbTeacherRepository'
import SystemDateTimeRepository from '../../../../repositories/codex-v2/SystemDateTimeRepository'
import {
  CreateTeacherPayload,
  UpdateTeacherPayload,
  MutationCreateTeacherArgs,
  MutationUpdateTeacherArgs,
  Teacher,
} from './_gen/resolvers-type'
import { Teacher as DomainEntityTeacher } from '../../../../../domain/entities/codex-v2/Teacher'
import { QueryResult, ResolverWithAuthenticatedUser } from '.'
import { valueOrThrowErr } from './utilities'
import { RdbHumanUserRepository } from '../../../../repositories/codex-v2/RdbHumanUserRepository'
import { RdbUserRepository } from '../../../../repositories/codex-v2/RdbUserRepository'

type ResolverTeacherResponse = Omit<Teacher, 'humanUser'>

export class TeacherResolver {
  getUseCase: GetTeachersUseCase

  createUseCase: CreateTeacherUseCase

  updateUseCase: UpdateTeacherUseCase

  constructor(private readonly appDataSource: DataSource) {
    const teacherRepository = new RdbTeacherRepository(this.appDataSource)
    const humanUserRepository = new RdbHumanUserRepository(this.appDataSource)
    const userRepository = new RdbUserRepository(this.appDataSource)
    const datetimeRepository = new SystemDateTimeRepository()

    this.getUseCase = new GetTeachersUseCase(teacherRepository)
    this.updateUseCase = new UpdateTeacherUseCase(
      teacherRepository,
      humanUserRepository,
      userRepository,
    )
    this.createUseCase = new CreateTeacherUseCase(
      datetimeRepository,
      teacherRepository,
      humanUserRepository,
      userRepository,
    )
  }

  query: ResolverWithAuthenticatedUser<
    void,
    QueryResult<ResolverTeacherResponse>
  > = async (user) => {
    const res = await this.getUseCase.run(user)
    const data = valueOrThrowErr(res)

    return {
      items: data.map(this.transformToGraphqlSchema),
      count: data.length,
    }
  }

  create: ResolverWithAuthenticatedUser<
    MutationCreateTeacherArgs,
    Omit<CreateTeacherPayload, 'teacher'> & { teacher: ResolverTeacherResponse }
  > = async (user, _parent, { input }) => {
    const res = await this.createUseCase.run(user, {
      ...input,
      externalLmsTeacherId: input.externalLmsTeacherId ?? null,
    })

    return {
      teacher: this.transformToGraphqlSchema(valueOrThrowErr(res)),
      clientMutationId: input.clientMutationId,
    }
  }

  update: ResolverWithAuthenticatedUser<
    MutationUpdateTeacherArgs,
    Omit<UpdateTeacherPayload, 'teacher'> & { teacher: ResolverTeacherResponse }
  > = async (user, _parent, { input }) => {
    const res = await this.updateUseCase.run(user, {
      ...input,
      externalLmsTeacherId: input.externalLmsTeacherId ?? null,
    })

    return {
      teacher: this.transformToGraphqlSchema(valueOrThrowErr(res)),
      clientMutationId: input.clientMutationId,
    }
  }

  private transformToGraphqlSchema = (
    domainEntity: DomainEntityTeacher,
  ): ResolverTeacherResponse => {
    return {
      __typename: 'Teacher',
      id: domainEntity.id,
      createdUserId: domainEntity.createdUserId ?? '',
      externalLmsTeacherId: domainEntity.externalLmsTeacherId,
      firstName: domainEntity.firstName,
      isDeactivated: domainEntity.isDeactivated,
      lastName: domainEntity.lastName,
      role: domainEntity.role,
      userId: domainEntity.userId,
      createdAt: domainEntity.createdAt.toISOString(),
    }
  }
}
