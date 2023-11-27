import { UserLessonQuizAnswerStatus } from '../../entities/codex/UserLessonQuizAnswerStatus'
import { CreateUserLessonQuizAnswerStatusUseCase, IUserLessonQuizAnswerStatusRepository } from './CreateUserLessonQuizAnswerStatusUseCase'
import { E, Errorable } from '../shared/Errors'

const VALID_INPUT_DATA: UserLessonQuizAnswerStatus = {
  userId: 'user-id-1',
  lessonId: 'lesson-id-1',
  userLessonStatusHistoryId: 'userLessonStatusHistoryId-1',
  isCorrect: true,
  selectedChoice: '',
  stepId: '1',
}

describe('test CreateUserLessonQuizAnswerStatusUseCase', () => {
  test('test CreateUserLessonQuizAnswerStatusUseCase - success', async () => {
    const userLessonQuizAnswerStatusRepository: IUserLessonQuizAnswerStatusRepository = {
      createUserLessonQuizAnswerStatus: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      }),
    }
    const usecase = new CreateUserLessonQuizAnswerStatusUseCase(userLessonQuizAnswerStatusRepository)

    const result = await usecase.run(VALID_INPUT_DATA)

    const getUserByAccessTokenSpy = userLessonQuizAnswerStatusRepository.createUserLessonQuizAnswerStatus as jest.Mock

    expect(getUserByAccessTokenSpy.mock.calls).toEqual([[VALID_INPUT_DATA]])
    expect(result.hasError).toEqual(false)
    expect(result.error).toEqual(null)
    expect(result.value).toEqual(undefined)
  })

  test('when UserLessonQuizAnswerStatus repository returns run time error', async () => {
    const userLessonQuizAnswerStatusRepository: IUserLessonQuizAnswerStatusRepository = {
      createUserLessonQuizAnswerStatus: jest.fn(async function (): Promise<Errorable<void, E<'UnknownRuntimeError'>>> {
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
    const usecase = new CreateUserLessonQuizAnswerStatusUseCase(userLessonQuizAnswerStatusRepository)

    const result = await usecase.run(VALID_INPUT_DATA)

    const getUserByAccessTokenSpy = userLessonQuizAnswerStatusRepository.createUserLessonQuizAnswerStatus as jest.Mock

    expect(getUserByAccessTokenSpy.mock.calls).toEqual([[VALID_INPUT_DATA]])
    expect(result.hasError).toEqual(true)
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })
})
