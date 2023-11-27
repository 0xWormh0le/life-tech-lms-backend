import { HardCordedCurriculumPackageLessonConfigurationRepository } from './HardCordedCurriculumPackageLessonConfigurationRepository'

describe('HardCordedCurriculumPackageLessonConfigurationRepository', () => {
  let hardCordedCurriculumPackageLessonConfigurationRepository: HardCordedCurriculumPackageLessonConfigurationRepository

  beforeAll(async () => {
    hardCordedCurriculumPackageLessonConfigurationRepository = new HardCordedCurriculumPackageLessonConfigurationRepository()
  })

  describe('findByCurriculumPackageIdAndLessonId', () => {
    test('success', async () => {
      const res = await hardCordedCurriculumPackageLessonConfigurationRepository.findByCurriculumPackageIdAndLessonId(
        'codeillusion-package-basic-full-premium-heroic',
        'lesson-codeillusion-basic-principal-gem-1',
      )

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toEqual({
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-principal-gem-1',
      })
    })

    test('with invalid curriculumPackageId', async () => {
      const res = await hardCordedCurriculumPackageLessonConfigurationRepository.findByCurriculumPackageIdAndLessonId(
        'invalidId',
        'lesson-codeillusion-basic-principal-gem-1',
      )

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })

    test('with invalid lessonId', async () => {
      const res = await hardCordedCurriculumPackageLessonConfigurationRepository.findByCurriculumPackageIdAndLessonId(
        'codeillusion-package-basic-full-premium-heroic',
        'invalidId',
      )

      if (res.hasError) {
        throw new Error(res.error.message)
      }
      expect(res.error).toBeNull()
      expect(res.value).toBeNull()
    })
  })

  test('findByCurriculumPackageId', async () => {
    const res = await hardCordedCurriculumPackageLessonConfigurationRepository.findByCurriculumPackageId('codeillusion-package-basic-full-premium-heroic')

    if (res.hasError) {
      throw new Error(res.error.message)
    }
    expect(res.error).toBeNull()
    expect(res.value).toEqual([
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-principal-gem-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-principal-gem-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-principal-gem-3',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-principal-gem-4',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-principal-gem-5',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-principal-book-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-mickey-gem-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_quest-circle_magic-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-mickey-gem-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_quest-color_magic_a-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_quest-color_magic_b-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-mickey-gem-3',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-mickey-book-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-donald-gem-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-donald-gem-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-donald-gem-3',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_quest-image_magic-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-donald-gem-4',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-donald-book-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_quest-hat_shop_site-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-goofy-gem-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-goofy-gem-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-goofy-gem-3',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-goofy-gem-4',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-goofy-book-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_quest-sound_machine-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-aladdin-gem-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_quest-sprite_magic_a-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_quest-sprite_magic_b-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-aladdin-gem-3',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-aladdin-gem-4',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_quest-sprite_magic_2-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-aladdin-gem-5',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-aladdin-book-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_quest-flying_carpet-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-tangled-gem-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-tangled-gem-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_quest-randomization_magic-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-tangled-gem-3',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-aladdin-gem-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-tangled-gem-4',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-tangled-book-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-zootopia-gem-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-zootopia-gem-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-zootopia-gem-3',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-zootopia-gem-4',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-zootopia-gem-5',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-zootopia-gem-6',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_quest-styling_magic_3-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-zootopia-book-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-zootopia-book-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-zootopia-book-3',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_quest-person_finder_site-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-sugar1-gem-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-sugar1-gem-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-sugar1-gem-3',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-sugar1-gem-4',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-sugar1-book-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-sugar1-book-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_quest-dungeon_escape-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-beauty-gem-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-beauty-gem-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-beauty-gem-3',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_quest-mosaic_magic-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-beauty-gem-4',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-beauty-book-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-beauty-book-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-beauty-book-3',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-beauty-book-4',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-beauty-book-5',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-mermaid-gem-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-mermaid-gem-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-mermaid-gem-3',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-mermaid-book-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-mermaid-book-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-mermaid-book-3',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_quest-school_of_fish-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-stitch-gem-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-stitch-gem-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-stitch-gem-3',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-stitch-gem-4',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-stitch-book-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-stitch-book-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-stitch-book-3',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-stitch-book-4',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_quest-photo_gallery-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-alice-gem-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-alice-gem-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-alice-gem-3',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-alice-book-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-alice-book-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-alice-book-3',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-alice-book-4',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-alice-book-5',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_quest-queens_card-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_journey-ma_1_4-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_journey-wd_1_4-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_journey-gd_1_4-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-pooh-gem-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_quest-camera_magic-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-pooh-gem-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-pooh-book-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-pooh-book-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-pooh-book-3',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-pooh-book-4',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-pooh-book-5',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-bighero6-gem-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-bighero6-gem-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_quest-click_magic_2-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-bighero6-book-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-bighero6-book-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-bighero6-book-3',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-bighero6-book-4',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-bighero6-book-5',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-snowwhite-gem-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-snowwhite-gem-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-snowwhite-book-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-snowwhite-book-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-snowwhite-book-3',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-snowwhite-book-4',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-snowwhite-book-5',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-snowwhite-book-6',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-snowwhite-book-7',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-snowwhite-book-8',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-snowwhite-book-9',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_quest-jewel_puzzle-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-sugar2-gem-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-sugar2-gem-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-sugar2-book-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-sugar2-book-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-sugar2-book-3',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-sugar2-book-4',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-sugar2-book-5',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_quest-sugar_rush-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-frozen-gem-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_quest-randomization_magic_2-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-frozen-gem-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-frozen-gem-3',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-frozen-gem-4',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-frozen-book-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-frozen-book-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-frozen-book-3',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-sleepingbeauty-gem-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-sleepingbeauty-gem-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-sleepingbeauty-book-1',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-sleepingbeauty-book-2',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-sleepingbeauty-book-3',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_quest-dragon_and_sword-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_journey-ma_1_7-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_journey-wd_1_7-heroic',
      },
      {
        curriculumPackageId: 'codeillusion-package-basic-full-premium-heroic',
        lessonId: 'lesson-codeillusion-basic-magic_journey-gd_1_7-heroic',
      },
    ])
  })
})
