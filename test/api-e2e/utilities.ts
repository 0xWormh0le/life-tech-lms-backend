import axios, { AxiosError } from 'axios'
import { DataSource } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { TypeormEntities } from '../../src/adapter/typeorm/data-source'
import { UserRepository } from '../../src/adapter/repositories/UserRepository'
import { UserRole } from '../../src/domain/entities/codex/User'
import { UserRoles } from '../../src/domain/usecases/shared/Constants'
import { Administrator } from '../../src/domain/entities/codex-v2/Administrator'
import { District } from '../../src/domain/entities/codex-v2/District'
import { Organization } from '../../src/domain/entities/codex-v2/Organization'
import { StudentGroup } from '../../src/domain/entities/codex-v2/StudentGroup'
import { Student } from '../../src/domain/entities/codex-v2/Student'
import { Teacher } from '../../src/domain/entities/codex-v2/Teacher'
import { User } from '../../src/domain/entities/codex-v2/User'
import { HumanUser } from '../../src/domain/entities/codex-v2/HumanUser'

import { InternalOperator } from '../../src/domain/entities/codex-v2/InternalOperator'
import CreateDistrictUseCase from '../../src/domain/usecases/codex-v2/district/CreateDistrictUseCase'
import SystemDateTimeRepository from '../../src/adapter/repositories/codex-v2/SystemDateTimeRepository'
import { RdbDistrictRepository } from '../../src/adapter/repositories/codex-v2/RdbDistrictRepository'
import CreateOrganizationUseCase from '../../src/domain/usecases/codex-v2/organization/CreateOrganizationUseCase'
import { RdbOrganizationRepository } from '../../src/adapter/repositories/codex-v2/RdbOrganizationRepository'
import CreateStudentGroupUseCase from '../../src/domain/usecases/codex-v2/student-group/CreateStudentGroupUseCase'
import { RdbStudentGroupRepository } from '../../src/adapter/repositories/codex-v2/RdbStudentGroupRepository'
import CreateUserUseCase from '../../src/domain/usecases/codex-v2/user/CreateUserUseCase'
import { RdbUserRepository } from '../../src/adapter/repositories/codex-v2/RdbUserRepository'
import CreateHumanUserUseCase from '../../src/domain/usecases/codex-v2/human-user/CreateHumanUserUseCase'
import { RdbHumanUserRepository } from '../../src/adapter/repositories/codex-v2/RdbHumanUserRepository'
import CreateAdministratorUseCase from '../../src/domain/usecases/codex-v2/administrator/CreateAdministratorUseCase'
import { RdbAdministratorRepository } from '../../src/adapter/repositories/codex-v2/RdbAdministratorRepository'
import CreateTeacherUseCase from '../../src/domain/usecases/codex-v2/teacher/CreateTeacherUseCase'
import { RdbTeacherRepository } from '../../src/adapter/repositories/codex-v2/RdbTeacherRepository'
import CreateTeacherOrganizationAffiliationUseCase from '../../src/domain/usecases/codex-v2/teacher-organization-affiliation/CreateTeacherOrganizationAffiliationUseCase'
import { RdbTeacherOrganizationAffiliationRepository } from '../../src/adapter/repositories/codex-v2/RdbTeacherOrganizationAffiliationRepository'
import CreateStudentUseCase from '../../src/domain/usecases/codex-v2/student/CreateStudentUseCase'
import { RdbStudentRepository } from '../../src/adapter/repositories/codex-v2/RdbStudentRepository'
import CreateStudentStudentGroupAffiliationUseCase from '../../src/domain/usecases/codex-v2/student-student-group-affiliation/CreateStudentStudentGroupAffiliationUseCase'
import { RdbStudentGroupStudentAffiliationRepository } from '../../src/adapter/repositories/codex-v2/RdbStudentGroupStudentAffiliationRepository'

export type GraphQLResponse<TData> = {
  data: TData
  errors: { message: string }[]
}

export let appDataSource: DataSource | undefined = undefined

export const setupEnvironment = async () => {
  // Clear database
  appDataSource = new DataSource({
    // These are the same as the values defined in env/api-e2d-test/docker-compose.yaml
    type: 'postgres',
    host: 'localhost',
    port: 15431,
    username: 'codex',
    password: 'codex',
    database: 'codex',
    synchronize: true,
    // logging: true,
    entities: TypeormEntities,
    subscribers: [],
    dropSchema: true, // remove all data instead of clear each entity data
  })
  await appDataSource.initialize()

  axios.defaults.baseURL = 'http://localhost:13000'
  axios.defaults.headers.common['Content-Type'] = 'application/json'
  axios.defaults.headers.common['accept'] = 'application/json'
  axios.defaults.headers.common['access-control-allow-origin'] = '*'
  axios.interceptors.request.use((request) => {
    return request
  })

  axios.interceptors.response.use(
    (response) => {
      return response
    },
    (error: AxiosError) => {
      return error.response
    },
  )
}

export const teardownEnvironment = async () => {
  await appDataSource?.destroy()
}

export const createUserAndGetToken = async (
  loginId: string,
  role: 'internal_operator' | 'administrator' | 'teacher' | 'student',
  appDataSource: DataSource,
): Promise<{ token: string; userId: string }> => {
  const { userId } = await createUser(loginId, role, appDataSource)

  const userRepo = new UserRepository(appDataSource)

  const resTokenResult = await userRepo.getUserWithTokenByAuthenticationInfo({
    loginId: loginId,
    password: loginId,
  })

  if (!resTokenResult.value) {
    throw new Error('tokenResult.value undefined')
  }

  const token = resTokenResult.value.accessToken

  return {
    token,
    userId,
  }
}

export const createUser = async (
  loginId: string,
  role: 'internal_operator' | 'administrator' | 'teacher' | 'student',
  appDataSource: DataSource,
): Promise<{ userId: string }> => {
  const userRepo = new UserRepository(appDataSource)

  const convertUserRole = (
    roleStr: 'internal_operator' | 'administrator' | 'teacher' | 'student',
  ): UserRole => {
    switch (roleStr) {
      case 'internal_operator':
        return UserRoles.internalOperator
      case 'administrator':
        return UserRoles.administrator
      case 'teacher':
        return UserRoles.teacher
      case 'student':
        return UserRoles.student
    }
  }
  const userId = uuid()
  const resCreateUser = await userRepo.createUsers([
    {
      id: userId,
      loginId: loginId,
      password: loginId,
      role: convertUserRole(role),
    },
  ])

  if (resCreateUser.hasError) {
    throw new Error(resCreateUser.error.message)
  }

  return { userId: userId }
}

export type GraphQlUser = { token: string | null }

const createAuthenticatedInternalOperator = async (): Promise<User> => {
  return {
    id: 'internalOperator',
    role: 'internalOperator',
    isDemo: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export const createDistrict = async (
  dataSource: DataSource,
  input?: District,
): Promise<District> => {
  const useCase = new CreateDistrictUseCase(
    new RdbDistrictRepository(dataSource),
    new SystemDateTimeRepository(),
  )
  const res = await useCase.run(await createAuthenticatedInternalOperator(), {
    name: uuid(),
    stateId: 'AL',
    lmsId: null,
    externalLmsDistrictId: null,
    enableRosterSync: false,
    ...input,
  })

  if (res.hasError) {
    throw res.error
  }

  return res.value
}

export const createOrganization = async (
  district: District,
  dataSource: DataSource,
  input?: Organization,
): Promise<Organization> => {
  const useCase = new CreateOrganizationUseCase(
    new SystemDateTimeRepository(),
    new RdbDistrictRepository(dataSource),
    new RdbOrganizationRepository(dataSource),
  )
  const res = await useCase.run(await createAuthenticatedInternalOperator(), {
    name: uuid(),
    districtId: district.id,
    externalLmsOrganizationId: null,
    classlinkTenantId: null,
    ...input,
  })

  if (res.hasError) {
    throw res.error
  }

  return res.value
}

export const createStudentGroup = async (
  organization: Organization,
  dataSource: DataSource,
  input?: StudentGroup,
): Promise<StudentGroup> => {
  const useCase = new CreateStudentGroupUseCase(
    new SystemDateTimeRepository(),
    new RdbOrganizationRepository(dataSource),
    new RdbStudentGroupRepository(dataSource),
  )
  const res = await useCase.run(await createAuthenticatedInternalOperator(), {
    name: uuid(),
    grade: null,
    externalLmsStudentGroupId: null,
    organizationId: organization.id,
    classlinkTenantId: null,
    ...input,
  })

  if (res.hasError) {
    throw res.error
  }

  return res.value
}

export const createInternalOperator = async (
  dataSource: DataSource,
  input?: {
    isDemo: boolean
    userId: string
    loginId: string | null
    email: string | null
    plainPassword: string | null
  },
): Promise<InternalOperator & GraphQlUser> => {
  const { user, token } = await createUserAndHumanUserAndToken(dataSource, {
    role: 'internalOperator',
    isDemo: false,
    ...input,
  })

  return {
    id: user.id,
    userId: user.id,
    role: 'internalOperator',
    token: token,
  }
}

export const createUserAndHumanUserAndToken = async (
  dataSource: DataSource,
  input: {
    role: User['role']
    isDemo: boolean
  },
): Promise<{ user: User; humanUser: HumanUser; token: string }> => {
  const authenticatedUser = await createAuthenticatedInternalOperator()
  const useCaseCreateUser = new CreateUserUseCase(
    new RdbUserRepository(dataSource),
    new SystemDateTimeRepository(),
  )
  const res = await useCaseCreateUser.run(authenticatedUser, {
    ...input,
  })

  if (res.hasError) {
    throw res.error
  }

  const user = res.value
  const useCaseHumanUser = new CreateHumanUserUseCase(
    new SystemDateTimeRepository(),
    new RdbUserRepository(dataSource),
    new RdbHumanUserRepository(dataSource),
  )
  const loginId = uuid()
  const resHumanUser = await useCaseHumanUser.run(authenticatedUser, {
    userId: user.id,
    loginId: loginId,
    email: null,
    plainPassword: loginId,
    ...input,
  })

  if (resHumanUser.hasError) {
    throw resHumanUser.error
  }

  const humanUser = resHumanUser.value
  const userRepo = new UserRepository(dataSource)

  const resTokenResult = await userRepo.getUserWithTokenByAuthenticationInfo({
    loginId: loginId,
    password: loginId,
  })

  if (resTokenResult.hasError) {
    throw resTokenResult.error
  } else if (!resTokenResult.value) {
    throw new Error(`token result is empty. userId: ${user.id}`)
  }

  return {
    user,
    humanUser,
    token: resTokenResult.value.accessToken,
  }
}

export const createAdministrator = async (
  district: District,
  dataSource: DataSource,
  input?: {
    isDemo: boolean
    userId: string
    loginId: string | null
    email: string | null
    plainPassword: string | null
  },
): Promise<Administrator & GraphQlUser> => {
  const { user, token } = await createUserAndHumanUserAndToken(dataSource, {
    role: 'administrator',
    isDemo: false,
    ...input,
  })

  const useCaseCreateAdministrator = new CreateAdministratorUseCase(
    new SystemDateTimeRepository(),
    new RdbUserRepository(dataSource),
    new RdbHumanUserRepository(dataSource),
    new RdbDistrictRepository(dataSource),
    new RdbAdministratorRepository(dataSource),
  )
  const authenticatedUser = await createAuthenticatedInternalOperator()
  const resAdmin = await useCaseCreateAdministrator.run(authenticatedUser, {
    userId: user.id,
    districtId: district.id,
    firstName: user.id,
    lastName: user.id,
    externalLmsAdministratorId: null,
    isDeactivated: false,
  })

  if (resAdmin.hasError) {
    throw resAdmin.error
  }

  return {
    ...resAdmin.value,
    token: token,
  }
}

export const createTeacher = async (
  organization: Organization,
  dataSource: DataSource,
  input?: {
    isDemo: boolean
  },
): Promise<Teacher & GraphQlUser> => {
  const { user, token } = await createUserAndHumanUserAndToken(dataSource, {
    role: 'teacher',
    isDemo: false,
    ...input,
  })
  const useCase = new CreateTeacherUseCase(
    new SystemDateTimeRepository(),
    new RdbTeacherRepository(dataSource),
    new RdbHumanUserRepository(dataSource),
    new RdbUserRepository(dataSource),
  )
  const authenticatedUser = await createAuthenticatedInternalOperator()
  const res = await useCase.run(authenticatedUser, {
    userId: user.id,
    firstName: user.id,
    lastName: user.id,
    externalLmsTeacherId: null,
    isDeactivated: false,
  })

  if (res.hasError) {
    throw res.error
  }

  const teacher = res.value
  const createTeacherOrganizationAffiliationUseCase =
    new CreateTeacherOrganizationAffiliationUseCase(
      new RdbTeacherOrganizationAffiliationRepository(dataSource),
      new SystemDateTimeRepository(),
      new RdbOrganizationRepository(dataSource),
      new RdbTeacherRepository(dataSource),
    )
  const resAffiliation = await createTeacherOrganizationAffiliationUseCase.run(
    authenticatedUser,
    {
      organizationId: organization.id,
      teacherId: teacher.id,
    },
  )

  if (resAffiliation.hasError) {
    throw resAffiliation.error
  }

  return {
    ...teacher,
    token: token,
  }
}

export const createStudent = async (
  studentGroup: StudentGroup,
  dataSource: DataSource,
  input?: { isDemo: boolean },
): Promise<Student & GraphQlUser> => {
  const { user, token } = await createUserAndHumanUserAndToken(dataSource, {
    role: 'student',
    isDemo: false,
    ...input,
  })
  const useCase = new CreateStudentUseCase(
    new SystemDateTimeRepository(),
    new RdbStudentRepository(dataSource),
    new RdbHumanUserRepository(dataSource),
    new RdbUserRepository(dataSource),
  )
  const authenticatedUser = await createAuthenticatedInternalOperator()
  const res = await useCase.run(authenticatedUser, {
    userId: user.id,
    nickName: user.id,
    externalLmsStudentId: null,
    isDeactivated: false,
  })

  if (res.hasError) {
    throw res.error
  }

  const student = res.value
  const useCaseAffiliation = new CreateStudentStudentGroupAffiliationUseCase(
    new RdbStudentGroupStudentAffiliationRepository(dataSource),
    new SystemDateTimeRepository(),
    new RdbStudentGroupRepository(dataSource),
    new RdbStudentRepository(dataSource),
  )
  const resAffiliation = await useCaseAffiliation.run(authenticatedUser, {
    studentGroupId: studentGroup.id,
    studentId: student.id,
  })

  if (resAffiliation.hasError) {
    throw resAffiliation.error
  }

  return {
    ...student,
    token: token,
  }
}

export type TestTargetData = {
  district0: District
  district1: District
  district0Organization0: Organization
  district0Organization1: Organization
  district1Organization1: Organization
  district0Organization0StudentGroup0: StudentGroup
  district0Organization0StudentGroup1: StudentGroup
  district0Organization1StudentGroup1: StudentGroup
  district1Organization1StudentGroup1: StudentGroup

  users: TestTargetUsers
}

export type TestTargetUsers = {
  anonymous: GraphQlUser
  invalid: GraphQlUser
  district0Organization0StudentGroup0Student0: Student & GraphQlUser
  district0Organization0StudentGroup0Student1: Student & GraphQlUser
  district0Organization0StudentGroup1Student1: Student & GraphQlUser
  district0Organization1StudentGroup1Student1: Student & GraphQlUser
  district1Organization1StudentGroup1Student1: Student & GraphQlUser
  district0Organization0Teacher0: Teacher & GraphQlUser
  district0Organization0Teacher1: Teacher & GraphQlUser
  district0Organization1Teacher1: Teacher & GraphQlUser
  district1Organization1Teacher1: Teacher & GraphQlUser
  district0Administrator0: Administrator & GraphQlUser
  district0Administrator1: Administrator & GraphQlUser
  district1Administrator1: Administrator & GraphQlUser
  internalOperator0: InternalOperator & GraphQlUser
  internalOperator1: InternalOperator & GraphQlUser
}

export const createAllTestTargetData = async (): Promise<TestTargetData> => {
  if (!appDataSource) {
    throw new Error(`appDataSource is null`)
  }

  const dataSource = appDataSource
  const district0: District = await createDistrict(dataSource)
  const district1: District = await createDistrict(dataSource)
  const district0Organization0: Organization = await createOrganization(
    district0,
    dataSource,
  )
  const district0Organization1: Organization = await createOrganization(
    district0,
    dataSource,
  )
  const district1Organization1: Organization = await createOrganization(
    district1,
    dataSource,
  )
  const district0Organization0StudentGroup0: StudentGroup =
    await createStudentGroup(district0Organization0, dataSource)
  const district0Organization0StudentGroup1: StudentGroup =
    await createStudentGroup(district0Organization0, dataSource)
  const district0Organization1StudentGroup1: StudentGroup =
    await createStudentGroup(district0Organization1, dataSource)
  const district1Organization1StudentGroup1: StudentGroup =
    await createStudentGroup(district1Organization1, dataSource)
  const anonymous: GraphQlUser = { token: null }
  const invalid: GraphQlUser = { token: 'invalid_token' }
  const district0Organization0StudentGroup0Student0: Student & GraphQlUser =
    await createStudent(district0Organization0StudentGroup0, dataSource)
  const district0Organization0StudentGroup0Student1: Student & GraphQlUser =
    await createStudent(district0Organization0StudentGroup0, dataSource)
  const district0Organization0StudentGroup1Student1: Student & GraphQlUser =
    await createStudent(district0Organization0StudentGroup1, dataSource)
  const district0Organization1StudentGroup1Student1: Student & GraphQlUser =
    await createStudent(district0Organization1StudentGroup1, dataSource)
  const district1Organization1StudentGroup1Student1: Student & GraphQlUser =
    await createStudent(district1Organization1StudentGroup1, dataSource)
  const district0Organization0Teacher0: Teacher & GraphQlUser =
    await createTeacher(district0Organization0, dataSource)
  const district0Organization0Teacher1: Teacher & GraphQlUser =
    await createTeacher(district0Organization0, dataSource)
  const district0Organization1Teacher1: Teacher & GraphQlUser =
    await createTeacher(district0Organization1, dataSource)
  const district1Organization1Teacher1: Teacher & GraphQlUser =
    await createTeacher(district1Organization1, dataSource)
  const district0Administrator0: Administrator & GraphQlUser =
    await createAdministrator(district0, dataSource)
  const district0Administrator1: Administrator & GraphQlUser =
    await createAdministrator(district0, dataSource)
  const district1Administrator1: Administrator & GraphQlUser =
    await createAdministrator(district1, dataSource)
  const internalOperator0: InternalOperator & GraphQlUser =
    await createInternalOperator(dataSource)
  const internalOperator1: InternalOperator & GraphQlUser =
    await createInternalOperator(dataSource)

  return {
    district0,
    district1,
    district0Organization0,
    district0Organization1,
    district1Organization1,
    district0Organization0StudentGroup0,
    district0Organization0StudentGroup1,
    district0Organization1StudentGroup1,
    district1Organization1StudentGroup1,
    users: {
      anonymous,
      invalid,
      district0Organization0StudentGroup0Student0,
      district0Organization0StudentGroup0Student1,
      district0Organization0StudentGroup1Student1,
      district0Organization1StudentGroup1Student1,
      district1Organization1StudentGroup1Student1,
      district0Organization0Teacher0,
      district0Organization0Teacher1,
      district0Organization1Teacher1,
      district1Organization1Teacher1,
      district0Administrator0,
      district0Administrator1,
      district1Administrator1,
      internalOperator0,
      internalOperator1,
    },
  }
}
