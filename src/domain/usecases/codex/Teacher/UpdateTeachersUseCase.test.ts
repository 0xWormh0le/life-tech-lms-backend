import { TeacherOrganization, UpdateTeacher } from '../../../entities/codex/Teacher'
import { UpdateTeacherUseCase, ITeacherRepository, IAdministratorRepository } from './UpdateTeachersUseCase'
import { E, Errorable } from '../../shared/Errors'
import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'

const VALID_TEACHER_ID = '10dc3c1a-ddda-46f1-90b1-8f982dcd54f7'
const INVALID_TEACHER_ID = 'district-id-00001'
const VALID_USER_ID = '8f824715-b316-43ea-8a4d-2cb3c78a6c47'
const VALID_INPUT_DATA: UpdateTeacher = {
  firstName: 'test1',
  lastName: 'teacher1',
  teacherLMSId: '1',
  email: 'teacher@gmail.com',
}
const INVALID_INPUT_DATA: UpdateTeacher = {
  firstName: 'test1',
  lastName: 'teacher1',
  teacherLMSId: '1',
  email: 'testgmail.com',
}

describe('Test UpdateTeacherUseCase', () => {
  test('Test UpdateTeacherUseCase - success', async () => {
    const teacherRepository: ITeacherRepository = {
      updateTeacherById: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'EmailAlreadyExists'>>> {
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
            teacherLMSId: '1',
            isPrimary: false,
            createdUserId: 'test_createdUserId_1',
            createdDate: 'test_createdDate_1',
          },
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
    const usecase = new UpdateTeacherUseCase(teacherRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_TEACHER_ID,
      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(false)

    const updateTeacherSpy = teacherRepository.updateTeacherById as jest.Mock

    expect(updateTeacherSpy.mock.calls).toEqual([
      [
        '10dc3c1a-ddda-46f1-90b1-8f982dcd54f7',
        '8f824715-b316-43ea-8a4d-2cb3c78a6c47',
        {
          email: 'teacher@gmail.com',
          firstName: 'test1',
          lastName: 'teacher1',
          teacherLMSId: '1',
        },
      ],
    ])
    expect(result.error).toEqual(null)
    expect(result.value).toEqual(undefined)
  })

  test('Test UpdateTeacherUseCase for teacher itself - success', async () => {
    const teacherRepository: ITeacherRepository = {
      updateTeacherById: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'EmailAlreadyExists'>>> {
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
            firstName: 'test1',
            lastName: 'teacher1',
            teacherLMSId: '1',
            isPrimary: false,
            createdUserId: 'test_createdUserId_1',
            createdDate: 'test_createdDate_1',
          },
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
            email: 'teacher@gmail.com',
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
    const usecase = new UpdateTeacherUseCase(teacherRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: '8f824715-b316-43ea-8a4d-2cb3c78a6c47',
        loginId: 'teacher1',
        role: 'teacher',
      },
      VALID_TEACHER_ID,
      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(false)

    const updateTeacherSpy = teacherRepository.updateTeacherById as jest.Mock

    expect(updateTeacherSpy.mock.calls).toEqual([
      [
        '10dc3c1a-ddda-46f1-90b1-8f982dcd54f7',
        '8f824715-b316-43ea-8a4d-2cb3c78a6c47',
        {
          email: 'teacher@gmail.com',
          firstName: 'test1',
          lastName: 'teacher1',
        },
      ],
    ])
    expect(result.error).toEqual(null)
    expect(result.value).toEqual(undefined)
  })

  test('When teacher repository returns runtime error', async () => {
    const teacherRepository: ITeacherRepository = {
      updateTeacherById: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'EmailAlreadyExists'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
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
            teacherLMSId: '1',
            isPrimary: false,
            createdUserId: 'test_createdUserId_1',
            createdDate: 'test_createdDate_1',
          },
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
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
    const usecase = new UpdateTeacherUseCase(teacherRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_TEACHER_ID,
      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)

    const updateTeacherSpy = teacherRepository.updateTeacherById as jest.Mock

    expect(updateTeacherSpy.mock.calls).toEqual([
      [
        '10dc3c1a-ddda-46f1-90b1-8f982dcd54f7',
        '8f824715-b316-43ea-8a4d-2cb3c78a6c47',
        {
          email: 'teacher@gmail.com',
          firstName: 'test1',
          lastName: 'teacher1',
        },
      ],
    ])
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('When teacher repository not fetch data', async () => {
    const teacherRepository: ITeacherRepository = {
      updateTeacherById: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'EmailAlreadyExists'>>> {
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
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new UpdateTeacherUseCase(teacherRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_TEACHER_ID,
      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('When provided invalid teacherId returns invalid error', async () => {
    const teacherRepository: ITeacherRepository = {
      updateTeacherById: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'EmailAlreadyExists'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new UpdateTeacherUseCase(teacherRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      INVALID_TEACHER_ID,
      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)

    const updateTeacherSpy = teacherRepository.updateTeacherById as jest.Mock

    expect(updateTeacherSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('InvalidTeacherId')
    expect(result.error?.message).toEqual('teacherId is invalid')
    expect(result.value).toEqual(null)
  })

  test('When provided invalid email returns invalid email error', async () => {
    const teacherRepository: ITeacherRepository = {
      updateTeacherById: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'EmailAlreadyExists'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new UpdateTeacherUseCase(teacherRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_TEACHER_ID,
      INVALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)

    const updateTeacherSpy = teacherRepository.updateTeacherById as jest.Mock

    expect(updateTeacherSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('InvalidEmail')
    expect(result.error?.message).toEqual('Invalid email is provided')
    expect(result.value).toEqual(null)
  })

  test('User role is not internal operator - permission denied', async () => {
    const teacherRepository: ITeacherRepository = {
      updateTeacherById: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'EmailAlreadyExists'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new UpdateTeacherUseCase(teacherRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'student',
      },
      VALID_TEACHER_ID,
      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.error?.message).toEqual('The user does not have permission to edit the specified teacher information')
    expect(result.value).toEqual(null)
  })

  test('When provided Teacher is not found', async () => {
    const teacherRepository: ITeacherRepository = {
      updateTeacherById: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'EmailAlreadyExists'>>> {
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
    const administratorRepository: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const usecase = new UpdateTeacherUseCase(teacherRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_TEACHER_ID,
      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('TeacherNotFound')
    expect(result.error?.message).toEqual('The specified teacher not found for 10dc3c1a-ddda-46f1-90b1-8f982dcd54f7')
  })

  test('When provided email already exist', async () => {
    const teacherRepository: ITeacherRepository = {
      updateTeacherById: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'EmailAlreadyExists'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unknown error',
          },
          value: null,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
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
    const usecase = new UpdateTeacherUseCase(teacherRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'administrator',
      },
      VALID_TEACHER_ID,
      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.error?.message).toContain('This email is already exist')
  })

  test('When fail to load administrator data', async () => {
    const teacherRepository: ITeacherRepository = {
      updateTeacherById: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'EmailAlreadyExists'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
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
            message: 'unknown error',
          },
          value: null,
        }
      }),
    }
    const usecase = new UpdateTeacherUseCase(teacherRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'administrator',
      },
      VALID_TEACHER_ID,
      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('FailedToLoadAdministratorData')
    expect(result.error?.message).toEqual('Failed to getDistrictAdministratorByUserId requested-user-id')
  })

  test('When administrator is not found', async () => {
    const teacherRepository: ITeacherRepository = {
      updateTeacherById: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'EmailAlreadyExists'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
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
    const usecase = new UpdateTeacherUseCase(teacherRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'administrator',
      },
      VALID_TEACHER_ID,
      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('AdministratorNotFound')
    expect(result.error?.message).toEqual('The specified administrator not found for requested-user-id')
  })

  test('When teacher edit other teacher data', async () => {
    const teacherRepository: ITeacherRepository = {
      updateTeacherById: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'EmailAlreadyExists'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
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
    const usecase = new UpdateTeacherUseCase(teacherRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'teacher',
      },
      VALID_TEACHER_ID,
      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.error?.message).toEqual('The user does not have permission to edit the specified teacher information')
  })

  test('When administrator is not from the same district id as teacher', async () => {
    const teacherRepository: ITeacherRepository = {
      updateTeacherById: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'> | E<'EmailAlreadyExists'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getTeacherByTeacherId: jest.fn(async function (): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
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
    const usecase = new UpdateTeacherUseCase(teacherRepository, administratorRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'administrator',
      },
      VALID_TEACHER_ID,
      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.error?.message).toEqual('The user does not have permission to edit the specified teacher information')
  })
})
