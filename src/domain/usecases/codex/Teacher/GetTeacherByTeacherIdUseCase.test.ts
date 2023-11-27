import { TeacherOrganization } from '../../../entities/codex/Teacher'

import { GetTeacherByTeacherIdUseCase, ITeacherRepository, IAdministratorRepository } from './GetTeacherByTeacherIdUseCase'
import { E, Errorable } from '../../shared/Errors'
import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'
import { UserRoles } from '../../shared/Constants'

const VALID_TEACHER_ID = 'bc99b02f-e9a4-4531-85ef-a0c3a224a257'
const INVALID_TEACHER_ID = 'organization-id-00001'
const TEACHER_ORGANIZATION: TeacherOrganization = {
  firstName: 'anuj',
  organizationId: '7289c5e6-d7a8-423c-8161-6530abccd81c',
  lastName: 'pal',
  teacherId: 'teacherId-1',
  districtId: 'district-1',
  userId: 'f705706f-544a-42e7-90da-a2bddbf66d45',
  teacherLMSId: 'teacher-lms-id-1',
  createdUserId: 'user123',
  email: 'demo@gmail.com',
  isPrimary: true,
  createdDate: '2011-10-05T14:48:00.000Z',
  teacherOrganizations: [
    { id: '1', name: 'organization1' },
    {
      id: '2',
      name: 'organization2',
    },
  ],
}
const ADMINISTRATOR_RESULT: DistrictAdministrator = {
  administratorId: 'test_administratorId_1 administrator_id_1',
  userId: '8f824715-b316-43ea-8a4d-2cb3c78a6c47',
  email: 'test_email_1 email',
  firstName: 'test_firstName_1 first_name',
  lastName: 'test_lastName_1 last_name',
  administratorLMSId: 'test_administratorLMSId_1',
  createdUserId: 'test_createdUserId_1',
  createdDate: 'test_createdDate_1',
  districtId: 'test_districtId_1',
}

describe('test GetTeacherByTeacherIdUseCase', () => {
  test('test GetTeacherByTeacherIdUseCase - success', async () => {
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_ORGANIZATION,
        }
      }),
      getTeacherByUserId: jest.fn(async function (): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_ORGANIZATION,
        }
      }),
    }

    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: ADMINISTRATOR_RESULT,
        }
      }),
    }
    const usecase = new GetTeacherByTeacherIdUseCase(administratorRepository, teacherRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: UserRoles.internalOperator,
      },
      VALID_TEACHER_ID,
    )

    expect(result.hasError).toEqual(false)

    const getTeacherByTeacherIdSpy = teacherRepository.getTeacherByTeacherId as jest.Mock

    expect(getTeacherByTeacherIdSpy.mock.calls).toEqual([[VALID_TEACHER_ID]])
    expect(result.value).toEqual(TEACHER_ORGANIZATION)
  })

  test('When teacher repository returns runtime error', async () => {
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
      getTeacherByUserId: jest.fn(async function (): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
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
    const usecase = new GetTeacherByTeacherIdUseCase(administratorRepository, teacherRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: UserRoles.internalOperator,
      },
      VALID_TEACHER_ID,
    )

    expect(result.hasError).toEqual(true)

    const getTeachersSpy = teacherRepository.getTeacherByTeacherId as jest.Mock

    expect(getTeachersSpy.mock.calls).toEqual([[VALID_TEACHER_ID]])
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('User role is not internal operator or administrator or teacher - permission denied', async () => {
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherByUserId: jest.fn(async function (): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
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
    const usecase = new GetTeacherByTeacherIdUseCase(administratorRepository, teacherRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: UserRoles.student,
      },
      VALID_TEACHER_ID,
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('When provided invalid teacherid returns invalid error', async () => {
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
      getTeacherByUserId: jest.fn(async function (): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
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

    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new GetTeacherByTeacherIdUseCase(administratorRepository, teacherRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: UserRoles.internalOperator,
      },
      INVALID_TEACHER_ID,
    )

    expect(result.hasError).toEqual(true)

    const getTeachersSpy = teacherRepository.getTeacherByTeacherId as jest.Mock

    expect(getTeachersSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('InvalidTeacherId')
    expect(result.error?.message).toEqual('Invalid teacherId.')
    expect(result.value).toEqual(null)
  })

  test('When provided teacher is not found', async () => {
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByUserId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
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
    const usecase = new GetTeacherByTeacherIdUseCase(administratorRepository, teacherRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: UserRoles.teacher,
      },
      VALID_TEACHER_ID,
    )

    const getTeachersSpy = teacherRepository.getTeacherByTeacherId as jest.Mock

    expect(getTeachersSpy.mock.calls).toEqual([[VALID_TEACHER_ID]])
    expect(result.hasError).toEqual(true)
    expect(result.error).toEqual({
      message: `The specified teacher not found for ${VALID_TEACHER_ID}`,
      type: 'TeacherNotFound',
    })
    expect(result.value).toEqual(null)
  })

  test('When  teacher is not found from userId', async () => {
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherByUserId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
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
    const usecase = new GetTeacherByTeacherIdUseCase(administratorRepository, teacherRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: UserRoles.teacher,
      },
      VALID_TEACHER_ID,
    )

    const getTeachersSpy = teacherRepository.getTeacherByTeacherId as jest.Mock

    expect(getTeachersSpy.mock.calls).toEqual([[VALID_TEACHER_ID]])
    expect(result.hasError).toEqual(true)
    // expect(result.error).toEqual({
    //   message: `The specified teacher not found for ${VALID_TEACHER_ID}`,
    //   type: 'TeacherNotFound',
    // })
    expect(result.value).toEqual(null)
  })

  test('When administrator is not found', async () => {
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherByUserId: jest.fn(async function (): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
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
    const usecase = new GetTeacherByTeacherIdUseCase(administratorRepository, teacherRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: UserRoles.administrator,
      },
      VALID_TEACHER_ID,
    )
    const getTeachersSpy = teacherRepository.getTeacherByTeacherId as jest.Mock

    expect(getTeachersSpy.mock.calls).toEqual([[VALID_TEACHER_ID]])

    const administratorResult = administratorRepository.getDistrictAdministratorByUserId as jest.Mock

    expect(administratorResult.mock.calls).toEqual([['requested-user-id']])
    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('AdministratorNotFound')
  })

  test('When fail to load administrator data', async () => {
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherByUserId: jest.fn(async function (): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
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
    const usecase = new GetTeacherByTeacherIdUseCase(administratorRepository, teacherRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: UserRoles.administrator,
      },
      VALID_TEACHER_ID,
    )
    const getTeachersSpy = teacherRepository.getTeacherByTeacherId as jest.Mock
    const administratorResult = administratorRepository.getDistrictAdministratorByUserId as jest.Mock

    expect(administratorResult.mock.calls).toEqual([['requested-user-id']])
    expect(getTeachersSpy.mock.calls).toEqual([[VALID_TEACHER_ID]])
    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
  })

  test("When teacher's repository giving runtime error", async () => {
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherByUserId: jest.fn(async function (): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
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
    const usecase = new GetTeacherByTeacherIdUseCase(administratorRepository, teacherRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: UserRoles.teacher,
      },
      VALID_TEACHER_ID,
    )
    const getTeachersSpy = teacherRepository.getTeacherByTeacherId as jest.Mock
    const administratorResult = administratorRepository.getDistrictAdministratorByUserId as jest.Mock

    // expect(administratorResult.mock.calls).toEqual([])
    expect(getTeachersSpy.mock.calls).toEqual([[VALID_TEACHER_ID]])
    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
  })

  test('When administrator is not from the same district id as organzation', async () => {
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {
            districtId: 'test_districtId_2',
          } as TeacherOrganization,
        }
      }),
      getTeacherByUserId: jest.fn(async function (): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
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
    const usecase = new GetTeacherByTeacherIdUseCase(administratorRepository, teacherRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: UserRoles.administrator,
      },

      VALID_TEACHER_ID,
    )
    const getTeachersSpy = teacherRepository.getTeacherByTeacherId as jest.Mock
    const administratorResult = administratorRepository.getDistrictAdministratorByUserId as jest.Mock

    expect(administratorResult.mock.calls).toEqual([['requested-user-id']])
    expect(getTeachersSpy.mock.calls).toEqual([[VALID_TEACHER_ID]])
    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('PermissionDenied')
  })

  test(" Teacher cannot see another teacher's details", async () => {
    const teacherRepository: ITeacherRepository = {
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
      getTeacherByUserId: jest.fn(async function (): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: TEACHER_ORGANIZATION,
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
    const usecase = new GetTeacherByTeacherIdUseCase(administratorRepository, teacherRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: UserRoles.teacher,
      },
      VALID_TEACHER_ID,
    )
    const getTeacherSpy = teacherRepository.getTeacherByTeacherId as jest.Mock

    expect(getTeacherSpy.mock.calls).toEqual([[VALID_TEACHER_ID]])

    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([['requested-user-id']])
    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('PermissionDenied')
  })
})
