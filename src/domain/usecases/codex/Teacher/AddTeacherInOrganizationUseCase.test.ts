import { TeacherOrganization } from '../../../entities/codex/Teacher'
import { AddTeacherInOrganizationUseCase, ITeacherRepository, IOrganizationRepository } from './AddTeacherInOrganizationUseCase'
import { E, Errorable } from '../../shared/Errors'
import { Organizations } from '../../../entities/codex/Organization'

const VALID_TEACHER_ID = '10dc3c1a-ddda-46f1-90b1-8f982dcd54f7'
const INVALID_TEACHER_ID = 'district-id-00001'
const VALID_ORGANIZATION_ID = 'b9484b02-2d71-4b3f-afb0-57057843a59d'
const INVALID_ORGANIZATION_ID = 'organization-id-00001'

describe('Test AddTeacherInOrganizationUseCase', () => {
  test('Test AddTeacherInOrganizationUseCase - success', async () => {
    const teacherRepository: ITeacherRepository = {
      addTeacherInOrganization: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
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
    const usecase = new AddTeacherInOrganizationUseCase(teacherRepository, organizationRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_TEACHER_ID,
    )

    expect(result.hasError).toEqual(false)

    const addTeacherInOrganizationSpy = teacherRepository.addTeacherInOrganization as jest.Mock

    expect(addTeacherInOrganizationSpy.mock.calls).toEqual([[VALID_ORGANIZATION_ID, VALID_TEACHER_ID, 'requested-user-id']])
    expect(result.value).toEqual(undefined)
    expect(result.error).toEqual(null)
  })

  test('When teacher repository returns runtime error', async () => {
    const teacherRepository: ITeacherRepository = {
      addTeacherInOrganization: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
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
    const usecase = new AddTeacherInOrganizationUseCase(teacherRepository, organizationRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_TEACHER_ID,
    )

    expect(result.hasError).toEqual(true)

    const addTeacherInOrganizationSpy = teacherRepository.addTeacherInOrganization as jest.Mock

    expect(addTeacherInOrganizationSpy.mock.calls).toEqual([[VALID_ORGANIZATION_ID, VALID_TEACHER_ID, 'requested-user-id']])
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('User role is not internal operator or administrator - permission denied', async () => {
    const teacherRepository: ITeacherRepository = {
      addTeacherInOrganization: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
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
    const usecase = new AddTeacherInOrganizationUseCase(teacherRepository, organizationRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'student',
      },
      VALID_TEACHER_ID,
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.error?.message).toEqual('The token does not have permission to add the specified teacher into organization.')
    expect(result.value).toEqual(null)
  })

  test('When provided invalid organizationId returns invalid error', async () => {
    const teacherRepository: ITeacherRepository = {
      addTeacherInOrganization: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
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
    const usecase = new AddTeacherInOrganizationUseCase(teacherRepository, organizationRepository)
    const result = await usecase.run(
      INVALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_TEACHER_ID,
    )

    expect(result.hasError).toEqual(true)

    const addTeacherInOrganizationSpy = teacherRepository.addTeacherInOrganization as jest.Mock

    expect(addTeacherInOrganizationSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('InvalidOrganizationId')
    expect(result.error?.message).toEqual('Invalid organizationId')
    expect(result.value).toEqual(null)
  })

  test('When provided invalid teacherId returns invalid error', async () => {
    const teacherRepository: ITeacherRepository = {
      addTeacherInOrganization: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
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
    const usecase = new AddTeacherInOrganizationUseCase(teacherRepository, organizationRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      INVALID_TEACHER_ID,
    )

    expect(result.hasError).toEqual(true)

    const addTeacherInOrganizationSpy = teacherRepository.addTeacherInOrganization as jest.Mock

    expect(addTeacherInOrganizationSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('InvalidTeacherId')
    expect(result.error?.message).toEqual('Invalid teacherId')
    expect(result.value).toEqual(null)
  })

  test('When provied organization is not found', async () => {
    const teacherRepository: ITeacherRepository = {
      addTeacherInOrganization: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'Organization not found',
          },
          value: null,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
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
    const usecase = new AddTeacherInOrganizationUseCase(teacherRepository, organizationRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_TEACHER_ID,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)

    const addTeacherInOrganizationSpy = teacherRepository.addTeacherInOrganization as jest.Mock

    expect(addTeacherInOrganizationSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('OrganizationNotFound')
    expect(result.error?.message).toEqual(`The specified organization not found for '${VALID_ORGANIZATION_ID}'`)
  })

  test('When provied teacher is not found', async () => {
    const teacherRepository: ITeacherRepository = {
      addTeacherInOrganization: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const usecase = new AddTeacherInOrganizationUseCase(teacherRepository, organizationRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_TEACHER_ID,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)

    const addTeacherInOrganizationSpy = teacherRepository.addTeacherInOrganization as jest.Mock

    expect(addTeacherInOrganizationSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('TeacherNotFound')
    expect(result.error?.message).toEqual(`The specified teacher not found for ${VALID_TEACHER_ID}`)
  })

  test('When provied teacher is already exists', async () => {
    const teacherRepository: ITeacherRepository = {
      addTeacherInOrganization: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            teacherId: '10dc3c1a-ddda-46f1-90b1-8f982dcd54f7',
            userId: '8f824715-b316-43ea-8a4d-2cb3c78a6c47',
            organizationId: 'b9484b02-2d71-4b3f-afb0-57057843a59d',
            districtId: 'e4f2f9c0-6583-4665-afe6-1e103aa73e50',
            email: 'test_email_1 email',
            firstName: 'test_firstName_1 first_name',
            lastName: 'test_lastName_1 last_name',
            teacherLMSId: 'test_teacherLMSId_1',
            isPrimary: false,
            createdUserId: 'test_createdUserId_1',
            createdDate: 'test_createdDate_1',
            teacherOrganizations: [
              {
                id: VALID_ORGANIZATION_ID,
              },
            ],
          } as TeacherOrganization,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            districtId: 'e4f2f9c0-6583-4665-afe6-1e103aa73e50',
          } as Organizations,
        }
      }),
    }
    const usecase = new AddTeacherInOrganizationUseCase(teacherRepository, organizationRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_TEACHER_ID,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)

    const addTeacherInOrganizationSpy = teacherRepository.addTeacherInOrganization as jest.Mock

    expect(addTeacherInOrganizationSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('TeacherAlreadyExists')
    expect(result.error?.message).toEqual(`Teacher already associate with the Organization`)
  })

  test('When fail to get organization data', async () => {
    const teacherRepository: ITeacherRepository = {
      addTeacherInOrganization: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
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
    const usecase = new AddTeacherInOrganizationUseCase(teacherRepository, organizationRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_TEACHER_ID,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.error?.message).toContain(`failed to getOrganizationById '${VALID_ORGANIZATION_ID}'`)
  })

  test('When teacher repository not fetch data', async () => {
    const teacherRepository: ITeacherRepository = {
      addTeacherInOrganization: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
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
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as Organizations,
        }
      }),
    }
    const usecase = new AddTeacherInOrganizationUseCase(teacherRepository, organizationRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_TEACHER_ID,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
  })

  test('When organization is not from the same district id as teacher', async () => {
    const teacherRepository: ITeacherRepository = {
      addTeacherInOrganization: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            teacherId: '10dc3c1a-ddda-46f1-90b1-8f982dcd54f7',
            userId: '8f824715-b316-43ea-8a4d-2cb3c78a6c47',
            organizationId: "947166b4-e843-4e80-81b1-96acb70c5a50'",
            districtId: 'e4f2f9c0-6583-4665-afe6-1e103aa73e50',
            email: 'test_email_1 email',
            firstName: 'test_firstName_1 first_name',
            lastName: 'test_lastName_1 last_name',
            teacherLMSId: 'test_teacherLMSId_1',
            isPrimary: false,
            createdUserId: 'test_createdUserId_1',
            createdDate: 'test_createdDate_1',
          } as TeacherOrganization,
        }
      }),
    }
    const organizationRepository: IOrganizationRepository = {
      getOrganizationById: jest.fn(async function (): Promise<Errorable<Organizations | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'test_id_1',
            name: 'test_name_1',
            districtId: 'test_districtId_2',
            stateId: 'test_stateId_1',
            organizationLMSId: 'test_organizationLMSId_1',
            createdUserId: 'test_createdUserId_1',
            createdDate: 'test_createdDate_1',
            updatedDate: 'test_updatedDate_1',
          } as Organizations,
        }
      }),
    }
    const usecase = new AddTeacherInOrganizationUseCase(teacherRepository, organizationRepository)
    const result = await usecase.run(
      VALID_ORGANIZATION_ID,
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_TEACHER_ID,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.error?.message).toEqual('Access Denied')
  })
})
