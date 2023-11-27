import { TeacherOrganization, Teachers } from '../../../entities/codex/Teacher'
import { GetTeachersUseCase, ITeacherRepository, IOrganizationRepository, IAdministratorRepository } from './GetTeachersUseCase'
import { E, Errorable } from '../../shared/Errors'
import { Organizations } from '../../../entities/codex/Organization'
import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'

const VALID_ORGANIZATION_ID = '5d2a80cc-7bd6-443b-8296-a0e8bab8261a'
const INVALID_ORGANIZATION_ID = 'organization-id-00001'
const VALID_TEACHER_IDS = ['teacher-id-success-1', 'teacher-id-success-2']

describe('test GetTeachersUseCase', () => {
  test('test GetTeachersUseCase - success', async () => {
    const teacherRepository: ITeacherRepository = {
      getTeachers: jest.fn(async function (): Promise<Errorable<Teachers[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'teacher-id-success-1',
              email: 'teacher1@email.com',
              firstName: 'teacher_first_name_1',
              lastName: 'teacher_last_name_1',
              teacherLMSId: 'teacher_lms_id_1',
              createdUserId: 'user-id-1',
              createdUserFirstName: 'user_first_name_1',
              createdUserLastName: 'user_last_name_1',
              createdDate: 'teacher-created-date-success-1',
            },
            {
              id: 'teacher-id-success-2',
              email: 'teacher2@email.com',
              firstName: 'teacher_first_name_2',
              lastName: 'teacher_last_name_2',
              teacherLMSId: 'teacher_lms_id_2',
              createdUserId: 'user-id-2',
              createdUserFirstName: 'user_first_name_2',
              createdUserLastName: 'user_last_name_2',
              createdDate: 'teacher-created-date-success-2',
            },
          ],
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            administratorId: 'test_administratorId_1 administrator_id_1',
            userId: '8f824715-b316-43ea-8a4d-2cb3c78a6c47',
            email: 'test_email_1 email',
            firstName: 'test_firstName_1 first_name',
            lastName: 'test_lastName_1 last_name',
            administratorLMSId: 'test_administratorLMSId_1',
            createdUserId: 'test_createdUserId_1',
            createdDate: 'test_createdDate_1',
            districtId: 'test_districtId_1',
          },
        }
      }),
    }
    const usecase = new GetTeachersUseCase(teacherRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_ORGANIZATION_ID,
      VALID_TEACHER_IDS,
    )

    expect(result.hasError).toEqual(false)

    const getTeachersSpy = teacherRepository.getTeachers as jest.Mock

    expect(getTeachersSpy.mock.calls).toEqual([[VALID_ORGANIZATION_ID, VALID_TEACHER_IDS, 'internalOperator']])
    expect(result.value).toEqual([
      {
        id: 'teacher-id-success-1',
        email: 'teacher1@email.com',
        firstName: 'teacher_first_name_1',
        lastName: 'teacher_last_name_1',
        teacherLMSId: 'teacher_lms_id_1',
        createdUserId: 'user-id-1',
        createdUserFirstName: 'user_first_name_1',
        createdUserLastName: 'user_last_name_1',
        createdDate: 'teacher-created-date-success-1',
      },
      {
        id: 'teacher-id-success-2',
        email: 'teacher2@email.com',
        firstName: 'teacher_first_name_2',
        lastName: 'teacher_last_name_2',
        teacherLMSId: 'teacher_lms_id_2',
        createdUserId: 'user-id-2',
        createdUserFirstName: 'user_first_name_2',
        createdUserLastName: 'user_last_name_2',
        createdDate: 'teacher-created-date-success-2',
      },
    ] as Teachers[])
  })

  test('When teacher repository returns runtime error', async () => {
    const teacherRepository: ITeacherRepository = {
      getTeachers: jest.fn(async function (): Promise<Errorable<Teachers[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            administratorId: 'test_administratorId_1 administrator_id_1',
            userId: '8f824715-b316-43ea-8a4d-2cb3c78a6c47',
            email: 'test_email_1 email',
            firstName: 'test_firstName_1 first_name',
            lastName: 'test_lastName_1 last_name',
            administratorLMSId: 'test_administratorLMSId_1',
            createdUserId: 'test_createdUserId_1',
            createdDate: 'test_createdDate_1',
            districtId: 'test_districtId_1',
          },
        }
      }),
    }
    const usecase = new GetTeachersUseCase(teacherRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_ORGANIZATION_ID,
      VALID_TEACHER_IDS,
    )

    expect(result.hasError).toEqual(true)

    const getTeachersSpy = teacherRepository.getTeachers as jest.Mock

    expect(getTeachersSpy.mock.calls).toEqual([[VALID_ORGANIZATION_ID, VALID_TEACHER_IDS, 'internalOperator']])
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('When fail to get teachers data', async () => {
    const teacherRepository: ITeacherRepository = {
      getTeachers: jest.fn(async function (): Promise<Errorable<Teachers[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new GetTeachersUseCase(teacherRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_ORGANIZATION_ID,
      VALID_TEACHER_IDS,
    )

    expect(result.hasError).toEqual(true)

    const getTeachersSpy = teacherRepository.getTeachers as jest.Mock

    expect(getTeachersSpy.mock.calls).toEqual([[VALID_ORGANIZATION_ID, VALID_TEACHER_IDS, 'internalOperator']])
    expect(result.value).toEqual(null)
  })

  test('When provided organization is not found', async () => {
    const teacherRepository: ITeacherRepository = {
      getTeachers: jest.fn(async function (): Promise<Errorable<Teachers[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new GetTeachersUseCase(teacherRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_ORGANIZATION_ID,
      VALID_TEACHER_IDS,
    )

    expect(result.hasError).toEqual(true)

    const getTeachersSpy = teacherRepository.getTeachers as jest.Mock

    expect(getTeachersSpy.mock.calls).toEqual([])
    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('OrganizationNotFound')
    expect(result.error?.message).toEqual(`The specified organization not found for ${VALID_ORGANIZATION_ID}`)
  })

  test('When fail to get organization data', async () => {
    const teacherRepository: ITeacherRepository = {
      getTeachers: jest.fn(async function (): Promise<Errorable<Teachers[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unknown error',
          },
          value: null,
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new GetTeachersUseCase(teacherRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_ORGANIZATION_ID,
      VALID_TEACHER_IDS,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.error?.message).toContain(`failed to getOrganizationById ${VALID_ORGANIZATION_ID}`)
  })

  test('User role is not internal operator or administrator or teacher - permission denied', async () => {
    const teacherRepository: ITeacherRepository = {
      getTeachers: jest.fn(async function (): Promise<Errorable<Teachers[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new GetTeachersUseCase(teacherRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'student',
      },
      VALID_ORGANIZATION_ID,
      VALID_TEACHER_IDS,
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('When provided invalid organizationId returns invalid error', async () => {
    const teacherRepository: ITeacherRepository = {
      getTeachers: jest.fn(async function (): Promise<Errorable<Teachers[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new GetTeachersUseCase(teacherRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      INVALID_ORGANIZATION_ID,
      VALID_TEACHER_IDS,
    )

    expect(result.hasError).toEqual(true)

    const getTeachersSpy = teacherRepository.getTeachers as jest.Mock

    expect(getTeachersSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('InvalidOrganizationId')
    expect(result.error?.message).toEqual('Invalid organizationId')
    expect(result.value).toEqual(null)
  })

  test('When provided teacher is not found', async () => {
    const teacherRepository: ITeacherRepository = {
      getTeachers: jest.fn(async function (): Promise<Errorable<Teachers[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new GetTeachersUseCase(teacherRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_ORGANIZATION_ID,
      VALID_TEACHER_IDS,
    )

    expect(result.hasError).toEqual(true)
    expect(result.error).toEqual({
      message: `The specified teacher not found for ${VALID_ORGANIZATION_ID}`,
      type: 'TeacherNotFound',
    })

    const getTeachersSpy = teacherRepository.getTeachers as jest.Mock

    expect(getTeachersSpy.mock.calls).toEqual([[VALID_ORGANIZATION_ID, VALID_TEACHER_IDS, 'internalOperator']])
    expect(result.value).toEqual(null)
  })

  test('When administrator is not found', async () => {
    const teacherRepository: ITeacherRepository = {
      getTeachers: jest.fn(async function (): Promise<Errorable<Teachers[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new GetTeachersUseCase(teacherRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'administrator',
      },
      VALID_ORGANIZATION_ID,
      VALID_TEACHER_IDS,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error).toEqual({
      message: `The specified administrator not found for requested-user-id`,
      type: 'AdministratorNotFound',
    })
  })

  test('When fail to load administrator data', async () => {
    const teacherRepository: ITeacherRepository = {
      getTeachers: jest.fn(async function (): Promise<Errorable<Teachers[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something went wrong',
          },
          value: null,
        }
      }),
    }
    const usecase = new GetTeachersUseCase(teacherRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'administrator',
      },
      VALID_ORGANIZATION_ID,
      VALID_TEACHER_IDS,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.error?.message).toContain('Failed to getDistrictAdministratorByUserId requested-user-id')
  })

  test('When administrator is not from the same district id as organzation', async () => {
    const teacherRepository: ITeacherRepository = {
      getTeachers: jest.fn(async function (): Promise<Errorable<Teachers[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            administratorId: 'test_administratorId_1 administrator_id_1',
            userId: '8f824715-b316-43ea-8a4d-2cb3c78a6c48',
            email: 'test_email_1 email',
            firstName: 'test_firstName_1 first_name',
            lastName: 'test_lastName_1 last_name',
            administratorLMSId: 'test_administratorLMSId_1',
            createdUserId: 'test_createdUserId_1',
            createdDate: 'test_createdDate_1',
            districtId: 'test_districtId_1',
          },
        }
      }),
    }
    const usecase = new GetTeachersUseCase(teacherRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'administrator',
      },
      VALID_ORGANIZATION_ID,
      VALID_TEACHER_IDS,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.error?.message).toEqual('The user does not have permission to view teacher information for organization id')
  })

  test('Teacher can see all teachers of his organizations only', async () => {
    const teacherRepository: ITeacherRepository = {
      getTeachers: jest.fn(async function (): Promise<Errorable<Teachers[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            teacherOrganizations: [{ name: 'Rcb', id: 'organization-1' }],
          } as TeacherOrganization,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new GetTeachersUseCase(teacherRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'teacher',
      },
      VALID_ORGANIZATION_ID,
      VALID_TEACHER_IDS,
    )
    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([['requested-user-id']])
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('When teacher repository getTeacherByUserId method returns teacher not found error', async () => {
    const teacherRepository: ITeacherRepository = {
      getTeachers: jest.fn(async function (): Promise<Errorable<Teachers[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new GetTeachersUseCase(teacherRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'teacher',
      },
      VALID_ORGANIZATION_ID,
      VALID_TEACHER_IDS,
    )
    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([['requested-user-id']])
    expect(result.error?.type).toEqual('TeacherNotFound')
    expect(result.value).toEqual(null)
  })

  test('When teacher repository getTeacherByUserId method returns runtime error', async () => {
    const teacherRepository: ITeacherRepository = {
      getTeachers: jest.fn(async function (): Promise<Errorable<Teachers[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new GetTeachersUseCase(teacherRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'teacher',
      },
      VALID_ORGANIZATION_ID,
      VALID_TEACHER_IDS,
    )
    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([['requested-user-id']])
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('When teacher repository returns runtime error', async () => {
    const teacherRepository: ITeacherRepository = {
      getTeachers: jest.fn(async function (): Promise<Errorable<Teachers[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new GetTeachersUseCase(teacherRepository, organizationRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_ORGANIZATION_ID,
      VALID_TEACHER_IDS,
    )

    expect(result.hasError).toEqual(true)

    const getTeachersSpy = teacherRepository.getTeachers as jest.Mock

    expect(getTeachersSpy.mock.calls).toEqual([[VALID_ORGANIZATION_ID, VALID_TEACHER_IDS, 'internalOperator']])
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })
})
