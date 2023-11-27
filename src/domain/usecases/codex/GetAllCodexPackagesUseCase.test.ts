import { CodexPackage } from '../../entities/codex/CodexPackage'
import { UserRoles } from '../shared/Constants'
import { E, Errorable } from '../shared/Errors'
import { GetAllCodexPackagesUseCase } from './GetAllCodexPackagesUseCase'

const MOCK_RESULT: CodexPackage[] = [
  {
    packageCategoryId: 'codeillusion',
    packageId: 'package-id-1',
    packageName: 'package-name-1',
  },
  {
    packageCategoryId: 'cse',
    packageId: 'package-id-2',
    packageName: 'package-name-2',
  },
]

export interface ICodexPackagesRepository {
  getAllCodexPackages(): Promise<Errorable<CodexPackage[], E<'UnknownRuntimeError'>>>
}

describe('test GetAllCodexPcakages', () => {
  test('test GetAllCodexPcakages - success', async () => {
    const CodexPackageRepository: ICodexPackagesRepository = {
      getAllCodexPackages: jest.fn(async function (): Promise<Errorable<CodexPackage[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: MOCK_RESULT,
        }
      }),
    }
    const usecase = new GetAllCodexPackagesUseCase(CodexPackageRepository)
    const result = await usecase.run({
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.internalOperator,
    })

    expect(result.hasError).toEqual(false)
  })

  test('test when user is not internal operator - permission denied', async () => {
    const CodexPackageRepository: ICodexPackagesRepository = {
      getAllCodexPackages: jest.fn(async function (): Promise<Errorable<CodexPackage[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: {} as CodexPackage[],
        }
      }),
    }
    const usecase = new GetAllCodexPackagesUseCase(CodexPackageRepository)
    const result = await usecase.run({
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.student,
    })

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('PermissionDenied')
    expect(result.error?.message).toEqual('The user does not have permission to view the codex-packages.')
  })

  test('test when runtime error comes.', async () => {
    const CodexPackageRepository: ICodexPackagesRepository = {
      getAllCodexPackages: jest.fn(async function (): Promise<Errorable<CodexPackage[], E<'UnknownRuntimeError'>>> {
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
    const usecase = new GetAllCodexPackagesUseCase(CodexPackageRepository)
    const result = await usecase.run({
      id: 'requested-user-id',
      loginId: 'login-id',
      role: UserRoles.internalOperator,
    })

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
  })
})
