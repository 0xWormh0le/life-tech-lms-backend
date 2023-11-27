import {
  IDistrictPurchasedPackageRepository,
  GetDistrictPurchasedPackagesByDistrictIdUseCase,
  IAdministratorRepository,
  ITeacherRepository,
} from './GetDistrictPurchasedPackagesByDistrictIdUseCase'
import { E, Errorable } from '../../shared/Errors'
import { User } from '../../../entities/codex/User'
import { DistrictAdministrator } from '../../../entities/codex/DistrictAdministrator'

import { TeacherOrganization } from '../../../entities/codex/Teacher'
import { UserRoles } from '../../shared/Constants'
import { CodexPackage } from '../../../entities/codex/CodexPackage'

const VALID_DISTRICT_ID = 'b9484b02-2d71-4b3f-afb0-57057843a59d'
const INVALID_DISTRICT_ID = 'district-id-00001'

const VALID_USER_DATA: User = {
  id: 'requested-user-id',
  loginId: 'login-id',
  role: 'internalOperator',
}

describe('test GetDistrictPurchasedPackagesByDistrictIdUseCase', () => {
  test('test GetDistrictPurchasedPackagesByDistrictIdUseCase - success', async () => {
    const districtPurchasedPackageRepository: IDistrictPurchasedPackageRepository = {
      getDistrictPurchasedPackagesByDistrictId: jest.fn(async function (districtId: string): Promise<Errorable<CodexPackage[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              packageCategoryId: 'codeillusion',
              packageId: 'package-1',
              packageName: 'package-name-1',
            },
            {
              packageCategoryId: 'codeillusion',
              packageId: 'package-2',
              packageName: 'package-name-2',
            },
          ],
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new GetDistrictPurchasedPackagesByDistrictIdUseCase(districtPurchasedPackageRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run(VALID_USER_DATA, VALID_DISTRICT_ID)

    const getDistrictPurchasedPackagesSpy = districtPurchasedPackageRepository.getDistrictPurchasedPackagesByDistrictId as jest.Mock

    expect(getDistrictPurchasedPackagesSpy.mock.calls).toEqual([[VALID_DISTRICT_ID]])

    expect(result.hasError).toEqual(false)
    expect(result.value).toEqual([
      {
        packageCategoryId: 'codeillusion',
        packageId: 'package-1',
        packageName: 'package-name-1',
      },
      {
        packageCategoryId: 'codeillusion',
        packageId: 'package-2',
        packageName: 'package-name-2',
      },
    ])
  })

  test('when user provided invalid format of district id', async () => {
    const districtPurchasedPackageRepository: IDistrictPurchasedPackageRepository = {
      getDistrictPurchasedPackagesByDistrictId: jest.fn(async function (districtId: string): Promise<Errorable<CodexPackage[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new GetDistrictPurchasedPackagesByDistrictIdUseCase(districtPurchasedPackageRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run(VALID_USER_DATA, INVALID_DISTRICT_ID)

    const getDistrictPurchasedPackagesSpy = districtPurchasedPackageRepository.getDistrictPurchasedPackagesByDistrictId as jest.Mock

    expect(getDistrictPurchasedPackagesSpy.mock.calls).toEqual([])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('InvalidDistrictId')
    expect(result.value).toEqual(null)
  })

  test('user is not internal operator or administrator or teacher- permission denied', async () => {
    const districtPurchasedPackageRepository: IDistrictPurchasedPackageRepository = {
      getDistrictPurchasedPackagesByDistrictId: jest.fn(async function (districtId: string): Promise<Errorable<CodexPackage[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new GetDistrictPurchasedPackagesByDistrictIdUseCase(districtPurchasedPackageRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ ...VALID_USER_DATA, role: 'student' }, VALID_DISTRICT_ID)

    const getDistrictPurchasedPackagesSpy = districtPurchasedPackageRepository.getDistrictPurchasedPackagesByDistrictId as jest.Mock

    expect(getDistrictPurchasedPackagesSpy.mock.calls).toEqual([])

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('when administrator repository returns run time error', async () => {
    const districtPurchasedPackageRepository: IDistrictPurchasedPackageRepository = {
      getDistrictPurchasedPackagesByDistrictId: jest.fn(async function (districtId: string): Promise<Errorable<CodexPackage[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unkown error occured',
          },
          value: null,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new GetDistrictPurchasedPackagesByDistrictIdUseCase(districtPurchasedPackageRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.administrator }, VALID_DISTRICT_ID)

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([[VALID_USER_DATA.id]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('when administrator not found of user id', async () => {
    const districtPurchasedPackageRepository: IDistrictPurchasedPackageRepository = {
      getDistrictPurchasedPackagesByDistrictId: jest.fn(async function (districtId: string): Promise<Errorable<CodexPackage[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
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

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new GetDistrictPurchasedPackagesByDistrictIdUseCase(districtPurchasedPackageRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.administrator }, VALID_DISTRICT_ID)

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([[VALID_USER_DATA.id]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('AdministratorNotFound')
    expect(result.value).toEqual(null)
  })

  test('Administrator can only see his district purchased packages', async () => {
    const districtPurchasedPackageRepository: IDistrictPurchasedPackageRepository = {
      getDistrictPurchasedPackagesByDistrictId: jest.fn(async function (districtId: string): Promise<Errorable<CodexPackage[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (
        userId: string,
      ): Promise<Errorable<DistrictAdministrator | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: { districtId: 'district-id-1' } as DistrictAdministrator,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new GetDistrictPurchasedPackagesByDistrictIdUseCase(districtPurchasedPackageRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.administrator }, VALID_DISTRICT_ID)

    const districtAdministratorRepositroySpy = districtAdministratorRepositroy.getDistrictAdministratorByUserId as jest.Mock

    expect(districtAdministratorRepositroySpy.mock.calls).toEqual([[VALID_USER_DATA.id]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('when teacher repository returns run time error', async () => {
    const districtPurchasedPackageRepository: IDistrictPurchasedPackageRepository = {
      getDistrictPurchasedPackagesByDistrictId: jest.fn(async function (districtId: string): Promise<Errorable<CodexPackage[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unkown error occured',
          },
          value: null,
        }
      }),
    }
    const usecase = new GetDistrictPurchasedPackagesByDistrictIdUseCase(districtPurchasedPackageRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.teacher }, VALID_DISTRICT_ID)

    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([[VALID_USER_DATA.id]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('when teacher repository returns teacher not found error', async () => {
    const districtPurchasedPackageRepository: IDistrictPurchasedPackageRepository = {
      getDistrictPurchasedPackagesByDistrictId: jest.fn(async function (districtId: string): Promise<Errorable<CodexPackage[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new GetDistrictPurchasedPackagesByDistrictIdUseCase(districtPurchasedPackageRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.teacher }, VALID_DISTRICT_ID)

    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([[VALID_USER_DATA.id]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('TeacherNotFound')
    expect(result.value).toEqual(null)
  })

  test('Teacher can only see his district purchased packages', async () => {
    const districtPurchasedPackageRepository: IDistrictPurchasedPackageRepository = {
      getDistrictPurchasedPackagesByDistrictId: jest.fn(async function (districtId: string): Promise<Errorable<CodexPackage[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization | undefined, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: { districtId: 'district-id-1' } as TeacherOrganization,
        }
      }),
    }
    const usecase = new GetDistrictPurchasedPackagesByDistrictIdUseCase(districtPurchasedPackageRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run({ ...VALID_USER_DATA, role: UserRoles.teacher }, VALID_DISTRICT_ID)

    const getTeacherByUserIdSpy = teacherRepository.getTeacherByUserId as jest.Mock

    expect(getTeacherByUserIdSpy.mock.calls).toEqual([[VALID_USER_DATA.id]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.value).toEqual(null)
  })

  test('when disrict repository returns run time error', async () => {
    const districtPurchasedPackageRepository: IDistrictPurchasedPackageRepository = {
      getDistrictPurchasedPackagesByDistrictId: jest.fn(async function (districtId: string): Promise<Errorable<CodexPackage[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'unkown error occured',
          },
          value: null,
        }
      }),
    }
    const districtAdministratorRepositroy: IAdministratorRepository = {
      getDistrictAdministratorByUserId: jest.fn(async function (userId: string): Promise<Errorable<DistrictAdministrator, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as DistrictAdministrator,
        }
      }),
    }

    const teacherRepository: ITeacherRepository = {
      getTeacherByUserId: jest.fn(async function (userId: string): Promise<Errorable<TeacherOrganization, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as TeacherOrganization,
        }
      }),
    }
    const usecase = new GetDistrictPurchasedPackagesByDistrictIdUseCase(districtPurchasedPackageRepository, districtAdministratorRepositroy, teacherRepository)
    const result = await usecase.run(VALID_USER_DATA, VALID_DISTRICT_ID)

    const getDistrictPurchasedPackagesSpy = districtPurchasedPackageRepository.getDistrictPurchasedPackagesByDistrictId as jest.Mock

    expect(getDistrictPurchasedPackagesSpy.mock.calls).toEqual([[VALID_DISTRICT_ID]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })
})
