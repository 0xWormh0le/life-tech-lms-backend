import { CsePackage } from '../../../entities/codex/CsePackage'
import { PackageLessonConfiguration } from '../../../entities/codex/PackageLessonConfiguration'
import { CsePackageLessonDefinition } from '../../../entities/codex/CsePackageDefinition'
import { CsePackageUnitDefinition } from '../../../entities/codex/CsePackageDefinition'
import { E, Errorable } from '../../shared/Errors'
import {
  GetCsePackageUseCase,
  ICsePackageLessonDefinitionRepository,
  ICsePackageRepository,
  ICsePackageUnitDefinitionRepository,
  IPackageLessonConfigurationRepository,
} from './GetCsePackageUseCase'

describe('test GetCsePackageUseCase', () => {
  test('success', async () => {
    const csePackageRepository: ICsePackageRepository = {
      getById: jest.fn(async function (id: string): Promise<Errorable<Omit<CsePackage, 'units'> | null, E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: {
            id,
            name: 'package-name-1',
            headerButtonLink: 'package-headerButtonLink-1',
            headerButtonText: 'package-headerButtonText-1',
          },
        }
      }),
    }
    const packageLessonConfigurationRepository: IPackageLessonConfigurationRepository = {
      getByPackageIdAndLessonId: jest.fn(async function (
        packageId: string,
        lessonId: string,
      ): Promise<Errorable<PackageLessonConfiguration | null, E<'UnknownRuntimeError', string>>> {
        if (lessonId === 'lessonId-1') {
          return {
            hasError: false,
            error: null,
            value: {
              packageId,
              lessonId: 'lessonId-1',
            },
          }
        }

        if (lessonId === 'lessonId-2') {
          return {
            hasError: false,
            error: null,
            value: {
              packageId,
              lessonId: 'lessonId-2',
            },
          }
        }

        if (lessonId === 'lessonId-3') {
          return {
            hasError: false,
            error: null,
            value: {
              packageId,
              lessonId: 'lessonId-3',
            },
          }
        } else {
          return {
            hasError: false,
            error: null,
            value: null,
          }
        }
      }),
    }
    const csePackageLessonDefinitionRepository: ICsePackageLessonDefinitionRepository = {
      getAllByUnitDefinitionId: jest.fn(async function (
        unitDefinitionId: string,
      ): Promise<Errorable<CsePackageLessonDefinition[], E<'UnknownRuntimeError', string>>> {
        if (unitDefinitionId === 'unitId-1') {
          return {
            hasError: false,
            error: null,
            value: [
              {
                lessonId: 'lessonId-1',
                csePackageUnitDefinitionId: 'unitId-1',
                isQuizLesson: false,
              },
              {
                lessonId: 'lessonId-2',
                csePackageUnitDefinitionId: 'unitId-1',
                isQuizLesson: true,
              },
            ],
          }
        }

        if (unitDefinitionId === 'unitId-2') {
          return {
            hasError: false,
            error: null,
            value: [
              {
                lessonId: 'lessonId-3',
                csePackageUnitDefinitionId: 'unitId-2',
                isQuizLesson: false,
              },
              {
                lessonId: 'lessonId-4',
                csePackageUnitDefinitionId: 'unitId-2',
                isQuizLesson: true,
              },
            ],
          }
        }

        if (unitDefinitionId === 'unitId-3') {
          return {
            hasError: false,
            error: null,
            value: [
              {
                lessonId: 'lessonId-5',
                csePackageUnitDefinitionId: 'unitId-3',
                isQuizLesson: false,
              },
              {
                lessonId: 'lessonId-6',
                csePackageUnitDefinitionId: 'unitId-3',
                isQuizLesson: true,
              },
            ],
          }
        }
        throw new Error(`unexpected unitDefinitionId ${unitDefinitionId} passed`)
      }),
    }
    const csePackageUnitDefinitionRepository: ICsePackageUnitDefinitionRepository = {
      getAll: jest.fn(async function (): Promise<Errorable<CsePackageUnitDefinition[], E<'UnknownRuntimeError', string>>> {
        return {
          hasError: false,
          error: null,
          value: [
            {
              id: 'unitId-1',
              name: 'unit-name-1',
              description: 'unit-description-1',
            },
            {
              id: 'unitId-2',
              name: 'unit-name-2',
              description: 'unit-description-2',
            },
            {
              id: 'unitId-3',
              name: 'unit-name-3',
              description: 'unit-description-3',
            },
          ],
        }
      }),
    }

    const usecase = new GetCsePackageUseCase(
      csePackageRepository,
      packageLessonConfigurationRepository,
      csePackageUnitDefinitionRepository,
      csePackageLessonDefinitionRepository,
    )
    const result = await usecase.run('package-id')

    if (result.hasError) {
      throw new Error(`GetCsePackageUseCase failed ${result.error}`)
    }
    expect(result.value).toEqual<typeof result.value>({
      id: 'package-id',
      name: 'package-name-1',
      headerButtonLink: 'package-headerButtonLink-1',
      headerButtonText: 'package-headerButtonText-1',
      units: [
        {
          id: 'unitId-1',
          name: 'unit-name-1',
          description: 'unit-description-1',
          lessons: [
            { id: 'lessonId-1', isQuizLesson: false },
            { id: 'lessonId-2', isQuizLesson: true },
          ],
        },
        {
          id: 'unitId-2',
          name: 'unit-name-2',
          description: 'unit-description-2',
          lessons: [{ id: 'lessonId-3', isQuizLesson: false }],
        },
      ],
    })
  })
})
