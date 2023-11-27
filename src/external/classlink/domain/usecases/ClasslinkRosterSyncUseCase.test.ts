import { E, Errorable, successErrorable } from '../../../../domain/usecases/shared/Errors'
import { ClasslinkClass } from '../entities/ClasslinkClass'
import { ClasslinkDistrict } from '../entities/ClasslinkDistrict'
import { ClasslinkDistrictAdministrator } from '../entities/ClasslinkDistrictAdministrator'
import { ClasslinkSchool } from '../entities/ClasslinkSchool'
import { ClasslinkSchoolAdministrator } from '../entities/ClasslinkSchoolAdministrator'
import { ClasslinkStudent } from '../entities/ClasslinkStudent'
import { ClasslinkTeacher } from '../entities/ClasslinkTeacher'
import { Administrator } from '../../../_shared/roster-sync/domain/entities/Administrator'
import { Teacher } from '../../../_shared/roster-sync/domain/entities/Teacher'
import { Student } from '../../../_shared/roster-sync/domain/entities/Student'
import { District } from '../../../_shared/roster-sync/domain/entities/District'
import { Organization } from '../../../_shared/roster-sync/domain/entities/Organization'
import { StudentGroup } from '../../../_shared/roster-sync/domain/entities/StudentGroup'
import { AdministratorDistrict } from '../../../_shared/roster-sync/domain/entities/AdministratorDistrict'
import { TeacherOrganization } from '../../../_shared/roster-sync/domain/entities/TeacherOrganization'
import { StudentGroupStudent } from '../../../_shared/roster-sync/domain/entities/StudentGroupStudent'
import { DistrictRosterSyncStatus } from '../../../../domain/entities/codex/DistrictRosterSyncStatus'
import { StudentStudentGroup } from '../../../../domain/entities/codex/StudentStudentGroup'
import { User } from '../../../_shared/roster-sync/domain/entities/User'
import {
  IClasslinkClassRepository,
  IClasslinkDistrictRepository,
  IClasslinkDistrictAdministratorRepository,
  IClasslinkSchoolAdministratorRepository,
  IClasslinkSchoolRepository,
  IClasslinkStudentRepository,
  IClasslinkTeacherRepository,
  RequestClasslinkApisAndMapToSourceLmsEntites,
  ClasslinkRosterSyncUseCase,
} from './ClasslinkRosterSyncUseCase'
import {
  IDistrictRepository,
  IDistrictRosterSyncStatusRepository,
  IOrganizationRepository,
  IStudentGroupRepository,
  IUserRepository,
  IAdministratorRepository,
  ITeacherRepository,
  IStudentRepository,
  IAdministratorDistrictRepository,
  ITeacherOrganizationRepository,
  IStudentGroupStudentRepository,
} from '../../../_shared/roster-sync/domain/usecases/RosterSync'

describe('ClasslinkRosterSyncUsecase', () => {
  test('success with internalOperator', async () => {
    const classlinkDistrictRepository: IClasslinkDistrictRepository = {
      getDistrict: async function (appId: string, accessToken: string): Promise<Errorable<ClasslinkDistrict | null, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: {
            sourcedId: 'classlinkDistrict-sourcedId',
            name: 'classlinkDistrict-name',
            status: 'active',
          },
        }
      },
    }
    const classlinkSchoolRepository: IClasslinkSchoolRepository = {
      getAllSchools: async function (appId: string, accessToken: string): Promise<Errorable<ClasslinkSchool[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              sourcedId: 'classlinkSchool-sourcedId',
              status: 'active',
              name: 'classlinkSchool-name',
              parentSourcedId: 'classlinkDistrict-sourcedId',
            },
          ],
        }
      },
    }
    const classlinkClassRepository: IClasslinkClassRepository = {
      getAllBySchoolSourcedId: async function (
        appId: string,
        accessToken: string,
        schoolSourcedId: string,
      ): Promise<Errorable<ClasslinkClass[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              sourcedId: 'classlinkClass-sourcedId',
              status: 'active',
              title: 'classlinkClass-title',
              grade: 'classlinkClass-grade',
              schoolSourcedId: 'classlinkSchool-sourcedId',
            },
          ],
        }
      },
    }
    const classlinkDistrictAdministratorRepository: IClasslinkDistrictAdministratorRepository = {
      getAllByDistrictSourcedId: async function (
        appId: string,
        accessToken: string,
        districtSourcedId: string,
      ): Promise<Errorable<ClasslinkDistrictAdministrator[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              sourcedId: 'classlinkDistrictAdministrator-sourcedId',
              status: 'active',
              givenName: 'classlinkDistrictAdministrator-givenName',
              familyName: 'classlinkDistrictAdministrator-familyName',
              email: 'classlinkDistrictAdministrator-email',
            },
          ],
        }
      },
    }
    const classlinkSchoolAdministratorRepository: IClasslinkSchoolAdministratorRepository = {
      getAllBySchoolSourcedId: async function (
        appId: string,
        accessToken: string,
        schoolSourcedId: string,
      ): Promise<Errorable<ClasslinkSchoolAdministrator[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              sourcedId: 'classlinkSchoolAdministrator-sourcedId',
              status: 'active',
              givenName: 'classlinkSchoolAdministrator-givenName',
              familyName: 'classlinkSchoolAdministrator-familyName',
              email: 'classlinkSchoolAdministrator-email',
            },
          ],
        }
      },
    }
    const classlinkTeacherRepository: IClasslinkTeacherRepository = {
      getAllBySchoolSourcedId: async function (
        appId: string,
        accessToken: string,
        schoolSourcedId: string,
      ): Promise<Errorable<ClasslinkTeacher[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              sourcedId: 'classlinkTeacher-sourcedId',
              status: 'active',
              givenName: 'classlinkTeacher-givenName',
              familyName: 'classlinkTeacher-familyName',
              email: 'classlinkTeacher-email',
            },
          ],
        }
      },
    }
    const classlinkStudentRepository: IClasslinkStudentRepository = {
      getAllByClassSourcedId: async function (
        appId: string,
        accessToken: string,
        classSourcedId: string,
      ): Promise<Errorable<ClasslinkStudent[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              sourcedId: 'classlinkStudent-sourcedId',
              status: 'active',
              givenName: 'classlinkStudent-givenName',
              familyName: 'classlinkStudent-familyName',
              email: 'classlinkStudent-email',
            },
          ],
        }
      },
    }
    const districtRepository: IDistrictRepository = {
      getById: async function (id: string): Promise<Errorable<District | null, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'district-id',
            name: 'district-name',
            districtLMSId: 'district-districtLMSId',
            classlinkTenantId: 'district-classlinkTenantId',
            classlinkAppId: 'district-classlinkAppId',
            classlinkAccessToken: 'district-classlinkAccessToken',
            lmsId: 'classlink',
            enableRosterSync: true,
          },
        }
      },
      createDistricts: async function (districts: Omit<District, 'id'>[]): Promise<Errorable<District[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      },
      updateDistricts: async function (districts: District[]): Promise<Errorable<void, E<'UnknownRuntimeError' | 'NotFoundError', string>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
      deleteDistricts: async function (ids: string[]): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }
    const districtRosterSyncStatusRepository: IDistrictRosterSyncStatusRepository = {
      createDistrictRosterSyncStatus: async function (
        data: Pick<DistrictRosterSyncStatus, 'districtId' | 'createdUserId'> & { startedAt: Date },
      ): Promise<Errorable<DistrictRosterSyncStatus | null, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'districtRosterSyncStatus-id',
            districtId: 'districtRosterSyncStatus-districtId',
            startedAt: 'districtRosterSyncStatus-startedAt',
            finishedAt: 'districtRosterSyncStatus-finishedAt',
            errorMessage: '',
            createdUserId: 'districtRosterSyncStatus-createdUserId',
          },
        }
      },
      updateDistrictRosterSyncStatus: async function (
        data: Pick<DistrictRosterSyncStatus, 'id'> & { errorMessage?: string | undefined; finishedAt: Date },
      ): Promise<Errorable<void, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }
    const organizationRepository = createSuccessMockOrganizationRepository()
    const studentGroupRepository = createSuccessMockStudentGroupRepository()
    const userRepository = createSuccessMockUserRepository()
    const administratorRepository = createSuccessMockAdministratorRepository()
    const teacherRepository = createSuccessMockTeacherRepository()
    const studentRepository = createSuccessMockStudentRepository()
    const administratorDistrictRepository = createSuccessMockAdministratorDistrictRepository()
    const teacherOrganizationRepository = createSuccessMockTeacherOrganizationRepository()
    const studentStudentGroupRepository = createSuccessMockStudentStudentGroupRepository()
    const result = await new ClasslinkRosterSyncUseCase(
      classlinkDistrictRepository,
      classlinkSchoolRepository,
      classlinkClassRepository,
      classlinkDistrictAdministratorRepository,
      classlinkSchoolAdministratorRepository,
      classlinkTeacherRepository,
      classlinkStudentRepository,
      districtRepository,
      districtRosterSyncStatusRepository,
      organizationRepository,
      studentGroupRepository,
      userRepository,
      administratorRepository,
      teacherRepository,
      studentRepository,
      administratorDistrictRepository,
      teacherOrganizationRepository,
      studentStudentGroupRepository,
    ).run(
      {
        id: 'requestedUser-id',
        role: 'internalOperator',
        isDeactivated: false,
      },
      'district-id',
    )
    if (result.hasError) {
      throw result
    }
  })
  const createSuccessMockOrganizationRepository = () => {
    const repository: IOrganizationRepository = {
      createOrganizations: async (_organizations: Organization[]): Promise<Errorable<Organization[], E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      },
      updateOrganizations: async (_organizations: Organization[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
      deleteOrganizations: async (_ids: string[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
      issueId: async function (): Promise<Errorable<string, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: 'uuid',
        }
      },
      getAllByDistrictId: async function (districtId: string): Promise<Errorable<Organization[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      },
    }
    return {
      createOrganizations: jest.fn((organizations: Organization[]) => repository.createOrganizations(organizations)),
      updateOrganizations: jest.fn((organizations: Organization[]) => repository.updateOrganizations(organizations)),
      deleteOrganizations: jest.fn((ids: string[]) => repository.deleteOrganizations(ids)),
      issueId: jest.fn(() => repository.issueId()),
      getAllByDistrictId: jest.fn((districtId) => repository.getAllByDistrictId(districtId)),
    }
  }
  const createSuccessMockStudentGroupRepository = () => {
    const repository: IStudentGroupRepository = {
      createStudentGroups: async (_studentGroups: StudentGroup[]): Promise<Errorable<StudentGroup[], E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: [] }
      },
      updateStudentGroups: async (_studentGroups: StudentGroup[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
      deleteStudentGroups: async (_ids: string[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
      issueId: async function (): Promise<Errorable<string, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: 'uuid',
        }
      },
      getAllByOrganizationId: async function (organizationId: string): Promise<Errorable<StudentGroup[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      },
    }
    return {
      createStudentGroups: jest.fn((studentGroups: StudentGroup[]) => repository.createStudentGroups(studentGroups)),
      updateStudentGroups: jest.fn((studentGroups: StudentGroup[]) => repository.updateStudentGroups(studentGroups)),
      deleteStudentGroups: jest.fn((ids: string[]) => repository.deleteStudentGroups(ids)),
      issueId: jest.fn(() => repository.issueId()),
      getAllByOrganizationId: jest.fn((organizationId) => repository.getAllByOrganizationId(organizationId)),
    }
  }
  const createSuccessMockUserRepository = () => {
    const repository: IUserRepository = {
      createUsers: async (_users: User[]): Promise<Errorable<User[], E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: [] }
      },
      updateUsers: async (_users: User[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
      deleteUsers: async (_ids: string[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
      issueId: async function (): Promise<Errorable<string, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: 'uuid',
        }
      },
      getByIds: async function (ids: string[]): Promise<Errorable<User[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      },
      getByEmails: async function (emails: string[]): Promise<Errorable<User[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      },
    }
    return {
      createUsers: jest.fn((users: User[]) => repository.createUsers(users)),
      updateUsers: jest.fn((users: User[]) => repository.updateUsers(users)),
      deleteUsers: jest.fn((ids: string[]) => repository.deleteUsers(ids)),
      issueId: jest.fn(() => repository.issueId()),
      getByIds: jest.fn((ids) => repository.getByIds(ids)),
      getByEmails: jest.fn((emails) => repository.getByEmails(emails)),
    }
  }
  const createSuccessMockAdministratorRepository = () => {
    const repository: IAdministratorRepository = {
      createAdministrators: async (_administrators: Administrator[]): Promise<Errorable<Administrator[], E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: [] }
      },
      updateAdministrators: async (_administrators: Administrator[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
      deleteAdministrators: async (_ids: string[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
      issueId: async function (): Promise<Errorable<string, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: 'uuid',
        }
      },
      getAllByDistrictId: async function (districtId: string): Promise<Errorable<Administrator[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      },
      getAllByLmsId: async function (lmsId: string[], tenantId: string | null): Promise<Errorable<Administrator[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      },
    }
    return {
      createAdministrators: jest.fn((administrators: Administrator[]) => repository.createAdministrators(administrators)),
      updateAdministrators: jest.fn((administrators: Administrator[]) => repository.updateAdministrators(administrators)),
      deleteAdministrators: jest.fn((ids: string[]) => repository.deleteAdministrators(ids)),
      issueId: jest.fn(() => repository.issueId()),
      getAllByDistrictId: jest.fn((districtId) => repository.getAllByDistrictId(districtId)),
      getAllByLmsId: jest.fn((lmsId, tenantId) => repository.getAllByLmsId(lmsId, tenantId)),
    }
  }
  const createSuccessMockTeacherRepository = () => {
    const repository: ITeacherRepository = {
      createTeachers: async (_teachers: Teacher[]): Promise<Errorable<Teacher[], E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: [] }
      },
      updateTeachers: async (_teachers: Teacher[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
      deleteTeachers: async (_ids: string[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
      issueId: async function (): Promise<Errorable<string, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: 'uuid',
        }
      },
      getAllByOrganizationId: async function (organizationId: string): Promise<Errorable<Teacher[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      },
      getAllByLmsId: async function (lmsId: string[], tenantId: string | null): Promise<Errorable<Teacher[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      },
    }
    return {
      createTeachers: jest.fn((teachers: Teacher[]) => repository.createTeachers(teachers)),
      updateTeachers: jest.fn((teachers: Teacher[]) => repository.updateTeachers(teachers)),
      deleteTeachers: jest.fn((ids: string[]) => repository.deleteTeachers(ids)),
      issueId: jest.fn(() => repository.issueId()),
      getAllByOrganizationId: jest.fn((organizationId) => repository.getAllByOrganizationId(organizationId)),
      getAllByLmsId: jest.fn((lmsId, tenantId) => repository.getAllByLmsId(lmsId, tenantId)),
    }
  }
  const createSuccessMockStudentRepository = () => {
    const repository: IStudentRepository = {
      createStudents: async (_students: Student[]): Promise<Errorable<Student[], E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: [] }
      },
      updateStudents: async (_students: Student[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
      deleteStudents: async (_ids: string[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
      issueId: async function (): Promise<Errorable<string, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: 'uuid',
        }
      },
      getAllByStudentGroupId: async function (studentGroupId: string): Promise<Errorable<Student[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      },
      getAllByLmsId: async function (lmsId: string[], tenantId: string | null): Promise<Errorable<Student[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      },
    }
    return {
      createStudents: jest.fn((students: Student[]) => repository.createStudents(students)),
      updateStudents: jest.fn((students: Student[]) => repository.updateStudents(students)),
      deleteStudents: jest.fn((ids: string[]) => repository.deleteStudents(ids)),
      issueId: jest.fn(() => repository.issueId()),
      getAllByStudentGroupId: jest.fn((districtId) => repository.getAllByStudentGroupId(districtId)),
      getAllByLmsId: jest.fn((lmsId, tenantId) => repository.getAllByLmsId(lmsId, tenantId)),
    }
  }
  const createSuccessMockAdministratorDistrictRepository = () => {
    const repository: IAdministratorDistrictRepository = {
      createAdministratorDistricts: async (_administratorDistricts: AdministratorDistrict[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
      deleteAdministratorDistricts: async (_administratorDistricts: AdministratorDistrict[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
      issueId: async function (): Promise<Errorable<string, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: 'uuid',
        }
      },
      getAllByDistrictId: async function (districtId: string): Promise<Errorable<AdministratorDistrict[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      },
    }
    return {
      createAdministratorDistricts: jest.fn((administratorDistricts: AdministratorDistrict[]) =>
        repository.createAdministratorDistricts(administratorDistricts),
      ),
      deleteAdministratorDistricts: jest.fn((administratorDistricts: AdministratorDistrict[]) =>
        repository.deleteAdministratorDistricts(administratorDistricts),
      ),
      issueId: jest.fn(() => repository.issueId()),
      getAllByDistrictId: jest.fn((districtId) => repository.getAllByDistrictId(districtId)),
    }
  }
  const createSuccessMockTeacherOrganizationRepository = () => {
    const repository: ITeacherOrganizationRepository = {
      createTeacherOrganizations: async (_teacherOrganizations: TeacherOrganization[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
      deleteTeacherOrganizations: async (_teacherOrganizations: TeacherOrganization[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
      issueId: async function (): Promise<Errorable<string, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: 'uuid',
        }
      },
      getAllByOrganizationId: async function (organizationId: string): Promise<Errorable<TeacherOrganization[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      },
    }
    return {
      createTeacherOrganizations: jest.fn((teacherOrganizations: TeacherOrganization[]) => repository.createTeacherOrganizations(teacherOrganizations)),
      deleteTeacherOrganizations: jest.fn((teacherOrganizations: TeacherOrganization[]) => repository.deleteTeacherOrganizations(teacherOrganizations)),
      issueId: jest.fn(() => repository.issueId()),
      getAllByOrganizationId: jest.fn((districtId) => repository.getAllByOrganizationId(districtId)),
    }
  }
  const createSuccessMockStudentStudentGroupRepository = () => {
    const repository: IStudentGroupStudentRepository = {
      createStudentGroupStudents: async (_studentStudentGroups: StudentStudentGroup[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
      deleteStudentGroupStudents: async (_studentStudentGroups: StudentStudentGroup[]): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
        return { hasError: false, error: null, value: undefined }
      },
      issueId: async function (): Promise<Errorable<string, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: 'uuid',
        }
      },
      getAllByStudentGroupId: async function (studentGroupId: string): Promise<Errorable<StudentGroupStudent[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      },
    }
    return {
      createStudentGroupStudents: jest.fn((studentStudentGroups: StudentStudentGroup[]) => repository.createStudentGroupStudents(studentStudentGroups)),
      deleteStudentGroupStudents: jest.fn((studentStudentGroups: StudentStudentGroup[]) => repository.deleteStudentGroupStudents(studentStudentGroups)),
      issueId: jest.fn(() => repository.issueId()),
      getAllByStudentGroupId: jest.fn((studentGroupId) => repository.getAllByStudentGroupId(studentGroupId)),
    }
  }
})

describe('RequestClasslinkApisAndMapToSourceLmsEntites', () => {
  test('success', async () => {
    // Retrive Classlink Entities
    const classlinkDistrictRepository: IClasslinkDistrictRepository = {
      getDistrict: jest.fn(async function (appId: string, accessToken: string): Promise<Errorable<ClasslinkDistrict | null, E<'UnknownRuntimeError', string>>> {
        return successErrorable({
          status: 'active',
          name: 'classlink-district-name',
          sourcedId: 'classlink-district-sourcedId',
        })
      }),
    }
    const classlinkSchoolRepository: IClasslinkSchoolRepository = {
      getAllSchools: jest.fn(async function (appId: string, accessToken: string): Promise<Errorable<ClasslinkSchool[], E<'UnknownRuntimeError', string>>> {
        return successErrorable([
          {
            status: 'active',
            name: 'classlink-school-name-1',
            sourcedId: 'classlink-school-sourcedId-1',
            parentSourcedId: 'classlink-school-parentSourcedId-1',
          },
          {
            status: 'active',
            name: 'classlink-school-name-2',
            sourcedId: 'classlink-school-sourcedId-2',
            parentSourcedId: 'classlink-school-parentSourcedId-2',
          },
          {
            status: 'tobedeleted',
            name: 'classlink-school-name-3',
            sourcedId: 'classlink-school-sourcedId-3',
            parentSourcedId: 'classlink-school-parentSourcedId-3',
          },
        ])
      }),
    }
    const classlinkClassRepository: IClasslinkClassRepository = {
      getAllBySchoolSourcedId: jest.fn(async function (
        appId: string,
        accessToken: string,
        schoolSourcedId: string,
      ): Promise<Errorable<ClasslinkClass[], E<'UnknownRuntimeError', string>>> {
        return successErrorable([
          {
            status: `active`,
            title: `classlink-class-title-1-${schoolSourcedId}`,
            grade: `classlink-class-grade-1-${schoolSourcedId}`,
            sourcedId: `classlink-class-sourcedId-1-${schoolSourcedId}`,
            schoolSourcedId,
          },
          {
            status: `active`,
            title: `classlink-class-title-2-${schoolSourcedId}`,
            grade: `classlink-class-grade-2-${schoolSourcedId}`,
            sourcedId: `classlink-class-sourcedId-2-${schoolSourcedId}`,
            schoolSourcedId,
          },
          {
            status: `tobedeleted`,
            title: `classlink-class-title-3-${schoolSourcedId}`,
            grade: `classlink-class-grade-3-${schoolSourcedId}`,
            sourcedId: `classlink-class-sourcedId-3-${schoolSourcedId}`,
            schoolSourcedId,
          },
        ])
      }),
    }
    const classlinkDistrictAdministratorRepository: IClasslinkDistrictAdministratorRepository = {
      getAllByDistrictSourcedId: jest.fn(async function (
        appId: string,
        accessToken: string,
        districtSourcedId: string,
      ): Promise<Errorable<ClasslinkDistrictAdministrator[], E<'UnknownRuntimeError', string>>> {
        return successErrorable([
          {
            status: 'active',
            givenName: 'classlink-districtAdministrator-givenName-1',
            familyName: 'classlink-districtAdministrator-familyName-1',
            email: 'classlink-districtAdministrator-email-1',
            sourcedId: 'classlink-districtAdministrator-sourcedId-1',
          },
          {
            status: 'active',
            givenName: 'classlink-districtAdministrator-givenName-2',
            familyName: 'classlink-districtAdministrator-familyName-2',
            email: 'classlink-districtAdministrator-email-2',
            sourcedId: 'classlink-districtAdministrator-sourcedId-2',
          },
          {
            status: 'tobedeleted',
            givenName: 'classlink-districtAdministrator-givenName-3',
            familyName: 'classlink-districtAdministrator-familyName-3',
            email: 'classlink-districtAdministrator-email-3',
            sourcedId: 'classlink-districtAdministrator-sourcedId-3',
          },
        ])
      }),
    }
    const classlinkSchoolAdministratorRepository: IClasslinkSchoolAdministratorRepository = {
      getAllBySchoolSourcedId: jest.fn(async function (
        appId: string,
        accessToken: string,
        schoolSourcedId: string,
      ): Promise<Errorable<ClasslinkSchoolAdministrator[], E<'UnknownRuntimeError', string>>> {
        return successErrorable([
          {
            status: 'active',
            givenName: `classlink-schoolAdministrator-givenName-1-${schoolSourcedId}`,
            familyName: `classlink-schoolAdministrator-familyName-1-${schoolSourcedId}`,
            email: `classlink-schoolAdministrator-email-1-${schoolSourcedId}`,
            sourcedId: `classlink-schoolAdministrator-sourcedId-1-${schoolSourcedId}`,
          },
          {
            status: `active`,
            givenName: `classlink-schoolAdministrator-givenName-2-${schoolSourcedId}`,
            familyName: `classlink-schoolAdministrator-familyName-2-${schoolSourcedId}`,
            email: `classlink-schoolAdministrator-email-2-${schoolSourcedId}`,
            sourcedId: `classlink-schoolAdministrator-sourcedId-2-${schoolSourcedId}`,
          },
          {
            status: `tobedeleted`,
            givenName: `classlink-schoolAdministrator-givenName-3-${schoolSourcedId}`,
            familyName: `classlink-schoolAdministrator-familyName-3-${schoolSourcedId}`,
            email: `classlink-schoolAdministrator-email-3-${schoolSourcedId}`,
            sourcedId: `classlink-schoolAdministrator-sourcedId-3-${schoolSourcedId}`,
          },
        ])
      }),
    }
    const classlinkTeacherRepository: IClasslinkTeacherRepository = {
      getAllBySchoolSourcedId: jest.fn(async function (
        appId: string,
        accessToken: string,
        schoolSourcedId: string,
      ): Promise<Errorable<ClasslinkTeacher[], E<'UnknownRuntimeError', string>>> {
        return successErrorable([
          {
            status: 'active',
            givenName: `classlink-teacher-givenName-1-${schoolSourcedId}`,
            familyName: `classlink-teacher-familyName-1-${schoolSourcedId}`,
            email: `classlink-teacher-email-1-${schoolSourcedId}`,
            sourcedId: `classlink-teacher-sourcedId-1-${schoolSourcedId}`,
          },
          {
            status: `active`,
            givenName: `classlink-teacher-givenName-2-${schoolSourcedId}`,
            familyName: `classlink-teacher-familyName-2-${schoolSourcedId}`,
            email: `classlink-teacher-email-2-${schoolSourcedId}`,
            sourcedId: `classlink-teacher-sourcedId-2-${schoolSourcedId}`,
          },
          {
            status: `tobedeleted`,
            givenName: `classlink-teacher-givenName-3-${schoolSourcedId}`,
            familyName: `classlink-teacher-familyName-3-${schoolSourcedId}`,
            email: `classlink-teacher-email-3-${schoolSourcedId}`,
            sourcedId: `classlink-teacher-sourcedId-3-${schoolSourcedId}`,
          },
        ])
      }),
    }
    const classlinkStudentRepository: IClasslinkStudentRepository = {
      getAllByClassSourcedId: jest.fn(async function (
        appId: string,
        accessToken: string,
        classSourcedId: string,
      ): Promise<Errorable<ClasslinkStudent[], E<`UnknownRuntimeError`, string>>> {
        return successErrorable([
          {
            status: `active`,
            givenName: `classlink-student-givenName-1-${classSourcedId}`,
            familyName: `classlink-student-familyName-1-${classSourcedId}`,
            email: `classlink-student-email-1-${classSourcedId}`,
            sourcedId: `classlink-student-sourcedId-1-${classSourcedId}`,
          },
          {
            status: `active`,
            givenName: `classlink-student-givenName-2-${classSourcedId}`,
            familyName: `classlink-student-familyName-2-${classSourcedId}`,
            email: `classlink-student-email-2-${classSourcedId}`,
            sourcedId: `classlink-student-sourcedId-2-${classSourcedId}`,
          },
          {
            status: `tobedeleted`,
            givenName: `classlink-student-givenName-3-${classSourcedId}`,
            familyName: `classlink-student-familyName-3-${classSourcedId}`,
            email: `classlink-student-email-3-${classSourcedId}`,
            sourcedId: `classlink-student-sourcedId-3-${classSourcedId}`,
          },
        ])
      }),
    }

    const result = await new RequestClasslinkApisAndMapToSourceLmsEntites(
      classlinkDistrictRepository,
      classlinkSchoolRepository,
      classlinkClassRepository,
      classlinkDistrictAdministratorRepository,
      classlinkSchoolAdministratorRepository,
      classlinkTeacherRepository,
      classlinkStudentRepository,
    ).run({
      id: 'district-id',
      name: 'district-name',
      lmsId: 'classlink',
      districtLMSId: 'district-districtLMSId',
      classlinkAccessToken: 'district-classlinkAccessToken',
      classlinkAppId: 'district-classlinkAppId',
      classlinkTenantId: 'district-classlinkTenantId',
      enableRosterSync: true,
    })
    if (result.hasError) {
      throw result
    }

    expect(result.value.allSourceLmsOrganizations).toEqual<typeof result.value.allSourceLmsOrganizations>([
      {
        name: 'classlink-school-name-1',
        organizationLMSId: 'classlink-school-sourcedId-1',
        districtId: 'district-id',
        classlinkTenantId: 'district-classlinkTenantId',
      },
      {
        name: 'classlink-school-name-2',
        organizationLMSId: 'classlink-school-sourcedId-2',
        districtId: 'district-id',
        classlinkTenantId: 'district-classlinkTenantId',
      },
    ])
    expect(result.value.allSourceLmsStudentGroups).toEqual<typeof result.value.allSourceLmsStudentGroups>([
      // classlink-school-sourcedId-1
      {
        name: 'classlink-class-title-1-classlink-school-sourcedId-1',
        grade: 'classlink-class-grade-1-classlink-school-sourcedId-1',
        studentGroupLmsId: 'classlink-class-sourcedId-1-classlink-school-sourcedId-1',
        organizationLMSId: 'classlink-school-sourcedId-1',
        classlinkTenantId: 'district-classlinkTenantId',
      },
      {
        name: 'classlink-class-title-2-classlink-school-sourcedId-1',
        grade: 'classlink-class-grade-2-classlink-school-sourcedId-1',
        studentGroupLmsId: 'classlink-class-sourcedId-2-classlink-school-sourcedId-1',
        organizationLMSId: 'classlink-school-sourcedId-1',
        classlinkTenantId: 'district-classlinkTenantId',
      },
      // classlink-school-sourcedId-2
      {
        name: 'classlink-class-title-1-classlink-school-sourcedId-2',
        grade: 'classlink-class-grade-1-classlink-school-sourcedId-2',
        studentGroupLmsId: 'classlink-class-sourcedId-1-classlink-school-sourcedId-2',
        organizationLMSId: 'classlink-school-sourcedId-2',
        classlinkTenantId: 'district-classlinkTenantId',
      },
      {
        name: 'classlink-class-title-2-classlink-school-sourcedId-2',
        grade: 'classlink-class-grade-2-classlink-school-sourcedId-2',
        studentGroupLmsId: 'classlink-class-sourcedId-2-classlink-school-sourcedId-2',
        organizationLMSId: 'classlink-school-sourcedId-2',
        classlinkTenantId: 'district-classlinkTenantId',
      },
    ])
    // All Administrators in Classlink will be mapped to Teachers
    expect(result.value.allSourceLmsAdministrators).toEqual<typeof result.value.allSourceLmsAdministrators>([])
    expect(result.value.allSourceLmsTeachers).toEqual<typeof result.value.allSourceLmsTeachers>([
      // classlink-school-sourcedId-1
      {
        role: 'teacher',
        firstName: `classlink-teacher-givenName-1-classlink-school-sourcedId-1`,
        lastName: `classlink-teacher-familyName-1-classlink-school-sourcedId-1`,
        email: `classlink-teacher-email-1-classlink-school-sourcedId-1`,
        teacherLMSId: `classlink-teacher-sourcedId-1-classlink-school-sourcedId-1`,
        isDeactivated: false,
        classlinkTenantId: 'district-classlinkTenantId',
      },
      {
        role: 'teacher',
        firstName: `classlink-teacher-givenName-2-classlink-school-sourcedId-1`,
        lastName: `classlink-teacher-familyName-2-classlink-school-sourcedId-1`,
        email: `classlink-teacher-email-2-classlink-school-sourcedId-1`,
        teacherLMSId: `classlink-teacher-sourcedId-2-classlink-school-sourcedId-1`,
        isDeactivated: false,
        classlinkTenantId: 'district-classlinkTenantId',
      },
      {
        role: 'teacher',
        firstName: `classlink-schoolAdministrator-givenName-1-classlink-school-sourcedId-1`,
        lastName: `classlink-schoolAdministrator-familyName-1-classlink-school-sourcedId-1`,
        email: `classlink-schoolAdministrator-email-1-classlink-school-sourcedId-1`,
        teacherLMSId: `classlink-schoolAdministrator-sourcedId-1-classlink-school-sourcedId-1`,
        isDeactivated: false,
        classlinkTenantId: 'district-classlinkTenantId',
      },
      {
        role: 'teacher',
        firstName: `classlink-schoolAdministrator-givenName-2-classlink-school-sourcedId-1`,
        lastName: `classlink-schoolAdministrator-familyName-2-classlink-school-sourcedId-1`,
        email: `classlink-schoolAdministrator-email-2-classlink-school-sourcedId-1`,
        teacherLMSId: `classlink-schoolAdministrator-sourcedId-2-classlink-school-sourcedId-1`,
        isDeactivated: false,
        classlinkTenantId: 'district-classlinkTenantId',
      },
      // classlink-school-sourcedId-2
      {
        role: 'teacher',
        firstName: `classlink-teacher-givenName-1-classlink-school-sourcedId-2`,
        lastName: `classlink-teacher-familyName-1-classlink-school-sourcedId-2`,
        email: `classlink-teacher-email-1-classlink-school-sourcedId-2`,
        teacherLMSId: `classlink-teacher-sourcedId-1-classlink-school-sourcedId-2`,
        isDeactivated: false,
        classlinkTenantId: 'district-classlinkTenantId',
      },
      {
        role: 'teacher',
        firstName: `classlink-teacher-givenName-2-classlink-school-sourcedId-2`,
        lastName: `classlink-teacher-familyName-2-classlink-school-sourcedId-2`,
        email: `classlink-teacher-email-2-classlink-school-sourcedId-2`,
        teacherLMSId: `classlink-teacher-sourcedId-2-classlink-school-sourcedId-2`,
        isDeactivated: false,
        classlinkTenantId: 'district-classlinkTenantId',
      },
      {
        role: 'teacher',
        firstName: `classlink-schoolAdministrator-givenName-1-classlink-school-sourcedId-2`,
        lastName: `classlink-schoolAdministrator-familyName-1-classlink-school-sourcedId-2`,
        email: `classlink-schoolAdministrator-email-1-classlink-school-sourcedId-2`,
        teacherLMSId: `classlink-schoolAdministrator-sourcedId-1-classlink-school-sourcedId-2`,
        isDeactivated: false,
        classlinkTenantId: 'district-classlinkTenantId',
      },
      {
        role: 'teacher',
        firstName: `classlink-schoolAdministrator-givenName-2-classlink-school-sourcedId-2`,
        lastName: `classlink-schoolAdministrator-familyName-2-classlink-school-sourcedId-2`,
        email: `classlink-schoolAdministrator-email-2-classlink-school-sourcedId-2`,
        teacherLMSId: `classlink-schoolAdministrator-sourcedId-2-classlink-school-sourcedId-2`,
        isDeactivated: false,
        classlinkTenantId: 'district-classlinkTenantId',
      },
      //
      // From District Administrators
      //
      {
        role: 'teacher',
        firstName: 'classlink-districtAdministrator-givenName-1',
        lastName: 'classlink-districtAdministrator-familyName-1',
        email: 'classlink-districtAdministrator-email-1',
        teacherLMSId: 'classlink-districtAdministrator-sourcedId-1',
        isDeactivated: false,
        classlinkTenantId: 'district-classlinkTenantId',
      },
      {
        role: 'teacher',
        firstName: 'classlink-districtAdministrator-givenName-2',
        lastName: 'classlink-districtAdministrator-familyName-2',
        email: 'classlink-districtAdministrator-email-2',
        teacherLMSId: 'classlink-districtAdministrator-sourcedId-2',
        isDeactivated: false,
        classlinkTenantId: 'district-classlinkTenantId',
      },
    ])
    expect(result.value.allSourceLmsStudents).toEqual<typeof result.value.allSourceLmsStudents>([
      // classlink-class-sourcedId-1-classlink-school-sourcedId-1
      {
        role: 'student',
        nickName: `classlink-student-givenName-1-classlink-class-sourcedId-1-classlink-school-sourcedId-1 classlink-student-familyName-1-classlink-class-sourcedId-1-classlink-school-sourcedId-1`,
        email: `classlink-student-email-1-classlink-class-sourcedId-1-classlink-school-sourcedId-1`,
        studentLMSId: `classlink-student-sourcedId-1-classlink-class-sourcedId-1-classlink-school-sourcedId-1`,
        isDeactivated: false,
        classlinkTenantId: 'district-classlinkTenantId',
      },
      {
        role: 'student',
        nickName: `classlink-student-givenName-2-classlink-class-sourcedId-1-classlink-school-sourcedId-1 classlink-student-familyName-2-classlink-class-sourcedId-1-classlink-school-sourcedId-1`,
        email: `classlink-student-email-2-classlink-class-sourcedId-1-classlink-school-sourcedId-1`,
        studentLMSId: `classlink-student-sourcedId-2-classlink-class-sourcedId-1-classlink-school-sourcedId-1`,
        isDeactivated: false,
        classlinkTenantId: 'district-classlinkTenantId',
      },
      // classlink-class-sourcedId-2-classlink-school-sourcedId-1
      {
        role: 'student',
        nickName: `classlink-student-givenName-1-classlink-class-sourcedId-2-classlink-school-sourcedId-1 classlink-student-familyName-1-classlink-class-sourcedId-2-classlink-school-sourcedId-1`,
        email: `classlink-student-email-1-classlink-class-sourcedId-2-classlink-school-sourcedId-1`,
        studentLMSId: `classlink-student-sourcedId-1-classlink-class-sourcedId-2-classlink-school-sourcedId-1`,
        isDeactivated: false,
        classlinkTenantId: 'district-classlinkTenantId',
      },
      {
        role: 'student',
        nickName: `classlink-student-givenName-2-classlink-class-sourcedId-2-classlink-school-sourcedId-1 classlink-student-familyName-2-classlink-class-sourcedId-2-classlink-school-sourcedId-1`,
        email: `classlink-student-email-2-classlink-class-sourcedId-2-classlink-school-sourcedId-1`,
        studentLMSId: `classlink-student-sourcedId-2-classlink-class-sourcedId-2-classlink-school-sourcedId-1`,
        isDeactivated: false,
        classlinkTenantId: 'district-classlinkTenantId',
      },
      // classlink-class-sourcedId-1-classlink-school-sourcedId-2
      {
        role: 'student',
        nickName: `classlink-student-givenName-1-classlink-class-sourcedId-1-classlink-school-sourcedId-2 classlink-student-familyName-1-classlink-class-sourcedId-1-classlink-school-sourcedId-2`,
        email: `classlink-student-email-1-classlink-class-sourcedId-1-classlink-school-sourcedId-2`,
        studentLMSId: `classlink-student-sourcedId-1-classlink-class-sourcedId-1-classlink-school-sourcedId-2`,
        isDeactivated: false,
        classlinkTenantId: 'district-classlinkTenantId',
      },
      {
        role: 'student',
        nickName: `classlink-student-givenName-2-classlink-class-sourcedId-1-classlink-school-sourcedId-2 classlink-student-familyName-2-classlink-class-sourcedId-1-classlink-school-sourcedId-2`,
        email: `classlink-student-email-2-classlink-class-sourcedId-1-classlink-school-sourcedId-2`,
        studentLMSId: `classlink-student-sourcedId-2-classlink-class-sourcedId-1-classlink-school-sourcedId-2`,
        isDeactivated: false,
        classlinkTenantId: 'district-classlinkTenantId',
      },
      // classlink-class-sourcedId-2-classlink-school-sourcedId-2
      {
        role: 'student',
        nickName: `classlink-student-givenName-1-classlink-class-sourcedId-2-classlink-school-sourcedId-2 classlink-student-familyName-1-classlink-class-sourcedId-2-classlink-school-sourcedId-2`,
        email: `classlink-student-email-1-classlink-class-sourcedId-2-classlink-school-sourcedId-2`,
        studentLMSId: `classlink-student-sourcedId-1-classlink-class-sourcedId-2-classlink-school-sourcedId-2`,
        isDeactivated: false,
        classlinkTenantId: 'district-classlinkTenantId',
      },
      {
        role: 'student',
        nickName: `classlink-student-givenName-2-classlink-class-sourcedId-2-classlink-school-sourcedId-2 classlink-student-familyName-2-classlink-class-sourcedId-2-classlink-school-sourcedId-2`,
        email: `classlink-student-email-2-classlink-class-sourcedId-2-classlink-school-sourcedId-2`,
        studentLMSId: `classlink-student-sourcedId-2-classlink-class-sourcedId-2-classlink-school-sourcedId-2`,
        isDeactivated: false,
        classlinkTenantId: 'district-classlinkTenantId',
      },
    ])
    expect(result.value.allSourceLmsAdministratorDistricts).toEqual<typeof result.value.allSourceLmsAdministratorDistricts>([])
    expect(result.value.allSourceLmsTeacherOrganizations).toEqual<typeof result.value.allSourceLmsTeacherOrganizations>([
      {
        organizationLMSId: 'classlink-school-sourcedId-1',
        teacherLMSId: 'classlink-teacher-sourcedId-1-classlink-school-sourcedId-1',
      },
      {
        organizationLMSId: 'classlink-school-sourcedId-1',
        teacherLMSId: 'classlink-teacher-sourcedId-2-classlink-school-sourcedId-1',
      },
      {
        organizationLMSId: 'classlink-school-sourcedId-1',
        teacherLMSId: 'classlink-schoolAdministrator-sourcedId-1-classlink-school-sourcedId-1',
      },
      {
        organizationLMSId: 'classlink-school-sourcedId-1',
        teacherLMSId: 'classlink-schoolAdministrator-sourcedId-2-classlink-school-sourcedId-1',
      },
      {
        organizationLMSId: 'classlink-school-sourcedId-2',
        teacherLMSId: 'classlink-teacher-sourcedId-1-classlink-school-sourcedId-2',
      },
      {
        organizationLMSId: 'classlink-school-sourcedId-2',
        teacherLMSId: 'classlink-teacher-sourcedId-2-classlink-school-sourcedId-2',
      },
      {
        organizationLMSId: 'classlink-school-sourcedId-2',
        teacherLMSId: 'classlink-schoolAdministrator-sourcedId-1-classlink-school-sourcedId-2',
      },
      {
        organizationLMSId: 'classlink-school-sourcedId-2',
        teacherLMSId: 'classlink-schoolAdministrator-sourcedId-2-classlink-school-sourcedId-2',
      },
      {
        organizationLMSId: 'classlink-school-sourcedId-1',
        teacherLMSId: 'classlink-districtAdministrator-sourcedId-1',
      },
      {
        organizationLMSId: 'classlink-school-sourcedId-2',
        teacherLMSId: 'classlink-districtAdministrator-sourcedId-1',
      },
      {
        organizationLMSId: 'classlink-school-sourcedId-1',
        teacherLMSId: 'classlink-districtAdministrator-sourcedId-2',
      },
      {
        organizationLMSId: 'classlink-school-sourcedId-2',
        teacherLMSId: 'classlink-districtAdministrator-sourcedId-2',
      },
    ])
    expect(result.value.allSourceLmsStudentGroupStudents).toEqual<typeof result.value.allSourceLmsStudentGroupStudents>([
      {
        studentGroupLmsId: 'classlink-class-sourcedId-1-classlink-school-sourcedId-1',
        studentLMSId: 'classlink-student-sourcedId-1-classlink-class-sourcedId-1-classlink-school-sourcedId-1',
      },
      {
        studentGroupLmsId: 'classlink-class-sourcedId-1-classlink-school-sourcedId-1',
        studentLMSId: 'classlink-student-sourcedId-2-classlink-class-sourcedId-1-classlink-school-sourcedId-1',
      },
      {
        studentGroupLmsId: 'classlink-class-sourcedId-2-classlink-school-sourcedId-1',
        studentLMSId: 'classlink-student-sourcedId-1-classlink-class-sourcedId-2-classlink-school-sourcedId-1',
      },
      {
        studentGroupLmsId: 'classlink-class-sourcedId-2-classlink-school-sourcedId-1',
        studentLMSId: 'classlink-student-sourcedId-2-classlink-class-sourcedId-2-classlink-school-sourcedId-1',
      },
      {
        studentGroupLmsId: 'classlink-class-sourcedId-1-classlink-school-sourcedId-2',
        studentLMSId: 'classlink-student-sourcedId-1-classlink-class-sourcedId-1-classlink-school-sourcedId-2',
      },
      {
        studentGroupLmsId: 'classlink-class-sourcedId-1-classlink-school-sourcedId-2',
        studentLMSId: 'classlink-student-sourcedId-2-classlink-class-sourcedId-1-classlink-school-sourcedId-2',
      },
      {
        studentGroupLmsId: 'classlink-class-sourcedId-2-classlink-school-sourcedId-2',
        studentLMSId: 'classlink-student-sourcedId-1-classlink-class-sourcedId-2-classlink-school-sourcedId-2',
      },
      {
        studentGroupLmsId: 'classlink-class-sourcedId-2-classlink-school-sourcedId-2',
        studentLMSId: 'classlink-student-sourcedId-2-classlink-class-sourcedId-2-classlink-school-sourcedId-2',
      },
    ])
  })
})
