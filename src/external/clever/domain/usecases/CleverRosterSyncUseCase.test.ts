import { E, Errorable, successErrorable } from '../../../../domain/usecases/shared/Errors'
import { CleverSection } from '../entities/CleverSection'
import { CleverDistrict } from '../entities/CleverDistrict'
import { CleverDistrictAdministrator } from '../entities/CleverDistrictAdministrator'
import { CleverSchool } from '../entities/CleverSchool'
import { CleverStudent } from '../entities/CleverStudent'
import { CleverTeacher } from '../entities/CleverTeacher'
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
  ICleverRosterSyncRepository,
  ICleverSectionRepository,
  ICleverDistrictRepository,
  ICleverDistrictAdministratorRepository,
  ICleverSchoolRepository,
  ICleverStudentRepository,
  ICleverTeacherRepository,
  RequestCleverApisAndMapToSourceLmsEntites,
  CleverRosterSyncUseCase,
} from './CleverRosterSyncUseCase'
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

describe('CleverRosterSyncUsecase', () => {
  test('success with internalOperator', async () => {
    const cleverRosterSyncRepository = createSuccessMockCleverRosterSyncRepository()
    const cleverDistrictRepository = createSuccessMockCleverDistrictRepository()
    const cleverSchoolRepository = createSuccessMockCleverSchoolRepository()
    const cleverSectionRepository = createSuccessMockCleverSectionRepository()
    const cleverDistrictAdministratorRepository = createSuccessMockCleverDistrictAdministratorRepository()
    const cleverTeacherRepository = createSuccessMockCleverTeacherRepository()
    const cleverStudentRepository = createSuccessMockCleverStudentRepository()
    const districtRepository = createSuccessMockDistrictRepository()
    const districtRosterSyncStatusRepository = createSuccessMockDistrictRosterSyncStatusRepository()
    const organizationRepository = createSuccessMockOrganizationRepository()
    const studentGroupRepository = createSuccessMockStudentGroupRepository()
    const userRepository = createSuccessMockUserRepository()
    const administratorRepository = createSuccessMockAdministratorRepository()
    const teacherRepository = createSuccessMockTeacherRepository()
    const studentRepository = createSuccessMockStudentRepository()
    const administratorDistrictRepository = createSuccessMockAdministratorDistrictRepository()
    const teacherOrganizationRepository = createSuccessMockTeacherOrganizationRepository()
    const studentStudentGroupRepository = createSuccessMockStudentStudentGroupRepository()
    const result = await new CleverRosterSyncUseCase(
      cleverRosterSyncRepository,
      cleverDistrictRepository,
      cleverSchoolRepository,
      cleverSectionRepository,
      cleverDistrictAdministratorRepository,
      cleverTeacherRepository,
      cleverStudentRepository,
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
      'districtId',
    )
    if (result.hasError) {
      throw result
    }
  })
  describe('test user CRUD by role', () => {
    describe(`
        role
    `, () => {
      describe.each`
        role
        ${'administrator'}
        ${'teacher'}
        ${'student'}
      `(
        `
        $role
      `,
        ({ role }: { role: 'administrator' | 'teacher' | 'student' }) => {
          describe(`
              codexUserEmail | codexUserLmsId | cleverUserEmail | cleverUserLmsId | expectedCRUD
          `, () => {
            test.each`
              codexUserEmail | codexUserLmsId | cleverUserEmail | cleverUserLmsId | expectedCRUD
              ${null}        | ${null}        | ${null}         | ${null}         | ${null}
              ${null}        | ${null}        | ${'email1'}     | ${'lmsId1'}     | ${'C'}
              ${'email1'}    | ${'lmsId1'}    | ${'email1'}     | ${'lmsId1'}     | ${'U'}
              ${'email1'}    | ${'lmsId1'}    | ${null}         | ${null}         | ${'D'}
            `(
              `
              $codexUserEmail $codexUserLmsId $cleverUserEmail $cleverUserLmsId $expectedCRUD
      `,
              async ({
                codexUserEmail,
                codexUserLmsId,
                cleverUserEmail,
                cleverUserLmsId,
                expectedCRUD,
              }: {
                codexUserEmail: string | null
                codexUserLmsId: string | null
                cleverUserEmail: string | null
                cleverUserLmsId: string | null
                expectedCRUD: 'C' | 'U' | 'D' | null
              }) => {
                const cleverRosterSyncRepository = createSuccessMockCleverRosterSyncRepository()
                const cleverDistrictRepository = createSuccessMockCleverDistrictRepository()
                const cleverSchoolRepository = createSuccessMockCleverSchoolRepository()
                const cleverSectionRepository = createSuccessMockCleverSectionRepository()
                const cleverDistrictAdministratorRepository = createSuccessMockCleverDistrictAdministratorRepository()
                const cleverTeacherRepository = createSuccessMockCleverTeacherRepository()
                const cleverStudentRepository = createSuccessMockCleverStudentRepository()
                const districtRepository = createSuccessMockDistrictRepository()
                const districtRosterSyncStatusRepository = createSuccessMockDistrictRosterSyncStatusRepository()
                const organizationRepository = createSuccessMockOrganizationRepository()
                const studentGroupRepository = createSuccessMockStudentGroupRepository()
                const userRepository = createSuccessMockUserRepository()
                const administratorRepository = createSuccessMockAdministratorRepository()
                const teacherRepository = createSuccessMockTeacherRepository()
                const studentRepository = createSuccessMockStudentRepository()
                const administratorDistrictRepository = createSuccessMockAdministratorDistrictRepository()
                const teacherOrganizationRepository = createSuccessMockTeacherOrganizationRepository()
                const studentStudentGroupRepository = createSuccessMockStudentStudentGroupRepository()
                cleverDistrictAdministratorRepository.getDistrictAdministrator.mockReturnValue(Promise.resolve(successErrorable([])))
                cleverTeacherRepository.getCleverTeachers.mockReturnValue(Promise.resolve(successErrorable([])))
                cleverStudentRepository.getCleverStudents.mockReturnValue(Promise.resolve(successErrorable([])))
                studentGroupRepository.getAllByOrganizationId.mockReturnValue(Promise.resolve(successErrorable([])))
                userRepository.getByEmails.mockReturnValue(Promise.resolve(successErrorable([])))
                userRepository.getByIds.mockReturnValue(Promise.resolve(successErrorable([])))
                administratorRepository.getAllByDistrictId.mockReturnValue(Promise.resolve(successErrorable([])))
                administratorRepository.getAllByLmsId.mockReturnValue(Promise.resolve(successErrorable([])))
                teacherRepository.getAllByOrganizationId.mockReturnValue(Promise.resolve(successErrorable([])))
                teacherRepository.getAllByLmsId.mockReturnValue(Promise.resolve(successErrorable([])))
                studentRepository.getAllByStudentGroupId.mockReturnValue(Promise.resolve(successErrorable([])))
                studentRepository.getAllByLmsId.mockReturnValue(Promise.resolve(successErrorable([])))

                if (role === 'administrator') {
                  if (cleverUserEmail && cleverUserLmsId) {
                    cleverDistrictAdministratorRepository.getDistrictAdministrator.mockReturnValue(
                      Promise.resolve(
                        successErrorable([
                          {
                            firstName: 'districtAdministrator-firstName',
                            lastName: 'districtAdministrator-lastName',
                            email: cleverUserEmail,
                            administratorLMSId: cleverUserLmsId,
                          },
                        ]),
                      ),
                    )
                  }
                  if (codexUserEmail || codexUserLmsId) {
                    administratorRepository.getAllByLmsId.mockReturnValue(
                      Promise.resolve(
                        successErrorable([
                          {
                            id: 'id',
                            userId: 'userId',
                            firstName: 'firstName',
                            lastName: 'lastName',
                            administratorLMSId: codexUserLmsId,
                            classlinkTenantId: null,
                            isDeactivated: false,
                          },
                        ]),
                      ),
                    )
                  }
                }

                if (role === 'teacher') {
                  if (cleverUserEmail && cleverUserLmsId) {
                    cleverTeacherRepository.getCleverTeachers.mockReturnValue(
                      Promise.resolve(
                        successErrorable([
                          {
                            firstName: 'teacher-firstName-1',
                            lastName: 'teacher-lastName-1',
                            email: cleverUserEmail,
                            organizationLMSId: 'school-organizationLMSId-1',
                            teacherLMSId: cleverUserLmsId,
                          },
                        ]),
                      ),
                    )
                  }
                  if (codexUserEmail || codexUserLmsId) {
                    teacherRepository.getAllByLmsId.mockReturnValue(
                      Promise.resolve(
                        successErrorable([
                          {
                            id: 'teacherId',
                            userId: 'userId',
                            firstName: 'firstName',
                            lastName: 'lastName',
                            teacherLMSId: codexUserLmsId,
                            classlinkTenantId: null,
                            schoolAdministratorsName: undefined,
                            isDeactivated: false,
                          },
                        ]),
                      ),
                    )
                  }
                }
                if (role === 'student') {
                  if (cleverUserEmail && cleverUserLmsId) {
                    cleverStudentRepository.getCleverStudents.mockReturnValue(
                      Promise.resolve(
                        successErrorable([
                          {
                            nickName: 'student-nickName-1',
                            email: cleverUserEmail,
                            studentGroupsLMSId: ['section-studentGroupLMSId-1'],
                            studentLMSId: cleverUserLmsId,
                          },
                        ]),
                      ),
                    )
                  }
                  if (codexUserEmail || codexUserLmsId) {
                    studentRepository.getAllByLmsId.mockReturnValue(
                      Promise.resolve(
                        successErrorable([
                          {
                            id: 'id',
                            nickName: 'nickname',
                            userId: 'userId',
                            studentLMSId: codexUserLmsId,
                            classlinkTenantId: null,
                            isDeactivated: false,
                          },
                        ]),
                      ),
                    )
                  }
                }
                if (codexUserEmail || codexUserLmsId) {
                  userRepository.getByEmails.mockReturnValue(
                    Promise.resolve(
                      successErrorable([
                        {
                          id: 'userId',
                          role: role === 'administrator' ? 'teacher' : role,
                          loginId: undefined,
                          email: codexUserEmail ?? undefined,
                          isDeactivated: false,
                        },
                      ]),
                    ),
                  )
                  userRepository.getByIds.mockReturnValue(
                    Promise.resolve(
                      successErrorable([
                        {
                          id: 'userId',
                          role: role === 'administrator' ? 'teacher' : role,
                          loginId: undefined,
                          email: codexUserEmail ?? undefined,
                          isDeactivated: false,
                        },
                      ]),
                    ),
                  )
                }

                const result = await new CleverRosterSyncUseCase(
                  cleverRosterSyncRepository,
                  cleverDistrictRepository,
                  cleverSchoolRepository,
                  cleverSectionRepository,
                  cleverDistrictAdministratorRepository,
                  cleverTeacherRepository,
                  cleverStudentRepository,
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
                  'districtId',
                )
                expect(result.hasError).toEqual(false)
                expect(result.error).toBeNull()
                expect(result.value).toBeUndefined()
                if (expectedCRUD === 'C') {
                  expect(userRepository.createUsers.mock.calls).toEqual([
                    [
                      [
                        {
                          email: cleverUserEmail,
                          id: 'uuid',
                          isDeactivated: false,
                          role: role === 'administrator' ? 'teacher' : role,
                        },
                      ],
                    ],
                  ])
                  expect(userRepository.updateUsers.mock.calls).toEqual([[[]]])
                  expect(userRepository.deleteUsers.mock.calls).toEqual([[[]]])
                } else if (expectedCRUD === 'U') {
                  expect(userRepository.createUsers.mock.calls).toEqual([[[]]])
                  expect(userRepository.updateUsers.mock.calls).toEqual([
                    [
                      [
                        {
                          email: 'email1',
                          id: 'userId',
                          isDeactivated: false,
                          role: role === 'administrator' ? 'teacher' : role,
                        },
                      ],
                    ],
                  ])
                  expect(userRepository.deleteUsers.mock.calls).toEqual([[[]]])
                } else if (expectedCRUD === 'D') {
                  expect(userRepository.createUsers.mock.calls).toEqual([[[]]])
                  expect(userRepository.updateUsers.mock.calls).toEqual([[[]]])
                  expect(userRepository.deleteUsers.mock.calls).toEqual([[['userId']]])
                } else {
                  expect(userRepository.createUsers.mock.calls).toEqual([[[]]])
                  expect(userRepository.updateUsers.mock.calls).toEqual([[[]]])
                  expect(userRepository.deleteUsers.mock.calls).toEqual([[[]]])
                }
              },
            )
          })
        },
      )
    })
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
  const createSuccessMockCleverRosterSyncRepository = (): ICleverRosterSyncRepository => {
    return {
      getCleverAuthToken: async function (): Promise<Errorable<string, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: 'authToken',
        }
      },
    }
  }
  const createSuccessMockCleverDistrictRepository = (): ICleverDistrictRepository => {
    return {
      getDistrict: async function (): Promise<Errorable<CleverDistrict | null, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: {
            districtLMSId: 'district-districtLMSId',
            name: 'district-name',
          },
        }
      },
    }
  }
  const createSuccessMockCleverSchoolRepository = (): ICleverSchoolRepository => {
    return {
      getCleverSchools: async function (): Promise<Errorable<CleverSchool[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              name: 'school-name-1',
              districtLMSId: 'district-districtLMSId-1',
              organizationLMSId: 'school-organizationLMSId-1',
            },
            {
              name: 'school-name-2',
              districtLMSId: 'district-districtLMSId-2',
              organizationLMSId: 'school-organizationLMSId-2',
            },
          ],
        }
      },
    }
  }
  const createSuccessMockCleverSectionRepository = (): ICleverSectionRepository => {
    return {
      getCleverSections: async function (): Promise<Errorable<CleverSection[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              name: 'section-name-1',
              grade: 'section-grade-1',
              organizationLMSId: 'school-organizationLMSId-1',
              studentGroupLMSId: 'section-studentGroupLMSId-1',
            },
            {
              name: 'section-name-2',
              grade: 'section-grade-2',
              organizationLMSId: 'school-organizationLMSId-2',
              studentGroupLMSId: 'section-studentGroupLMSId-2',
            },
          ],
        }
      },
    }
  }
  const createSuccessMockCleverDistrictAdministratorRepository = () => {
    const repository: ICleverDistrictAdministratorRepository = {
      getDistrictAdministrator: async function (): Promise<Errorable<CleverDistrictAdministrator[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              firstName: 'districtAdministrator-firstName',
              lastName: 'districtAdministrator-lastName',
              email: 'districtAdministrator-email',
              administratorLMSId: 'districtAdministrator-administratorLMSId',
            },
          ],
        }
      },
    }
    return {
      getDistrictAdministrator: jest.fn(repository.getDistrictAdministrator),
    }
  }
  const createSuccessMockCleverTeacherRepository = () => {
    const repository: ICleverTeacherRepository = {
      getCleverTeachers: async function (): Promise<Errorable<CleverTeacher[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              firstName: 'teacher-firstName-1',
              lastName: 'teacher-lastName-1',
              email: 'teacher-email-1',
              organizationLMSId: 'school-organizationLMSId-1',
              teacherLMSId: 'teacher-teacherLMSId-1',
            },
            {
              firstName: 'teacher-firstName-2',
              lastName: 'teacher-lastName-2',
              email: 'teacher-email-2',
              organizationLMSId: 'school-organizationLMSId-1',
              teacherLMSId: 'teacher-teacherLMSId-2',
            },
            {
              firstName: 'teacher-firstName-2',
              lastName: 'teacher-lastName-2',
              email: 'teacher-email-2',
              organizationLMSId: 'school-organizationLMSId-2',
              teacherLMSId: 'teacher-teacherLMSId-2',
            },
          ],
        }
      },
    }
    return {
      getCleverTeachers: jest.fn(repository.getCleverTeachers),
    }
  }
  const createSuccessMockCleverStudentRepository = () => {
    const repository: ICleverStudentRepository = {
      getCleverStudents: async function (): Promise<Errorable<CleverStudent[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              nickName: 'student-nickName-1',
              email: 'student-email-1',
              studentGroupsLMSId: ['section-studentGroupLMSId-1'],
              studentLMSId: 'student-studentLMSId-1',
            },
            {
              nickName: 'student-nickName-2',
              email: 'student-email-2',
              studentGroupsLMSId: ['section-studentGroupLMSId-1', 'section-studentGroupLMSId-2'],
              studentLMSId: 'student-studentLMSId-2',
            },
          ],
        }
      },
    }
    return {
      getCleverStudents: jest.fn(repository.getCleverStudents),
    }
  }
  const createSuccessMockDistrictRepository = (): IDistrictRepository => {
    return {
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
            lmsId: 'clever',
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
  }
  const createSuccessMockDistrictRosterSyncStatusRepository = (): IDistrictRosterSyncStatusRepository => {
    return {
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
  }
})

describe('RequestCleverApisAndMapToSourceLmsEntites', () => {
  test('success', async () => {
    // Retrive Clever Entities
    const cleverRosterSyncRepository: ICleverRosterSyncRepository = {
      getCleverAuthToken: async function (): Promise<Errorable<string, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: 'authToken',
        }
      },
    }
    const cleverDistrictRepository: ICleverDistrictRepository = {
      getDistrict: async function (): Promise<Errorable<CleverDistrict | null, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: {
            districtLMSId: 'district-districtLMSId',
            name: 'district-name',
          },
        }
      },
    }
    const cleverSchoolRepository: ICleverSchoolRepository = {
      getCleverSchools: async function (): Promise<Errorable<CleverSchool[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              name: 'school-name-1',
              districtLMSId: 'district-districtLMSId-1',
              organizationLMSId: 'school-organizationLMSId-1',
            },
            {
              name: 'school-name-2',
              districtLMSId: 'district-districtLMSId-2',
              organizationLMSId: 'school-organizationLMSId-2',
            },
          ],
        }
      },
    }
    const cleverSectionRepository: ICleverSectionRepository = {
      getCleverSections: async function (): Promise<Errorable<CleverSection[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              name: 'section-name-1',
              grade: 'section-grade-1',
              organizationLMSId: 'school-organizationLMSId-1',
              studentGroupLMSId: 'section-studentGroupLMSId-1',
            },
            {
              name: 'section-name-2',
              grade: 'section-grade-2',
              organizationLMSId: 'school-organizationLMSId-2',
              studentGroupLMSId: 'section-studentGroupLMSId-2',
            },
          ],
        }
      },
    }
    const cleverDistrictAdministratorRepository: ICleverDistrictAdministratorRepository = {
      getDistrictAdministrator: async function (): Promise<Errorable<CleverDistrictAdministrator[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              firstName: 'districtAdministrator-firstName',
              lastName: 'districtAdministrator-lastName',
              email: 'districtAdministrator-email',
              administratorLMSId: 'districtAdministrator-administratorLMSId',
            },
          ],
        }
      },
    }
    const cleverTeacherRepository: ICleverTeacherRepository = {
      getCleverTeachers: async function (): Promise<Errorable<CleverTeacher[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              firstName: 'teacher-firstName-1',
              lastName: 'teacher-lastName-1',
              email: 'teacher-email-1',
              organizationLMSId: 'school-organizationLMSId-1',
              teacherLMSId: 'teacher-teacherLMSId-1',
            },
            {
              firstName: 'teacher-firstName-2',
              lastName: 'teacher-lastName-2',
              email: 'teacher-email-2',
              organizationLMSId: 'school-organizationLMSId-1',
              teacherLMSId: 'teacher-teacherLMSId-2',
            },
            {
              firstName: 'teacher-firstName-2',
              lastName: 'teacher-lastName-2',
              email: 'teacher-email-2',
              organizationLMSId: 'school-organizationLMSId-2',
              teacherLMSId: 'teacher-teacherLMSId-2',
            },
          ],
        }
      },
    }
    const cleverStudentRepository: ICleverStudentRepository = {
      getCleverStudents: async function (): Promise<Errorable<CleverStudent[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              nickName: 'student-nickName-1',
              email: 'student-email-1',
              studentGroupsLMSId: ['section-studentGroupLMSId-1'],
              studentLMSId: 'student-studentLMSId-1',
            },
            {
              nickName: 'student-nickName-2',
              email: 'student-email-2',
              studentGroupsLMSId: ['section-studentGroupLMSId-1', 'section-studentGroupLMSId-2'],
              studentLMSId: 'student-studentLMSId-2',
            },
          ],
        }
      },
    }

    const result = await new RequestCleverApisAndMapToSourceLmsEntites(
      cleverRosterSyncRepository,
      cleverDistrictRepository,
      cleverSchoolRepository,
      cleverSectionRepository,
      cleverDistrictAdministratorRepository,
      cleverTeacherRepository,
      cleverStudentRepository,
    ).run({
      id: 'district-id',
      name: 'district-name',
      lmsId: 'clever',
      districtLMSId: 'district-districtLMSId',
      classlinkAccessToken: null,
      classlinkAppId: null,
      classlinkTenantId: null,
      enableRosterSync: true,
    })
    if (result.hasError) {
      throw result
    }

    expect(result.value.allSourceLmsOrganizations).toEqual<typeof result.value.allSourceLmsOrganizations>([
      {
        name: 'school-name-1',
        organizationLMSId: 'school-organizationLMSId-1',
        districtId: 'district-id',
        classlinkTenantId: null,
      },
      {
        name: 'school-name-2',
        organizationLMSId: 'school-organizationLMSId-2',
        districtId: 'district-id',
        classlinkTenantId: null,
      },
    ])
    expect(result.value.allSourceLmsStudentGroups).toEqual<typeof result.value.allSourceLmsStudentGroups>([
      {
        name: 'section-name-1',
        grade: 'section-grade-1',
        studentGroupLmsId: 'section-studentGroupLMSId-1',
        organizationLMSId: 'school-organizationLMSId-1',
        classlinkTenantId: null,
      },
      {
        name: 'section-name-2',
        grade: 'section-grade-2',
        studentGroupLmsId: 'section-studentGroupLMSId-2',
        organizationLMSId: 'school-organizationLMSId-2',
        classlinkTenantId: null,
      },
    ])
    // All Administrators in Clever will be mapped to Teachers
    expect(result.value.allSourceLmsAdministrators).toEqual<typeof result.value.allSourceLmsAdministrators>([])
    expect(result.value.allSourceLmsTeachers).toEqual<typeof result.value.allSourceLmsTeachers>([
      //
      // From District Administrators
      //
      {
        role: 'teacher',
        firstName: 'districtAdministrator-firstName',
        lastName: 'districtAdministrator-lastName',
        email: 'districtAdministrator-email',
        teacherLMSId: 'districtAdministrator-administratorLMSId',
        isDeactivated: false,
        classlinkTenantId: null,
      },
      //
      // From Teachers
      //
      {
        role: 'teacher',
        firstName: 'teacher-firstName-1',
        lastName: 'teacher-lastName-1',
        email: 'teacher-email-1',
        teacherLMSId: 'teacher-teacherLMSId-1',
        isDeactivated: false,
        classlinkTenantId: null,
      },
      {
        role: 'teacher',
        firstName: 'teacher-firstName-2',
        lastName: 'teacher-lastName-2',
        email: 'teacher-email-2',
        teacherLMSId: 'teacher-teacherLMSId-2',
        isDeactivated: false,
        classlinkTenantId: null,
      },
    ])
    expect(result.value.allSourceLmsStudents).toEqual<typeof result.value.allSourceLmsStudents>([
      {
        role: 'student',
        nickName: 'student-nickName-1',
        email: 'student-email-1',
        studentLMSId: 'student-studentLMSId-1',
        isDeactivated: false,
        classlinkTenantId: null,
      },
      {
        role: 'student',
        nickName: 'student-nickName-2',
        email: 'student-email-2',
        studentLMSId: 'student-studentLMSId-2',
        isDeactivated: false,
        classlinkTenantId: null,
      },
    ])
    expect(result.value.allSourceLmsAdministratorDistricts).toEqual<typeof result.value.allSourceLmsAdministratorDistricts>([])
    expect(result.value.allSourceLmsTeacherOrganizations).toEqual<typeof result.value.allSourceLmsTeacherOrganizations>([
      {
        organizationLMSId: 'school-organizationLMSId-1',
        teacherLMSId: 'districtAdministrator-administratorLMSId',
      },
      {
        organizationLMSId: 'school-organizationLMSId-2',
        teacherLMSId: 'districtAdministrator-administratorLMSId',
      },
      {
        organizationLMSId: 'school-organizationLMSId-1',
        teacherLMSId: 'teacher-teacherLMSId-1',
      },
      {
        organizationLMSId: 'school-organizationLMSId-1',
        teacherLMSId: 'teacher-teacherLMSId-2',
      },
      {
        organizationLMSId: 'school-organizationLMSId-2',
        teacherLMSId: 'teacher-teacherLMSId-2',
      },
    ])
    expect(result.value.allSourceLmsStudentGroupStudents).toEqual<typeof result.value.allSourceLmsStudentGroupStudents>([
      {
        studentGroupLmsId: 'section-studentGroupLMSId-1',
        studentLMSId: 'student-studentLMSId-1',
      },
      {
        studentGroupLmsId: 'section-studentGroupLMSId-1',
        studentLMSId: 'student-studentLMSId-2',
      },
      {
        studentGroupLmsId: 'section-studentGroupLMSId-2',
        studentLMSId: 'student-studentLMSId-2',
      },
    ])
  })
})
