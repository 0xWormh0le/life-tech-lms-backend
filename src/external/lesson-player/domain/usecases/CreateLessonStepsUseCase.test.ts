import CreateLessonStepsUseCase, {
  DatetimeRepository,
  ExternalLessonPlayerLessonRepository,
  LessonRepository,
  LessonStepRepository,
} from './CreateLessonStepsUseCase'
import { E, Errorable } from '../../../../domain/usecases/shared/Errors'
import { LessonStep } from '../../../../domain/entities/codex-v2/LessonStep'
import { Lesson } from '../../../../domain/entities/codex-v2/Lesson'
import { ExternalLessonPlayerLesson } from '../entities/ExternalLessonPlayerLesson'

describe('CreateLessonStepUseCase', () => {
  const nowStr = '2000-01-01T00:00:00Z'

  describe('.run(authenticatedUser, input)', () => {
    describe(`
    lessonSheetSteps | storedSteps | expectCreated | expectUpdated | expectDeleted
    `, () => {
      test.each`
        lessonSheetSteps | storedSteps   | expectCreated | expectUpdated | expectDeleted
        ${[]}            | ${[]}         | ${[]}         | ${[]}         | ${[]}
        ${['1', '2']}    | ${['2', '3']} | ${['1']}      | ${['2']}      | ${['3']}
        ${['2', '1']}    | ${['2', '3']} | ${['1']}      | ${['2']}      | ${['3']}
      `(
        `
    $lessonSheetSteps, $storedSteps, $expectCreated, $expectUpdated, $expectDeleted
    `,
        async ({
          lessonSheetSteps,
          storedSteps,
          expectCreated,
          expectUpdated,
          expectDeleted,
        }: {
          lessonSheetSteps: string[]
          storedSteps: string[]
          expectCreated: string[]
          expectUpdated: string[]
          expectDeleted: string[]
        }) => {
          const datetimeRepository = createSuccessMockDatetimeRepository()
          const externalLessonPlayerLessonRepository = createSuccessMockExternalLessonPlayerLessonRepository()

          const lessonRepository = createSuccessMockLessonRepository()
          const lessonStepRepository = createSuccessMockLessonStepRepository()

          lessonStepRepository.findByLessonId = jest.fn(async (_lessonId: string): Promise<Errorable<LessonStep[], E<'UnknownRuntimeError'>>> => {
            return {
              hasError: false,
              error: null,
              value: storedSteps.map((e) => {
                return {
                  id: e,
                  lessonId: 'testLessonId1',
                  orderIndex: 0,
                  createdAt: new Date(nowStr),
                  externalLessonPlayerStepId: '1',
                }
              }),
            }
          })

          const useCase = new CreateLessonStepsUseCase(
            datetimeRepository,
            externalLessonPlayerLessonRepository,

            lessonRepository,
            lessonStepRepository,
          )

          const result = await useCase.run({
            lessonNameInLessonSheet: 'lessonNameInLessonSheet',
            externalLessonPlayerLessonSteps: lessonSheetSteps.map((e) => {
              return {
                stepId: '0',
                stepUrl: 'testStepUrl1',
                codexStepId: e,
              }
            }),
          })

          expect(result.hasError).toEqual(false)
          expect(result.error).toBeNull()
          expect(result.value).toBeUndefined()

          const stepIdStepOrderMap = new Map(lessonSheetSteps.map((e, i) => [e, i]))

          expect(lessonStepRepository.create.mock.calls).toEqual(
            expectCreated.map((e) => [
              {
                id: e,
                lessonId: 'testLessonId1',
                orderIndex: stepIdStepOrderMap.get(e),
                createdAt: new Date(nowStr),
                externalLessonPlayerStepId: '0',
              },
            ]),
          )
          expect(lessonStepRepository.update.mock.calls).toEqual(
            expectUpdated.map((e) => [
              {
                id: e,
                lessonId: 'testLessonId1',
                orderIndex: stepIdStepOrderMap.get(e),
                createdAt: new Date(nowStr),
                externalLessonPlayerStepId: '0',
              },
            ]),
          )

          expect(lessonStepRepository.delete.mock.calls).toEqual(expectDeleted.map((e) => [e]))
        },
      )
    })
  })

  test('success', async () => {
    const datetimeRepository = createSuccessMockDatetimeRepository()
    const externalLessonPlayerLessonRepository = createSuccessMockExternalLessonPlayerLessonRepository()

    const lessonRepository = createSuccessMockLessonRepository()
    const lessonStepRepository = createSuccessMockLessonStepRepository()
    const useCase = new CreateLessonStepsUseCase(
      datetimeRepository,
      externalLessonPlayerLessonRepository,

      lessonRepository,
      lessonStepRepository,
    )

    const result = await useCase.run({
      lessonNameInLessonSheet: 'lessonNameInLessonSheet',
      externalLessonPlayerLessonSteps: [
        {
          stepId: '2',
          stepUrl: 'testStepUrl2',
          codexStepId: 'testLessonStepId2',
        },
        {
          stepId: '3',
          stepUrl: 'testStepUrl3',
          codexStepId: 'testLessonStepId3',
        },
      ],
    })

    expect(result.hasError).toEqual(false)
    expect(result.error).toBeNull()
    expect(result.value).toBeUndefined()
    expect(lessonStepRepository.create.mock.calls.length).toEqual(1)
    expect(lessonStepRepository.create.mock.calls[0][0]).toEqual({
      createdAt: new Date(nowStr),

      externalLessonPlayerStepId: '3',
      id: 'testLessonStepId3',
      lessonId: 'testLessonId1',
      orderIndex: 1,
    })
    expect(lessonStepRepository.update.mock.calls.length).toEqual(1)
    expect(lessonStepRepository.update.mock.calls[0][0]).toEqual({
      externalLessonPlayerStepId: '2',
      id: 'testLessonStepId2',
      lessonId: 'testLessonId1',
      orderIndex: 0,
      createdAt: new Date(nowStr),
    })

    expect(lessonStepRepository.delete.mock.calls.length).toEqual(1)
    expect(lessonStepRepository.delete.mock.calls[0][0]).toEqual('testLessonStepId1')
  })

  test('error on externalLessonPlayerLessonRepository.findByLessonSheetName', async () => {
    const datetimeRepository = createSuccessMockDatetimeRepository()
    const externalLessonPlayerLessonRepository = createSuccessMockExternalLessonPlayerLessonRepository()

    const lessonRepository = createSuccessMockLessonRepository()
    const lessonStepRepository = createSuccessMockLessonStepRepository()

    externalLessonPlayerLessonRepository.findByLessonSheetName = jest.fn(
      async (_lessonSheetName: string): Promise<Errorable<ExternalLessonPlayerLesson | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'error message',
          },
          value: null,
        }
      },
    )

    const useCase = new CreateLessonStepsUseCase(
      datetimeRepository,
      externalLessonPlayerLessonRepository,

      lessonRepository,
      lessonStepRepository,
    )

    const result = await useCase.run({
      lessonNameInLessonSheet: 'lessonNameInLessonSheet',
      externalLessonPlayerLessonSteps: [
        {
          stepId: '2',
          stepUrl: 'testStepUrl2',
          codexStepId: 'testLessonStepId2',
        },
        {
          stepId: '3',
          stepUrl: 'testStepUrl3',
          codexStepId: 'testLessonStepId3',
        },
      ],
    })

    expect(result.hasError).toEqual(true)
    expect(result.error).toEqual({
      type: 'UnknownRuntimeError',
      message: 'error message',
    })
    expect(result.value).toBeNull()
    expect(lessonStepRepository.create.mock.calls.length).toEqual(0)
  })

  test('error on lessonRepository.findById', async () => {
    const datetimeRepository = createSuccessMockDatetimeRepository()
    const externalLessonPlayerLessonRepository = createSuccessMockExternalLessonPlayerLessonRepository()

    const lessonRepository = createSuccessMockLessonRepository()
    const lessonStepRepository = createSuccessMockLessonStepRepository()

    lessonRepository.findById = jest.fn(async (_id: string): Promise<Errorable<Lesson | null, E<'UnknownRuntimeError'>>> => {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: 'error message',
        },
        value: null,
      }
    })

    const useCase = new CreateLessonStepsUseCase(
      datetimeRepository,
      externalLessonPlayerLessonRepository,

      lessonRepository,
      lessonStepRepository,
    )

    const result = await useCase.run({
      lessonNameInLessonSheet: 'lessonNameInLessonSheet',
      externalLessonPlayerLessonSteps: [
        {
          stepId: '2',
          stepUrl: 'testStepUrl2',
          codexStepId: 'testLessonStepId2',
        },
        {
          stepId: '3',
          stepUrl: 'testStepUrl3',
          codexStepId: 'testLessonStepId3',
        },
      ],
    })

    expect(result.hasError).toEqual(true)
    expect(result.error).toEqual({
      type: 'UnknownRuntimeError',
      message: 'error message',
    })
    expect(result.value).toBeNull()
    expect(lessonStepRepository.create.mock.calls.length).toEqual(0)
  })

  test('not found lesson on lessonRepository.findById', async () => {
    const datetimeRepository = createSuccessMockDatetimeRepository()
    const externalLessonPlayerLessonRepository = createSuccessMockExternalLessonPlayerLessonRepository()

    const lessonRepository = createSuccessMockLessonRepository()
    const lessonStepRepository = createSuccessMockLessonStepRepository()

    lessonRepository.findById = jest.fn(async (_id: string): Promise<Errorable<Lesson | null, E<'UnknownRuntimeError'>>> => {
      return {
        hasError: false,
        error: null,
        value: null,
      }
    })

    const useCase = new CreateLessonStepsUseCase(
      datetimeRepository,
      externalLessonPlayerLessonRepository,

      lessonRepository,
      lessonStepRepository,
    )

    const result = await useCase.run({
      lessonNameInLessonSheet: 'lessonNameInLessonSheet',
      externalLessonPlayerLessonSteps: [
        {
          stepId: '2',
          stepUrl: 'testStepUrl2',
          codexStepId: 'testLessonStepId2',
        },
        {
          stepId: '3',
          stepUrl: 'testStepUrl3',
          codexStepId: 'testLessonStepId3',
        },
      ],
    })

    expect(result.hasError).toEqual(true)
    expect(result.error).toEqual({
      message: 'Lesson not found in DB. lessonSheetName: lessonNameInLessonSheet, codexLessonId: codexLessonId1',
      type: 'LessonNotFound',
    })
    expect(result.value).toBeNull()
    expect(lessonStepRepository.create.mock.calls.length).toEqual(0)
  })

  test('response empty on externalLessonPlayerLessonRepository.findByLessonSheetName', async () => {
    const datetimeRepository = createSuccessMockDatetimeRepository()
    const externalLessonPlayerLessonRepository = createSuccessMockExternalLessonPlayerLessonRepository()

    const lessonRepository = createSuccessMockLessonRepository()
    const lessonStepRepository = createSuccessMockLessonStepRepository()

    externalLessonPlayerLessonRepository.findByLessonSheetName = jest.fn(
      async (_lessonSheetName: string): Promise<Errorable<ExternalLessonPlayerLesson | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      },
    )

    const useCase = new CreateLessonStepsUseCase(
      datetimeRepository,
      externalLessonPlayerLessonRepository,

      lessonRepository,
      lessonStepRepository,
    )

    const result = await useCase.run({
      lessonNameInLessonSheet: 'lessonNameInLessonSheet',
      externalLessonPlayerLessonSteps: [
        {
          stepId: '2',
          stepUrl: 'testStepUrl2',
          codexStepId: 'testLessonStepId2',
        },
        {
          stepId: '3',
          stepUrl: 'testStepUrl3',
          codexStepId: 'testLessonStepId3',
        },
      ],
    })

    expect(result.hasError).toEqual(true)
    expect(result.error).toEqual({
      message: 'Lesson not found by lesson sheet name. lessonSheetName: lessonNameInLessonSheet',
      type: 'LessonNotFound',
    })
    expect(result.value).toBeNull()
    expect(lessonStepRepository.create.mock.calls.length).toEqual(0)
  })

  test('error empty on lessonStepRepository.findByLessonId', async () => {
    const datetimeRepository = createSuccessMockDatetimeRepository()
    const externalLessonPlayerLessonRepository = createSuccessMockExternalLessonPlayerLessonRepository()

    const lessonRepository = createSuccessMockLessonRepository()
    const lessonStepRepository = createSuccessMockLessonStepRepository()

    lessonStepRepository.findByLessonId = jest.fn(async (_lessonId: string): Promise<Errorable<LessonStep[], E<'UnknownRuntimeError'>>> => {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: 'error message',
        },
        value: null,
      }
    })

    const useCase = new CreateLessonStepsUseCase(
      datetimeRepository,
      externalLessonPlayerLessonRepository,

      lessonRepository,
      lessonStepRepository,
    )

    const result = await useCase.run({
      lessonNameInLessonSheet: 'lessonNameInLessonSheet',
      externalLessonPlayerLessonSteps: [
        {
          stepId: '2',
          stepUrl: 'testStepUrl2',
          codexStepId: 'testLessonStepId2',
        },
        {
          stepId: '3',
          stepUrl: 'testStepUrl3',
          codexStepId: 'testLessonStepId3',
        },
      ],
    })

    expect(result.hasError).toEqual(true)
    expect(result.error).toEqual({
      message: 'error message',
      type: 'UnknownRuntimeError',
    })
    expect(result.value).toBeNull()
    expect(lessonStepRepository.create.mock.calls.length).toEqual(0)
  })

  test('error on datetimeRepository.now', async () => {
    const datetimeRepository = createSuccessMockDatetimeRepository()
    const externalLessonPlayerLessonRepository = createSuccessMockExternalLessonPlayerLessonRepository()

    const lessonRepository = createSuccessMockLessonRepository()
    const lessonStepRepository = createSuccessMockLessonStepRepository()

    datetimeRepository.now = jest.fn(async (): Promise<Errorable<Date, E<'UnknownRuntimeError'>>> => {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: 'error message',
        },
        value: null,
      }
    })

    const useCase = new CreateLessonStepsUseCase(
      datetimeRepository,
      externalLessonPlayerLessonRepository,

      lessonRepository,
      lessonStepRepository,
    )
    const result = await useCase.run({
      lessonNameInLessonSheet: 'lessonNameInLessonSheet',
      externalLessonPlayerLessonSteps: [
        {
          stepId: '2',
          stepUrl: 'testStepUrl2',
          codexStepId: 'testLessonStepId2',
        },
        {
          stepId: '3',
          stepUrl: 'testStepUrl3',
          codexStepId: 'testLessonStepId3',
        },
      ],
    })

    expect(result.hasError).toEqual(true)
    expect(result.error).toEqual({
      type: 'UnknownRuntimeError',
      message: 'error message',
    })
    expect(result.value).toBeNull()
    expect(lessonStepRepository.create.mock.calls.length).toEqual(0)
  })

  test('error on lessonStepRepository.create', async () => {
    const datetimeRepository = createSuccessMockDatetimeRepository()
    const externalLessonPlayerLessonRepository = createSuccessMockExternalLessonPlayerLessonRepository()

    const lessonRepository = createSuccessMockLessonRepository()
    const lessonStepRepository = createSuccessMockLessonStepRepository()

    lessonStepRepository.create = jest.fn(async (_lessonStep: LessonStep): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: 'error message',
        },
        value: null,
      }
    })

    const useCase = new CreateLessonStepsUseCase(
      datetimeRepository,
      externalLessonPlayerLessonRepository,

      lessonRepository,
      lessonStepRepository,
    )
    const result = await useCase.run({
      lessonNameInLessonSheet: 'lessonNameInLessonSheet',
      externalLessonPlayerLessonSteps: [
        {
          stepId: '2',
          stepUrl: 'testStepUrl2',
          codexStepId: 'testLessonStepId2',
        },
        {
          stepId: '3',
          stepUrl: 'testStepUrl3',
          codexStepId: 'testLessonStepId3',
        },
      ],
    })

    expect(result.hasError).toEqual(true)
    expect(result.error).toEqual({
      type: 'UnknownRuntimeError',
      message: 'error message',
    })
    expect(result.value).toBeNull()
  })

  test('error on lessonStepRepository.update', async () => {
    const datetimeRepository = createSuccessMockDatetimeRepository()
    const externalLessonPlayerLessonRepository = createSuccessMockExternalLessonPlayerLessonRepository()

    const lessonRepository = createSuccessMockLessonRepository()
    const lessonStepRepository = createSuccessMockLessonStepRepository()

    lessonStepRepository.update = jest.fn(async (_lessonStep: LessonStep): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: 'error message',
        },
        value: null,
      }
    })

    const useCase = new CreateLessonStepsUseCase(
      datetimeRepository,
      externalLessonPlayerLessonRepository,

      lessonRepository,
      lessonStepRepository,
    )
    const result = await useCase.run({
      lessonNameInLessonSheet: 'lessonNameInLessonSheet',
      externalLessonPlayerLessonSteps: [
        {
          stepId: '2',
          stepUrl: 'testStepUrl2',
          codexStepId: 'testLessonStepId2',
        },
        {
          stepId: '3',
          stepUrl: 'testStepUrl3',
          codexStepId: 'testLessonStepId3',
        },
      ],
    })

    expect(result.hasError).toEqual(true)
    expect(result.error).toEqual({
      type: 'UnknownRuntimeError',
      message: 'error message',
    })
    expect(result.value).toBeNull()
  })

  test('error on lessonStepRepository.delete', async () => {
    const datetimeRepository = createSuccessMockDatetimeRepository()
    const externalLessonPlayerLessonRepository = createSuccessMockExternalLessonPlayerLessonRepository()

    const lessonRepository = createSuccessMockLessonRepository()
    const lessonStepRepository = createSuccessMockLessonStepRepository()

    lessonStepRepository.delete = jest.fn(async (_lessonStepId: string): Promise<Errorable<void, E<'UnknownRuntimeError'>>> => {
      return {
        hasError: true,
        error: {
          type: 'UnknownRuntimeError',
          message: 'error message',
        },
        value: null,
      }
    })

    const useCase = new CreateLessonStepsUseCase(
      datetimeRepository,
      externalLessonPlayerLessonRepository,

      lessonRepository,
      lessonStepRepository,
    )
    const result = await useCase.run({
      lessonNameInLessonSheet: 'lessonNameInLessonSheet',
      externalLessonPlayerLessonSteps: [
        {
          stepId: '2',
          stepUrl: 'testStepUrl2',
          codexStepId: 'testLessonStepId2',
        },
        {
          stepId: '3',
          stepUrl: 'testStepUrl3',
          codexStepId: 'testLessonStepId3',
        },
      ],
    })

    expect(result.hasError).toEqual(true)
    expect(result.error).toEqual({
      type: 'UnknownRuntimeError',
      message: 'error message',
    })
    expect(result.value).toBeNull()
  })

  const createSuccessMockLessonRepository = () => {
    const repo: LessonRepository = {
      findById: async (_id: string): Promise<Errorable<Lesson | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            id: 'testLessonId1',
            url: 'testLessonUrl1',
            name: 'testName1',
            course: 'basic',
            theme: 'theme',
            skillsLearnedInThisLesson: 'skillsLearnedInThisLesson',
            lessonOverViewPdfUrl: 'lessonOverViewPdfUrl',
            lessonEnvironment: 'litLessonPlayer',
            description: 'testDescription1',
            lessonDuration: 'testLessonDuration',
            thumbnailImageUrl: 'testThumbnaliImageUrl',
            projectName: null,
            scenarioName: null,
            maxStarCount: 5,
            quizCount: 6,
            hintCount: 7,
            level: 'basic',
          },
        }
      },
    }

    return {
      findById: jest.fn((id: string) => repo.findById(id)),
    }
  }

  const createSuccessMockExternalLessonPlayerLessonRepository = () => {
    const repo: ExternalLessonPlayerLessonRepository = {
      findByLessonSheetName: async (_lessonSheetName: string): Promise<Errorable<ExternalLessonPlayerLesson | null, E<'UnknownRuntimeError'>>> => {
        return {
          hasError: false,
          error: null,
          value: {
            lessonSheetName: 'testLessonSheetName1',
            lessonSheetUrl: 'http://testLessonSheetUrl1',
            codexLessonId: 'codexLessonId1',
          },
        }
      },
    }

    return {
      findByLessonSheetName: jest.fn((lessonSheetName: string) => repo.findByLessonSheetName(lessonSheetName)),
    }
  }

  const createSuccessMockLessonStepRepository = () => {
    const repo: LessonStepRepository = {
      findByLessonId: async (_lessonId: string) => {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'testLessonStepId1',
              lessonId: 'testLessonId',
              orderIndex: 0,
              createdAt: new Date(nowStr),
              externalLessonPlayerStepId: '1',
            },
            {
              id: 'testLessonStepId2',
              lessonId: 'testLessonId',
              orderIndex: 1,
              createdAt: new Date(nowStr),
              externalLessonPlayerStepId: '2',
            },
          ],
        }
      },

      create: async (_lessonStep) => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
      update: async (_lessonStep) => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },

      delete: async (_lessonStepId: string) => {
        return {
          hasError: false,
          error: null,
          value: undefined,
        }
      },
    }

    return {
      findByLessonId: jest.fn((lessonId: string) => repo.findByLessonId(lessonId)),
      create: jest.fn((lessonStep: LessonStep) => repo.create(lessonStep)),
      update: jest.fn((lessonStep: LessonStep) => repo.update(lessonStep)),
      delete: jest.fn((lessonStepId: string) => repo.delete(lessonStepId)),
    }
  }
  const createSuccessMockDatetimeRepository = () => {
    const repo: DatetimeRepository = {
      now: async () => {
        return {
          hasError: false,
          error: null,
          value: new Date(nowStr),
        }
      },
    }

    return {
      now: jest.fn(() => repo.now()),
    }
  }
})
