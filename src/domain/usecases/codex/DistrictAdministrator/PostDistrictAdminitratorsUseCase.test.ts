import {
  PostDistrictAdministratorsUseCase,
  IDistrictAdministratorRepository,
  IUserRepository,
  AdminitaratorInfo,
  UserEmailInfo,
  BadRequestEnum,
} from './PostDistrictAdminitratorsUseCase'
import { E, Errorable } from '../../shared/Errors'
import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'

const VALID_DISTRICT_ID = 'b9484b02-2d71-4b3f-afb0-57057843a59d'
const INVALID_DISTRICT_ID = 'district-id-00001'
const VALID_INPUT_DATA: AdminitaratorInfo[] = [
  {
    email: 'admin1@email.com',
    firstName: 'test_user_firstname',
    lastName: 'test_user_lastname',
    administratorLMSId: 'LIT_001',
  },
  {
    email: 'admin2@email.com',
    firstName: 'test_user_firstname',
    lastName: 'test_user_lastname',
    administratorLMSId: 'LIT_002',
  },
  {
    email: 'admin3@email.com',
  },
]
let INVALID_INPUT_DATA: AdminitaratorInfo[] = [
  {
    email: 'admin1.com',
    firstName: 'test_user_firstname',
    lastName: 'test_user_lastname',
    administratorLMSId: 'LIT_001',
  },
  {
    email: 'admin2@email',
    firstName: 'test_user_firstname',
    lastName: 'test_user_lastname',
    administratorLMSId: 'LIT_001',
  },
  { email: 'admin3' },
]

describe('Test PostDistrictAdministratorsUseCase', () => {
  test('Test PostDistrictAdministratorsUseCase - success', async () => {
    const districtAdministratorRepository: IDistrictAdministratorRepository = {
      postDistrictAdministrators: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError' | 'DistrictNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserEmailInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const usecase = new PostDistrictAdministratorsUseCase(districtAdministratorRepository, userRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_DISTRICT_ID,
      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(false)

    const postDistrictAdministratorsSpy = districtAdministratorRepository.postDistrictAdministrators as jest.Mock

    expect(postDistrictAdministratorsSpy.mock.calls).toEqual([[VALID_DISTRICT_ID, VALID_INPUT_DATA, 'requested-user-id']])
    expect(result.value).toEqual(undefined)
    expect(result.error).toEqual(null)
  })

  test('District administrator can add another administrator of district only', async () => {
    const districtAdministratorRepository: IDistrictAdministratorRepository = {
      postDistrictAdministrators: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError' | 'DistrictNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: { districtId: 'district-id-1' } as DistrictAdministrator,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserEmailInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const usecase = new PostDistrictAdministratorsUseCase(districtAdministratorRepository, userRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'administrator',
      },
      VALID_DISTRICT_ID,
      VALID_INPUT_DATA,
    )
    const districtAdministratorRepositroySpy = districtAdministratorRepository.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([['requested-user-id']])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('When administrator not found of user id', async () => {
    const districtAdministratorRepository: IDistrictAdministratorRepository = {
      postDistrictAdministrators: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError' | 'DistrictNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getDistrictAdministratorByUserId: jest.fn(async function (
        userId: string,
      ): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserEmailInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const usecase = new PostDistrictAdministratorsUseCase(districtAdministratorRepository, userRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'administrator',
      },
      VALID_DISTRICT_ID,
      VALID_INPUT_DATA,
    )
    const districtAdministratorRepositroySpy = districtAdministratorRepository.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([['requested-user-id']])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('AdministratorNotFound')
    expect(result.value).toEqual(null)
  })

  test('When administrator repository getDistrictAdministratorByUserId returns returns run time error', async () => {
    const districtAdministratorRepository: IDistrictAdministratorRepository = {
      postDistrictAdministrators: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError' | 'DistrictNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unknown run time error',
          },
          value: null,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserEmailInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const usecase = new PostDistrictAdministratorsUseCase(districtAdministratorRepository, userRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'administrator',
      },
      VALID_DISTRICT_ID,
      VALID_INPUT_DATA,
    )
    const districtAdministratorRepositroySpy = districtAdministratorRepository.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([['requested-user-id']])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('When district administrator repository returns runtime error', async () => {
    const districtAdministratorRepository: IDistrictAdministratorRepository = {
      postDistrictAdministrators: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError' | 'DistrictNotFound'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: { districtId: VALID_DISTRICT_ID } as DistrictAdministrator,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserEmailInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const usecase = new PostDistrictAdministratorsUseCase(districtAdministratorRepository, userRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'administrator',
      },
      VALID_DISTRICT_ID,
      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)

    const postDistrictAdministratorsSpy = districtAdministratorRepository.postDistrictAdministrators as jest.Mock

    expect(postDistrictAdministratorsSpy.mock.calls).toEqual([[VALID_DISTRICT_ID, VALID_INPUT_DATA, 'requested-user-id']])
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('When provided invalid districtId returns invalid error', async () => {
    const districtAdministratorRepository: IDistrictAdministratorRepository = {
      postDistrictAdministrators: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError' | 'DistrictNotFound'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something wrong happened',
          },
          value: null,
        }
      }),
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserEmailInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const usecase = new PostDistrictAdministratorsUseCase(districtAdministratorRepository, userRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      INVALID_DISTRICT_ID,
      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)

    const postDistrictAdministratorsSpy = districtAdministratorRepository.postDistrictAdministrators as jest.Mock

    expect(postDistrictAdministratorsSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('InvalidDistrictId')
    expect(result.error?.message).toEqual('Invalid districtId')
    expect(result.value).toEqual(null)
  })

  test('User role is not internal operator or administrator- permission denied', async () => {
    const districtAdministratorRepository: IDistrictAdministratorRepository = {
      postDistrictAdministrators: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError' | 'DistrictNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserEmailInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const usecase = new PostDistrictAdministratorsUseCase(districtAdministratorRepository, userRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'student',
      },
      VALID_DISTRICT_ID,
      VALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('When provided invalid emails returns invalid email error', async () => {
    const districtAdministratorRepository: IDistrictAdministratorRepository = {
      postDistrictAdministrators: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError' | 'DistrictNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserEmailInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const usecase = new PostDistrictAdministratorsUseCase(districtAdministratorRepository, userRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_DISTRICT_ID,
      INVALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)

    const postDistrictAdministratorsSpy = districtAdministratorRepository.postDistrictAdministrators as jest.Mock

    expect(postDistrictAdministratorsSpy.mock.calls).toEqual([])
    expect(result.error?.type).toEqual('InvalidAdministratorAttributes')
    expect(result.error?.message).toEqual([
      { index: 0, message: [BadRequestEnum.emailInvalid] },
      { index: 1, message: [BadRequestEnum.emailInvalid] },
      { index: 2, message: [BadRequestEnum.emailInvalid] },
    ])
    expect(result.value).toEqual(null)
  })

  test('When provied district is not found', async () => {
    const districtAdministratorRepository: IDistrictAdministratorRepository = {
      postDistrictAdministrators: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError' | 'DistrictNotFound'>>> {
        return {
          hasError: true,
          error: {
            type: 'DistrictNotFound',
            message: 'District not found',
          },
          value: null,
        }
      }),
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserEmailInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const usecase = new PostDistrictAdministratorsUseCase(districtAdministratorRepository, userRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_DISTRICT_ID,
      VALID_INPUT_DATA,
    )

    const postDistrictAdministratorsSpy = districtAdministratorRepository.postDistrictAdministrators as jest.Mock

    expect(postDistrictAdministratorsSpy.mock.calls).toEqual([[VALID_DISTRICT_ID, VALID_INPUT_DATA, 'requested-user-id']])
    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('DistrictNotFound')
    expect(result.error?.message).toEqual('District not found')
  })

  test('When some of the provided emails are already exists in the user', async () => {
    const districtAdministratorRepository: IDistrictAdministratorRepository = {
      postDistrictAdministrators: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError' | 'DistrictNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserEmailInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [{ email: 'admin1@email.com' }, { email: 'admin2@email.com' }],
        }
      }),
    }
    const usecase = new PostDistrictAdministratorsUseCase(districtAdministratorRepository, userRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_DISTRICT_ID,
      VALID_INPUT_DATA,
    )

    const postDistrictAdministratorsSpy = districtAdministratorRepository.postDistrictAdministrators as jest.Mock

    expect(postDistrictAdministratorsSpy.mock.calls).toEqual([])
    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('InvalidAdministratorAttributes')
    expect(result.error?.message).toEqual([
      { index: 0, message: [BadRequestEnum.userAlreadyExistWithEmail] },
      { index: 1, message: [BadRequestEnum.userAlreadyExistWithEmail] },
    ])
  })

  test('When duplicate emails are provided', async () => {
    INVALID_INPUT_DATA = [{ email: 'admin1@email.com' }, { email: 'admin2@email.com' }, { email: 'admin1@email.com' }]

    const districtAdministratorRepository: IDistrictAdministratorRepository = {
      postDistrictAdministrators: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError' | 'DistrictNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserEmailInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const usecase = new PostDistrictAdministratorsUseCase(districtAdministratorRepository, userRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_DISTRICT_ID,
      INVALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('InvalidAdministratorAttributes')
    expect(result.error?.message).toEqual([
      { index: 0, message: [BadRequestEnum.duplicateRecordsWithSameEmail] },
      { index: 2, message: [BadRequestEnum.duplicateRecordsWithSameEmail] },
    ])
  })

  test('When some emails are not provided', async () => {
    INVALID_INPUT_DATA = [{ email: '' }, { email: 'admin2@email.com' }, { email: 'admin1@email.com' }]

    const districtAdministratorRepository: IDistrictAdministratorRepository = {
      postDistrictAdministrators: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError' | 'DistrictNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserEmailInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const usecase = new PostDistrictAdministratorsUseCase(districtAdministratorRepository, userRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_DISTRICT_ID,
      INVALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('InvalidAdministratorAttributes')
    expect(result.error?.message).toEqual([{ index: 0, message: [BadRequestEnum.emailNotProvided] }])
  })

  test('When getting the unknown runtime error while fetcher the users data via email', async () => {
    INVALID_INPUT_DATA = [{ email: '' }, { email: 'admin2@email.com' }, { email: 'admin1@email.com' }]

    const districtAdministratorRepository: IDistrictAdministratorRepository = {
      postDistrictAdministrators: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError' | 'DistrictNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserEmailInfo[], E<'UnknownRuntimeError'>>> {
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
    const usecase = new PostDistrictAdministratorsUseCase(districtAdministratorRepository, userRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_DISTRICT_ID,
      INVALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('FailedToGetUsersData')
    expect(result.error?.message).toEqual('Failed to get users data by emails , admin2@email.com, admin1@email.com')
  })

  test('When getting the multiple errors while inserting bulk records', async () => {
    INVALID_INPUT_DATA = [
      { email: '' },
      { email: 'admin2@email.com' },
      { email: 'admin1@email.com' },
      { email: 'admin1' },
      { email: 'admin1' },
      { email: 'admin2@email.com' },
      { email: 'admin3@email.com' },
      { email: 'admin4@email.com' },
      { email: 'admin4@email.com' },
    ]

    const districtAdministratorRepository: IDistrictAdministratorRepository = {
      postDistrictAdministrators: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError' | 'DistrictNotFound'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }
    const userRepository: IUserRepository = {
      getUsersByEmails: jest.fn(async function (): Promise<Errorable<UserEmailInfo[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [{ email: 'admin3@email.com' }, { email: 'admin4@email.com' }],
        }
      }),
    }
    const usecase = new PostDistrictAdministratorsUseCase(districtAdministratorRepository, userRepository)
    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'internalOperator',
      },
      VALID_DISTRICT_ID,
      INVALID_INPUT_DATA,
    )

    expect(result.hasError).toEqual(true)
    expect(result.value).toEqual(null)
    expect(result.error?.type).toEqual('InvalidAdministratorAttributes')
    expect(result.error?.message).toEqual([
      { index: 0, message: [BadRequestEnum.emailNotProvided] },
      { index: 1, message: [BadRequestEnum.duplicateRecordsWithSameEmail] },
      {
        index: 3,
        message: [BadRequestEnum.emailInvalid, BadRequestEnum.duplicateRecordsWithSameEmail],
      },
      {
        index: 4,
        message: [BadRequestEnum.emailInvalid, BadRequestEnum.duplicateRecordsWithSameEmail],
      },
      { index: 5, message: [BadRequestEnum.duplicateRecordsWithSameEmail] },
      { index: 6, message: [BadRequestEnum.userAlreadyExistWithEmail] },
      {
        index: 7,
        message: [BadRequestEnum.duplicateRecordsWithSameEmail, BadRequestEnum.userAlreadyExistWithEmail],
      },
      {
        index: 8,
        message: [BadRequestEnum.duplicateRecordsWithSameEmail, BadRequestEnum.userAlreadyExistWithEmail],
      },
    ])
  })
})
