import { HardCordedCsePackageLessonDefinitionRepository } from './HardCordedCsePackageLessonDefinitionRepository'

describe('HardCordedCsePackageLessonDefinitionRepository', () => {
  let hardCordedCsePackageLessonDefinitionRepository: HardCordedCsePackageLessonDefinitionRepository

  beforeAll(async () => {
    hardCordedCsePackageLessonDefinitionRepository = new HardCordedCsePackageLessonDefinitionRepository()
  })

  test('findByCsePackageUnitDefinitionIdAndLessonId', async () => {
    const res = await hardCordedCsePackageLessonDefinitionRepository.findByCsePackageUnitDefinitionIdAndLessonId('unit-cse-2', 'lesson-cse-cs-01_03')

    if (res.hasError) {
      throw new Error(res.error.message)
    }
    expect(res.error).toBeNull()
    expect(res.value).toEqual({
      csePackageUnitDefinitionId: 'unit-cse-2',
      isQuizLesson: false,
      lessonId: 'lesson-cse-cs-01_03',
    })
  })

  test('findByCsePackageUnitDefinitionId', async () => {
    const res = await hardCordedCsePackageLessonDefinitionRepository.findByCsePackageUnitDefinitionId('unit-cse-3')

    if (res.hasError) {
      throw new Error(res.error.message)
    }
    expect(res.error).toBeNull()
    expect(res.value).toEqual([
      {
        csePackageUnitDefinitionId: 'unit-cse-3',
        isQuizLesson: false,
        lessonId: 'lesson-cse-cs-01_06',
      },
      {
        csePackageUnitDefinitionId: 'unit-cse-3',
        isQuizLesson: false,
        lessonId: 'lesson-cse-cs-01_07',
      },
      {
        csePackageUnitDefinitionId: 'unit-cse-3',
        isQuizLesson: false,
        lessonId: 'lesson-cse-cs-01_08',
      },
      {
        csePackageUnitDefinitionId: 'unit-cse-3',
        isQuizLesson: false,
        lessonId: 'lesson-cse-cs-01_09',
      },
      {
        csePackageUnitDefinitionId: 'unit-cse-3',
        isQuizLesson: false,
        lessonId: 'lesson-cse-cs-01_10',
      },
      {
        csePackageUnitDefinitionId: 'unit-cse-3',
        isQuizLesson: false,
        lessonId: 'lesson-cse-cs-01_11',
      },
      {
        csePackageUnitDefinitionId: 'unit-cse-3',
        isQuizLesson: false,
        lessonId: 'lesson-cse-cs-01_12',
      },
      {
        csePackageUnitDefinitionId: 'unit-cse-3',
        isQuizLesson: true,
        lessonId: 'lesson-cse-cs-01_quiz02',
      },
    ])
  })
})
