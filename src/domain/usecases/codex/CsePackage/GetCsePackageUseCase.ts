import { CsePackage } from '../../../entities/codex/CsePackage'
import {
  CsePackageLessonDefinition,
  CsePackageUnitDefinition,
} from '../../../entities/codex/CsePackageDefinition'
import { PackageLessonConfiguration } from '../../../entities/codex/PackageLessonConfiguration'
import { Errorable, E, wrapError } from '../../shared/Errors'

export interface ICsePackageRepository {
  getById(
    id: string,
  ): Promise<
    Errorable<Omit<CsePackage, 'units'> | null, E<'UnknownRuntimeError'>>
  >
}

export interface IPackageLessonConfigurationRepository {
  getByPackageIdAndLessonId(
    packageId: string,
    lessonId: string,
  ): Promise<
    Errorable<PackageLessonConfiguration | null, E<'UnknownRuntimeError'>>
  >
}

export interface ICsePackageUnitDefinitionRepository {
  getAll(): Promise<
    Errorable<CsePackageUnitDefinition[], E<'UnknownRuntimeError'>>
  >
}

export interface ICsePackageLessonDefinitionRepository {
  getAllByUnitDefinitionId(
    unitDefinitionId: string,
  ): Promise<Errorable<CsePackageLessonDefinition[], E<'UnknownRuntimeError'>>>
}

export class GetCsePackageUseCase {
  constructor(
    private csePackageRepository: ICsePackageRepository,
    private packageLessonConfigurationRepository: IPackageLessonConfigurationRepository,
    private csePackageUnitDefinitionRepository: ICsePackageUnitDefinitionRepository,
    private csePackageLessonDefinitionRepository: ICsePackageLessonDefinitionRepository,
  ) {}

  async run(
    packageId: string,
  ): Promise<
    Errorable<CsePackage, E<'NotFoundError'> | E<'UnknownRuntimeError'>>
  > {
    const getCsePackageResult = await this.csePackageRepository.getById(
      packageId,
    )

    if (getCsePackageResult.hasError) {
      return {
        hasError: true,
        error: wrapError(getCsePackageResult.error, ''),
        value: null,
      }
    }

    if (getCsePackageResult.value === null) {
      return {
        hasError: true,
        error: {
          type: 'NotFoundError',
          message: `package id ${packageId} not found`,
        },
        value: null,
      }
    }

    const getCsePackageUnitDefinitionResult =
      await this.csePackageUnitDefinitionRepository.getAll()

    if (getCsePackageUnitDefinitionResult.hasError) {
      return {
        hasError: true,
        error: wrapError(getCsePackageUnitDefinitionResult.error, ''),
        value: null,
      }
    }

    const units: CsePackage['units'] = []

    for (const unitDefinition of getCsePackageUnitDefinitionResult.value) {
      const lessons: CsePackage['units'][0]['lessons'] = []
      const getCsePackageLessonDefinitionResult =
        await this.csePackageLessonDefinitionRepository.getAllByUnitDefinitionId(
          unitDefinition.id,
        )

      if (getCsePackageLessonDefinitionResult.hasError) {
        return {
          hasError: true,
          error: wrapError(getCsePackageLessonDefinitionResult.error, ''),
          value: null,
        }
      }
      for (const lessonDefinition of getCsePackageLessonDefinitionResult.value) {
        const getPackageLessonConfigurationResult =
          await this.packageLessonConfigurationRepository.getByPackageIdAndLessonId(
            packageId,
            lessonDefinition.lessonId,
          )

        if (getPackageLessonConfigurationResult.hasError) {
          return {
            hasError: true,
            error: wrapError(getPackageLessonConfigurationResult.error, ''),
            value: null,
          }
        }

        if (getPackageLessonConfigurationResult.value) {
          lessons.push({
            id: lessonDefinition.lessonId,
            isQuizLesson: lessonDefinition.isQuizLesson,
          })
        }
      }

      if (lessons.length > 0) {
        units.push({
          id: unitDefinition.id,
          name: unitDefinition.name,
          description: unitDefinition.description,
          lessons,
        })
      }
    }

    return {
      hasError: false,
      error: null,
      value: {
        id: packageId,
        name: getCsePackageResult.value.name,
        headerButtonLink: getCsePackageResult.value.headerButtonLink,
        headerButtonText: getCsePackageResult.value.headerButtonText,
        units,
      },
    }
  }
}
