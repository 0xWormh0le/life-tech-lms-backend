import { UserCodeIllusionPackage } from '../../domain/entities/codex/UserCodeIllusionPackage'

import {
  Errorable,
  E,
  fromNativeError,
} from '../../domain/usecases/shared/Errors'
import { DataSource } from 'typeorm'
import { ICodeillusionPackagesRepository } from '../../domain/usecases/codex/GetUserCodeillusionPackagesByUserIdUseCase'
import { UnaccessibleLesson } from '../../domain/entities/codex/UnaccessibleLesson'
import { CodexPackage } from '../../domain/entities/codex/CodexPackage'
import { packagesMapById } from '../typeorm/hardcoded-data/Pacakges/Packages'
import { packageLessonConfigurationsMapByPackageId } from '../typeorm/hardcoded-data/Pacakges/PackageLessonConfigurations'
import { codeillusionPackageChapterDefinitions } from '../typeorm/hardcoded-data/Pacakges/CodeillusionPackageChapterDefinitions'
import { codeillusionPackageCircleDefinitionsMapByChapterId as getCodeillusionPackageCircleDefinitionsMapByChapterId } from '../typeorm/hardcoded-data/Pacakges/CodeillusionPackageCircleDefinitions'
import { codeillusionPackageLessonDefinitionsMapByCircleId } from '../typeorm/hardcoded-data/Pacakges/CodeillusionPackageLessonDefinitions'
import {
  CodeillusionPackageCircleDefinition,
  CodeillusionPackageLessonDefinition,
} from '../../domain/entities/codex/CodeillusionPackageDefinition'
import { StudentGroupPackageAssignmentTypeormEntity } from '../typeorm/entity/StudentGroupPackageAssignment'
import { StudentGroupPackageAssignment } from '../../domain/entities/codex/StudentGroupPackageAssignment'

export const getUserCodeillusionPackageById = (
  staticFilesBaseUrl: string,
  packageId: string,
): UserCodeIllusionPackage | null => {
  const correspondingPackage = packagesMapById[packageId]

  if (!correspondingPackage) {
    return null
  }

  if (correspondingPackage.packageCategoryId !== 'codeillusion') {
    return null
  }

  const codeillusionPackageCircleDefinitionsMapByChapterId =
    getCodeillusionPackageCircleDefinitionsMapByChapterId(staticFilesBaseUrl)
  const packageLessonConfigurationByLessonId =
    packageLessonConfigurationsMapByPackageId[correspondingPackage.id]

  const necessaryCirclesByChapterId: Record<
    string,
    CodeillusionPackageCircleDefinition[]
  > = {}
  const necessaryLessonsByCircleId: Record<
    string,
    CodeillusionPackageLessonDefinition[]
  > = {}
  const necessaryChapters = codeillusionPackageChapterDefinitions(
    staticFilesBaseUrl,
  ).filter((chapterDefinition) => {
    necessaryCirclesByChapterId[chapterDefinition.id] =
      codeillusionPackageCircleDefinitionsMapByChapterId[
        chapterDefinition.id
      ].filter((circleDefinition) => {
        necessaryLessonsByCircleId[circleDefinition.id] =
          codeillusionPackageLessonDefinitionsMapByCircleId[
            circleDefinition.id
          ].filter((lessonDefinition) => {
            return !!packageLessonConfigurationByLessonId[
              lessonDefinition.lessonId
            ]
          })

        return necessaryLessonsByCircleId[circleDefinition.id].length > 0
      })

    return necessaryCirclesByChapterId[chapterDefinition.id].length > 0
  })

  if (necessaryChapters.length === 0) {
    return null
  }

  return {
    ...correspondingPackage,
    chapters: necessaryChapters.map((chapter) => ({
      ...chapter,
      circles: necessaryCirclesByChapterId[chapter.id].map((circle) => {
        const necessaryLessons = necessaryLessonsByCircleId[circle.id]

        return {
          ...circle,
          gemLessonIds: necessaryLessons
            .filter((lesson) => lesson.uiType === 'gem')
            .map((l) => l.lessonId),
          bookLessonIds: necessaryLessons
            .filter((lesson) => lesson.uiType === 'book')
            .map((l) => l.lessonId),
          allLessonIds: necessaryLessons.map((l) => l.lessonId),
        }
      }),
    })),
  }
}

export const getCombinePackageData = (
  packages: UserCodeIllusionPackage[],
): UserCodeIllusionPackage | null => {
  let combinePackage: UserCodeIllusionPackage | null = null

  for (const codeIllusionPackage of packages) {
    //check package exist or not
    if (!combinePackage) {
      combinePackage = { ...codeIllusionPackage }
    } else {
      //get package chapters
      for (const chapter of codeIllusionPackage.chapters) {
        //check chapter-id exists or not in package
        const chapterIndex = combinePackage.chapters.findIndex(
          (row) => row.id === chapter.id,
        )

        if (chapterIndex === -1) {
          combinePackage.chapters.push(chapter)
        } else {
          combinePackage.chapters[chapterIndex].name = chapter.name
          combinePackage.chapters[chapterIndex].title = chapter.title
          for (const circleData of chapter.circles) {
            const circle = circleData
            const circleIndex = combinePackage.chapters[
              chapterIndex
            ].circles.findIndex((row) => row.id === circleData.id)

            if (circleIndex === -1) {
              combinePackage.chapters[chapterIndex].circles.push(circle)
            } else {
              combinePackage.chapters[chapterIndex].circles[
                circleIndex
              ].course = circle.course
              combinePackage.chapters[chapterIndex].circles[
                circleIndex
              ].characterImageUrl = circle.characterImageUrl
              combinePackage.chapters[chapterIndex].circles[
                circleIndex
              ].clearedCharacterImageUrl = circle.clearedCharacterImageUrl
              for (const gemLessonId of circle.gemLessonIds) {
                const gemLessonIdIndex = combinePackage.chapters[
                  chapterIndex
                ].circles[circleIndex].gemLessonIds.findIndex(
                  (row) => row === gemLessonId,
                )

                if (gemLessonIdIndex === -1) {
                  combinePackage.chapters[chapterIndex].circles[
                    circleIndex
                  ].gemLessonIds.push(gemLessonId)
                }
              }
              for (const bookLessonId of circle.bookLessonIds) {
                const bookLessonIdIndex = combinePackage.chapters[
                  chapterIndex
                ].circles[circleIndex].bookLessonIds.findIndex(
                  (row) => row === bookLessonId,
                )

                if (bookLessonIdIndex === -1) {
                  combinePackage.chapters[chapterIndex].circles[
                    circleIndex
                  ].bookLessonIds.push(bookLessonId)
                }
              }
              combinePackage.chapters[chapterIndex].circles[
                circleIndex
              ].bookName = circle.bookName
              combinePackage.chapters[chapterIndex].circles[
                circleIndex
              ].bookImageUrl = circle.bookImageUrl
            }
          }
        }
      }
    }
  }

  return combinePackage
}

export class UserCodeillusionPackagesRepository
  implements ICodeillusionPackagesRepository
{
  constructor(
    private typeormDataSource: DataSource,
    private staticFilesBaseUrl: string,
  ) {}

  async getById(
    codeIllusionPackageId: string,
  ): Promise<
    Errorable<UserCodeIllusionPackage | null, E<'UnknownRuntimeError'>>
  > {
    return {
      hasError: false,
      error: null,
      value: getUserCodeillusionPackageById(
        this.staticFilesBaseUrl,
        codeIllusionPackageId,
      ),
    }
  }

  // For Magic Circle
  async getUserCodeillusionPacakgesByUserId(
    userId: string,
    studentDataResult: StudentGroupPackageAssignment[],
  ): Promise<
    Errorable<UserCodeIllusionPackage | null, E<'UnknownRuntimeError'>>
  > {
    try {
      const stundentGroupPackageIds = studentDataResult.map((i) => i.packageId)

      const userCodeillusionPackages: UserCodeIllusionPackage[] = []

      for (const packageId of stundentGroupPackageIds) {
        const userCodeillusionPackage = getUserCodeillusionPackageById(
          this.staticFilesBaseUrl,
          packageId,
        )

        if (!userCodeillusionPackage) {
          continue
        }

        const unaccessibleLessonByStudentGroupIdLessonId: Record<
          string,
          Record<string, UnaccessibleLesson>
        > = {}
        const userCodeillusionPackageExcludingUnaccessibleLessons: UserCodeIllusionPackage =
          {
            ...userCodeillusionPackage,
            chapters: userCodeillusionPackage.chapters.map((chapter) => {
              return {
                ...chapter,
                circles: chapter.circles.map((circle) => {
                  return {
                    ...circle,
                  }
                }),
              }
            }),
          }

        userCodeillusionPackages.push(
          userCodeillusionPackageExcludingUnaccessibleLessons,
        )
      }

      if (userCodeillusionPackages.length === 0) {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      }

      const combinedUserCodeillusionPackage = getCombinePackageData(
        userCodeillusionPackages,
      )

      return {
        hasError: false,
        error: null,
        value: combinedUserCodeillusionPackage,
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get codeIllusion package from db by user id ${userId}`,
        ),
        value: null,
      }
    }
  }

  async getAllCodexPackages(): Promise<
    Errorable<CodexPackage[], E<'UnknownRuntimeError'>>
  > {
    try {
      const packages = Object.values(packagesMapById)

      return {
        hasError: false,
        error: null,
        value: packages.map((e) => ({
          packageCategoryId: e.packageCategoryId,
          packageId: e.id,
          packageName: e.name,
        })),
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get codex packages `,
        ),
        value: null,
      }
    }
  }

  async getCodeIllusionPackagesByStudentGroupId(
    studentGroupId: string,
  ): Promise<
    Errorable<
      UserCodeIllusionPackage,
      | E<'UnknownRuntimeError'>
      | E<'PackageNotAssigned'>
      | E<'StudentGroupNotFound'>
    >
  > {
    const studentGroupPackageAssignmentTypeormEntity =
      this.typeormDataSource.getRepository(
        StudentGroupPackageAssignmentTypeormEntity,
      )

    try {
      const studentGroupPackageAssignmentResult =
        await studentGroupPackageAssignmentTypeormEntity
          .createQueryBuilder('student_group_package_assignment')
          .addSelect('student_group_package_assignment.package_id', 'packageId')
          .where(
            `
            student_group_package_assignment.student_group_id = :id AND
            student_group_package_assignment.package_id IN (:...packageIds)
            `,
            {
              id: studentGroupId,
              packageIds: Object.keys(packagesMapById).filter(
                (key) =>
                  packagesMapById[key].packageCategoryId === 'codeillusion',
              ),
            },
          )
          .getRawOne()

      if (!studentGroupPackageAssignmentResult) {
        return {
          hasError: true,
          error: {
            type: 'StudentGroupNotFound',
            message: `specified student group not found ${studentGroupId}`,
          },
          value: null,
        }
      }

      const codexPackages = getUserCodeillusionPackageById(
        this.staticFilesBaseUrl,
        studentGroupPackageAssignmentResult.packageId,
      )

      if (codexPackages) {
        return {
          hasError: false,
          error: null,
          value: codexPackages,
        }
      } else {
        return {
          hasError: true,
          error: {
            type: 'PackageNotAssigned',
            message: `No package is assigned to studentGroupId : ${studentGroupId}`,
          },
          value: null,
        }
      }
    } catch (e: unknown) {
      return {
        hasError: true,
        error: fromNativeError(
          'UnknownRuntimeError',
          e as Error,
          `failed to get student-group by student group id : ${studentGroupId}`,
        ),
        value: null,
      }
    }
  }
}
