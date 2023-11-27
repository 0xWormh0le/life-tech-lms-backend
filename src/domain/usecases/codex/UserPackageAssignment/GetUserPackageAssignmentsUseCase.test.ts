import { E, Errorable } from '../../shared/Errors'
import { UserPackageAssignment } from '../../../entities/codex/UserPackageAssignment'
import { GetUserPackageAssignmentsUseCase, IUserPackageAssignmentRepository } from './GetUserPackageAssignmentsUseCase'

describe('test GetUserPackageAssignmentsUseCase', () => {
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
              userId: 'userId-1',
              packageCategoryId: 'packageCategoryId-1',
              packageId: 'packageId-1',
            },
            {
              userId: 'userId-2',
              packageCategoryId: 'packageCategoryId-1',
              packageId: 'packageId-2',
            },
          ],
        }
      }),
    }
    const usecase = new GetUserPackageAssignmentsUseCase(userPackageAssignmentRepository)
    const usecaseResult = await usecase.run({
      where: {
        userId: 'user-id-1',
      },
    })

    if (usecaseResult.hasError) {
      throw new Error(`failed to run usecase ${usecaseResult.error}`)
    }
    expect(usecaseResult.value).toEqual<typeof usecaseResult.value>([
      {
        userId: 'userId-1',
        packageCategoryId: 'packageCategoryId-1',
        packageId: 'packageId-1',
      },
      {
        userId: 'userId-2',
        packageCategoryId: 'packageCategoryId-1',
        packageId: 'packageId-2',
      },
    ])

    const getSpy = userPackageAssignmentRepository.get as jest.Mock

    expect(getSpy.mock.calls).toEqual<Parameters<typeof userPackageAssignmentRepository.get>[]>([
      [
        {
          where: {
            userId: 'user-id-1',
          },
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
            message: 'UnknownRuntimeError',
          },
          value: null,
        }
      }),
    }
    const usecase = new GetUserPackageAssignmentsUseCase(userPackageAssignmentRepository)
    const usecaseResult = await usecase.run({
      where: {
        userId: 'user-id-1',
      },
    })

    expect(usecaseResult.error?.type).toEqual('UnknownRuntimeError')
  })
})
