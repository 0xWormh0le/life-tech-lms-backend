import { E, Errorable } from '../../shared/Errors'
import { UserPackageAssignment } from '../../../entities/codex/UserPackageAssignment'
import { CreateUserPackageAssignmentUseCase, IUserPackageAssignmentRepository } from './CreateUserPackageAssignmentUseCase'

describe('test CreateUserPackageAssignmentsUseCase', () => {
  test('sucess', async () => {
    const userPackageAssignmentRepository: IUserPackageAssignmentRepository = {
      get: jest.fn(async function (query: {
        where: Partial<UserPackageAssignment>
      }): Promise<Errorable<UserPackageAssignment[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [],
        }
      }),
      create: jest.fn(async function (
        userPackageAssignment: Omit<UserPackageAssignment, 'id'>,
      ): Promise<Errorable<UserPackageAssignment, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: userPackageAssignment,
        }
      }),
    }
    const usecase = new CreateUserPackageAssignmentUseCase(userPackageAssignmentRepository)
    const usecaseResult = await usecase.run({
      userId: 'userId',
      packageCategoryId: 'packageCategoryId',
      packageId: 'packageId',
    })

    if (usecaseResult.hasError) {
      throw new Error(`failed to run usecase ${usecaseResult.error}`)
    }
    expect(usecaseResult.value).toEqual<typeof usecaseResult.value>({
      userId: 'userId',
      packageCategoryId: 'packageCategoryId',
      packageId: 'packageId',
    })

    const createSpy = userPackageAssignmentRepository.create as jest.Mock

    expect(createSpy.mock.calls).toEqual<Parameters<typeof userPackageAssignmentRepository.create>[]>([
      [
        {
          userId: 'userId',
          packageCategoryId: 'packageCategoryId',
          packageId: 'packageId',
        },
      ],
    ])
  })

  test('failed when the package with same category already assigned', async () => {
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
              packageId: 'packageId-2',
            },
          ],
        }
      }),
      create: jest.fn(async function (
        userPackageAssignment: Omit<UserPackageAssignment, 'id'>,
      ): Promise<Errorable<UserPackageAssignment, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: userPackageAssignment,
        }
      }),
    }
    const usecase = new CreateUserPackageAssignmentUseCase(userPackageAssignmentRepository)
    const usecaseResult = await usecase.run({
      userId: 'userId',
      packageCategoryId: 'packageCategoryId',
      packageId: 'packageId',
    })

    expect(usecaseResult.error?.type).toEqual<NonNullable<typeof usecaseResult.error>['type']>('AlreadyExistError')
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
            message: 'userPackageAssignmentRepository.create failed',
          },
          value: null,
        }
      }),
      create: jest.fn(async function (
        userPackageAssignment: Omit<UserPackageAssignment, 'id'>,
      ): Promise<Errorable<UserPackageAssignment, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'userPackageAssignmentRepository.create failed',
          },
          value: null,
        }
      }),
    }
    const usecase = new CreateUserPackageAssignmentUseCase(userPackageAssignmentRepository)
    const usecaseResult = await usecase.run({
      userId: 'userId',
      packageCategoryId: 'packageCategoryId',
      packageId: 'packageId',
    })

    expect(usecaseResult.error?.type).toEqual('UnknownRuntimeError')
  })
})
