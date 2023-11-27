import { UserLessonStatus } from '../../entities/codex/UserLessonStatus'
import { E, Errorable } from '../shared/Errors'
import { IUserLessonStatusesRepository, GetUserLessonStatusesByUserIdUseCase } from './GetUserLessonStatusesByUserIdUseCase'

describe('test GetUserLessonStatusesByUserIdUseCase', () => {
  test('test GetUserLessonStatusesByUserIdUseCase - success', async () => {
    const userLessonStatusesRepository: IUserLessonStatusesRepository = {
      getUserLessonStatusesByUserId: jest.fn(async function (
        userId: string,
        lessonIds?: string[],
      ): Promise<Errorable<UserLessonStatus[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              userId: 'user-id-1',
              lessonId: 'lesson-id-1',
              status: 'not_cleared',
              achievedStarCount: 2,
            },
            {
              userId: 'user-id-2',
              lessonId: 'lesson-id-2',
              status: 'not_cleared',
              achievedStarCount: 2,
            },
          ] as UserLessonStatus[],
        }
      }),
    }
    const usecase = new GetUserLessonStatusesByUserIdUseCase(userLessonStatusesRepository)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'student',
      },
      'user-id-1',
    )

    expect(result.hasError).toEqual(false)

    const getUserLessonStatusesByUserIdSpy = userLessonStatusesRepository.getUserLessonStatusesByUserId as jest.Mock

    expect(getUserLessonStatusesByUserIdSpy.mock.calls).toEqual([['user-id-1', undefined]])

    expect(result.value).toEqual([
      {
        userId: 'user-id-1',
        lessonId: 'lesson-id-1',
        status: 'not_cleared',
        achievedStarCount: 2,
      },
      {
        userId: 'user-id-2',
        lessonId: 'lesson-id-2',
        status: 'not_cleared',
        achievedStarCount: 2,
      },
    ] as UserLessonStatus[])
  })

  test('There is no user lessons related to user id', async () => {
    const userLessonStatusesRepository: IUserLessonStatusesRepository = {
      getUserLessonStatusesByUserId: jest.fn(async function (
        userId: string,
        lessonIds?: string[],
      ): Promise<Errorable<UserLessonStatus[], E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: [] as UserLessonStatus[],
        }
      }),
    }

    const usecase = new GetUserLessonStatusesByUserIdUseCase(userLessonStatusesRepository)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'student',
      },
      'user-id-1',
    )

    const getUserLessonStatusesByUserIdSpy = userLessonStatusesRepository.getUserLessonStatusesByUserId as jest.Mock

    expect(getUserLessonStatusesByUserIdSpy.mock.calls).toEqual([['user-id-1', undefined]])

    expect(result.error).toEqual(null)
    expect(result.value).toEqual([])
  })

  test('When user lesson repository returns runtime error', async () => {
    const userLessonStatusesRepository: IUserLessonStatusesRepository = {
      getUserLessonStatusesByUserId: jest.fn(async function (
        userId: string,
        lessonIds?: string[],
      ): Promise<Errorable<UserLessonStatus[], E<'UnknownRuntimeError'>>> {
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
    const usecase = new GetUserLessonStatusesByUserIdUseCase(userLessonStatusesRepository)

    const result = await usecase.run(
      {
        id: 'requested-user-id',
        loginId: 'login-id',
        role: 'student',
      },
      'user-id-1',
    )

    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })
})
