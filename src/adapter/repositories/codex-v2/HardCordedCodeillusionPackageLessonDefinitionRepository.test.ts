import { HardCordedCodeillusionPackageLessonDefinitionRepository } from './HardCordedCodeillusionPackageLessonDefinitionRepository'

describe('HardCordedCodeillusionPackageLessonDefinitionRepository', () => {
  let hardCordedCodeillusionPackageLessonDefinitionRepository: HardCordedCodeillusionPackageLessonDefinitionRepository

  beforeAll(async () => {
    hardCordedCodeillusionPackageLessonDefinitionRepository = new HardCordedCodeillusionPackageLessonDefinitionRepository()
  })

  test('findByCodeillusionPackageCircleDefinitionIdAndLessonId', async () => {
    const res = await hardCordedCodeillusionPackageLessonDefinitionRepository.findByCodeillusionPackageCircleDefinitionIdAndLessonId(
      'circle-codeillusion-basic-goofy-game_development',
      'lesson-codeillusion-basic-goofy-gem-1',
    )

    if (res.hasError) {
      throw new Error(res.error.message)
    }
    expect(res.error).toBeNull()
    expect(res.value).toEqual({
      codeillusionPackageCircleDefinitionId: 'circle-codeillusion-basic-goofy-game_development',
      lessonId: 'lesson-codeillusion-basic-goofy-gem-1',
      uiType: 'gem',
    })
  })

  test('findByCodeillusionPackageCircleDefinitionId', async () => {
    const res = await hardCordedCodeillusionPackageLessonDefinitionRepository.findByCodeillusionPackageCircleDefinitionId(
      'circle-codeillusion-basic-donald-web_design',
    )

    if (res.hasError) {
      throw new Error(res.error.message)
    }
    expect(res.error).toBeNull()
    expect(res.value).toEqual([
      {
        codeillusionPackageCircleDefinitionId: 'circle-codeillusion-basic-donald-web_design',
        lessonId: 'lesson-codeillusion-basic-donald-gem-1',
        uiType: 'gem',
      },
      {
        codeillusionPackageCircleDefinitionId: 'circle-codeillusion-basic-donald-web_design',
        lessonId: 'lesson-codeillusion-basic-donald-gem-2',
        uiType: 'gem',
      },
      {
        codeillusionPackageCircleDefinitionId: 'circle-codeillusion-basic-donald-web_design',
        lessonId: 'lesson-codeillusion-basic-donald-gem-3',
        uiType: 'gem',
      },
      {
        codeillusionPackageCircleDefinitionId: 'circle-codeillusion-basic-donald-web_design',
        lessonId: 'lesson-codeillusion-basic-magic_quest-image_magic-adventurous',
        uiType: 'magicQuest',
      },
      {
        codeillusionPackageCircleDefinitionId: 'circle-codeillusion-basic-donald-web_design',
        lessonId: 'lesson-codeillusion-basic-magic_quest-image_magic-heroic',
        uiType: 'magicQuest',
      },
      {
        codeillusionPackageCircleDefinitionId: 'circle-codeillusion-basic-donald-web_design',
        lessonId: 'lesson-codeillusion-basic-donald-gem-4',
        uiType: 'gem',
      },
      {
        codeillusionPackageCircleDefinitionId: 'circle-codeillusion-basic-donald-web_design',
        lessonId: 'lesson-codeillusion-basic-donald-book-1',
        uiType: 'book',
      },
      {
        codeillusionPackageCircleDefinitionId: 'circle-codeillusion-basic-donald-web_design',
        lessonId: 'lesson-codeillusion-basic-magic_quest-hat_shop_site-adventurous',
        uiType: 'magicQuest',
      },
      {
        codeillusionPackageCircleDefinitionId: 'circle-codeillusion-basic-donald-web_design',
        lessonId: 'lesson-codeillusion-basic-magic_quest-hat_shop_site-heroic',
        uiType: 'magicQuest',
      },
    ])
  })
})
