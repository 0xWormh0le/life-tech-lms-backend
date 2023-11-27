import { E, Errorable } from '../../shared/Errors'
import { UserPackageAssignment } from '../../../entities/codex/UserPackageAssignment'
import { DeleteUserPackageAssignmentUseCase, IUserPackageAssignmentRepository } from './DeleteUserPackageAssignmentUseCase'

describe('test DeleteUserPackageAssignmentUseCase', () => {
  test('sucess', async () => {
    const userPackageAssignmentRepository: IUserPackageAssignmentRepository = {
      get: jest.fn(async function (query: {
        where: Partial<UserPackageAssignment>
      }): Promise<Errorable<UserPackageAssignment[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              userId: 'userId',
              packageCategoryId: 'packageCategoryId',
              packageId: 'packageId',
            },
          ],
        }
      }),
      delete: jest.fn(async function (
        userPackageAssignment: Pick<UserPackageAssignment, 'packageCategoryId' | 'userId'>,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new DeleteUserPackageAssignmentUseCase(userPackageAssignmentRepository)
    const usecaseResult = await usecase.run({
      userId: 'userId',
      packageCategoryId: 'packageCategoryId',
    })

    if (usecaseResult.hasError) {
      throw new Error(`failed to run usecase ${usecaseResult.error}`)
    }

    const deleteSpy = userPackageAssignmentRepository.delete as jest.Mock

    expect(deleteSpy.mock.calls).toEqual<Parameters<typeof userPackageAssignmentRepository.delete>[]>([
      [
        {
          userId: 'userId',
          packageCategoryId: 'packageCategoryId',
        },
      ],
    ])
  })

  test('failed with userPackageAssignmentRepository spits UnknownRuntimeError', async () => {
    const userPackageAssignmentRepository: IUserPackageAssignmentRepository = {
      get: jest.fn(async function (query: {
        where: Partial<UserPackageAssignment>
      }): Promise<Errorable<UserPackageAssignment[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'userPackageAssignmentRepository.detete failed',
          },
          value: null,
        }
      }),
      delete: jest.fn(async function (
        userPackageAssignment: Pick<UserPackageAssignment, 'packageCategoryId' | 'userId'>,
      ): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'userPackageAssignmentRepository.delete failed',
          },
          value: null,
        }
      }),
    }
    const usecase = new DeleteUserPackageAssignmentUseCase(userPackageAssignmentRepository)
    const usecaseResult = await usecase.run({
      userId: 'userId',
      packageCategoryId: 'packageCategoryId',
    })

    expect(usecaseResult.error?.type).toEqual('UnknownRuntimeError')
  })
})
