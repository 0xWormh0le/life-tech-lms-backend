import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'

import { ConstructFreeTrialAccountsForSalesUsecase } from '../ConstructFreeTrialAccountsForSalesUsecase'

const codeillusionBasicLessonIds = [
  'lesson-codeillusion-basic-principal-gem-1',
  'lesson-codeillusion-basic-principal-gem-2',
  'lesson-codeillusion-basic-principal-gem-3',
  'lesson-codeillusion-basic-principal-gem-4',
  'lesson-codeillusion-basic-principal-gem-5',
  'lesson-codeillusion-basic-principal-book-1',
  'lesson-codeillusion-basic-mickey-gem-1',
  'lesson-codeillusion-basic-magic_quest-circle_magic-adventurous',
  'lesson-codeillusion-basic-magic_quest-circle_magic-heroic',
  'lesson-codeillusion-basic-mickey-gem-2',
  'lesson-codeillusion-basic-magic_quest-color_magic_a-adventurous',
  'lesson-codeillusion-basic-magic_quest-color_magic_a-heroic',
  'lesson-codeillusion-basic-magic_quest-color_magic_b-adventurous',
  'lesson-codeillusion-basic-magic_quest-color_magic_b-heroic',
  'lesson-codeillusion-basic-mickey-gem-3',
  'lesson-codeillusion-basic-mickey-book-1',
  'lesson-codeillusion-basic-donald-gem-1',
  'lesson-codeillusion-basic-donald-gem-2',
  'lesson-codeillusion-basic-donald-gem-3',
  'lesson-codeillusion-basic-magic_quest-image_magic-adventurous',
  'lesson-codeillusion-basic-magic_quest-image_magic-heroic',
  'lesson-codeillusion-basic-donald-gem-4',
  'lesson-codeillusion-basic-donald-book-1',
  'lesson-codeillusion-basic-magic_quest-hat_shop_site-adventurous',
  'lesson-codeillusion-basic-magic_quest-hat_shop_site-heroic',
  'lesson-codeillusion-basic-goofy-gem-1',
  'lesson-codeillusion-basic-goofy-gem-2',
  'lesson-codeillusion-basic-goofy-gem-3',
  'lesson-codeillusion-basic-goofy-gem-4',
  'lesson-codeillusion-basic-goofy-book-1',
  'lesson-codeillusion-basic-magic_quest-sound_machine-adventurous',
  'lesson-codeillusion-basic-magic_quest-sound_machine-heroic',
  'lesson-codeillusion-basic-aladdin-gem-1',
  'lesson-codeillusion-basic-magic_quest-sprite_magic_a-adventurous',
  'lesson-codeillusion-basic-magic_quest-sprite_magic_a-heroic',
  'lesson-codeillusion-basic-magic_quest-sprite_magic_b-adventurous',
  'lesson-codeillusion-basic-magic_quest-sprite_magic_b-heroic',
  'lesson-codeillusion-basic-aladdin-gem-2',
  'lesson-codeillusion-basic-aladdin-gem-3',
  'lesson-codeillusion-basic-aladdin-gem-4',
  'lesson-codeillusion-basic-magic_quest-sprite_magic_2-adventurous',
  'lesson-codeillusion-basic-magic_quest-sprite_magic_2-heroic',
  'lesson-codeillusion-basic-aladdin-gem-5',
  'lesson-codeillusion-basic-aladdin-book-1',
  'lesson-codeillusion-basic-magic_quest-flying_carpet-adventurous',
  'lesson-codeillusion-basic-magic_quest-flying_carpet-heroic',
  'lesson-codeillusion-basic-tangled-gem-1',
  'lesson-codeillusion-basic-tangled-gem-2',
  'lesson-codeillusion-basic-magic_quest-randomization_magic-adventurous',
  'lesson-codeillusion-basic-magic_quest-randomization_magic-heroic',
  'lesson-codeillusion-basic-tangled-gem-3',
  'lesson-codeillusion-basic-tangled-gem-4',
  'lesson-codeillusion-basic-tangled-book-1',
  'lesson-codeillusion-basic-zootopia-gem-1',
  'lesson-codeillusion-basic-zootopia-gem-2',
  'lesson-codeillusion-basic-zootopia-gem-3',
  'lesson-codeillusion-basic-zootopia-gem-4',
  'lesson-codeillusion-basic-zootopia-gem-5',
  'lesson-codeillusion-basic-zootopia-gem-6',
  'lesson-codeillusion-basic-magic_quest-styling_magic_3-adventurous',
  'lesson-codeillusion-basic-magic_quest-styling_magic_3-heroic',
  'lesson-codeillusion-basic-zootopia-book-1',
  'lesson-codeillusion-basic-zootopia-book-2',
  'lesson-codeillusion-basic-zootopia-book-3',
  'lesson-codeillusion-basic-magic_quest-person_finder_site-adventurous',
  'lesson-codeillusion-basic-magic_quest-person_finder_site-heroic',
  'lesson-codeillusion-basic-sugar1-gem-1',
  'lesson-codeillusion-basic-sugar1-gem-2',
  'lesson-codeillusion-basic-sugar1-gem-3',
]

const codeillusionAdvancedLessonIds = [
  'lesson-codeillusion-advanced-shop_ma-gem-1',
  'lesson-codeillusion-advanced-shop_ma-gem-2',
  'lesson-codeillusion-advanced-shop_ma-gem-3',
  'lesson-codeillusion-advanced-shop_ma-gem-4',
  'lesson-codeillusion-advanced-tangled-book-2',
  'lesson-codeillusion-advanced-tangled-book-3',
  'lesson-codeillusion-advanced-shop_game-gem-1',
  'lesson-codeillusion-advanced-shop_game-gem-2',
  'lesson-codeillusion-advanced-aladdin-book-2',
  'lesson-codeillusion-advanced-aladdin-book-3',
  'lesson-codeillusion-advanced-aladdin-book-4',
  'lesson-codeillusion-advanced-aladdin-book-5',
  'lesson-codeillusion-advanced-aladdin-book-6',
  'lesson-codeillusion-advanced-aladdin-book-7',
  'lesson-codeillusion-advanced-aladdin-book-8',
  'lesson-codeillusion-advanced-aladdin-book-9',
  'lesson-codeillusion-advanced-alice-book-6',
  'lesson-codeillusion-advanced-alice-book-7',
  'lesson-codeillusion-advanced-alice-book-8',
  'lesson-codeillusion-advanced-alice-book-9',
  'lesson-codeillusion-advanced-alice-book-10',
  'lesson-codeillusion-advanced-alice-book-11',
  'lesson-codeillusion-advanced-shop_ma-gem-5',
  'lesson-codeillusion-advanced-shop_ma-gem-6',
  'lesson-codeillusion-advanced-shop_ma-gem-7',
  'lesson-codeillusion-advanced-shop_ma-gem-8',
  'lesson-codeillusion-advanced-mermaid-book-4',
  'lesson-codeillusion-advanced-shop_wd-gem-1',
  'lesson-codeillusion-advanced-shop_wd-gem-2',
  'lesson-codeillusion-advanced-shop_wd-gem-3',
  'lesson-codeillusion-advanced-shop_wd-gem-4',
  'lesson-codeillusion-advanced-shop_wd-gem-5',
  'lesson-codeillusion-advanced-shop_wd-gem-6',
  'lesson-codeillusion-advanced-shop_wd-gem-7',
  'lesson-codeillusion-advanced-stitch-book-5',
  'lesson-codeillusion-advanced-stitch-book-6',
  'lesson-codeillusion-advanced-stitch-book-7',
  'lesson-codeillusion-advanced-stitch-book-8',
  'lesson-codeillusion-advanced-stitch-book-9',
  'lesson-codeillusion-advanced-stitch-book-10',
  'lesson-codeillusion-advanced-stitch-book-11',
  'lesson-codeillusion-advanced-pooh-book-6',
  'lesson-codeillusion-advanced-pooh-book-7',
]

const cseLessonIds = [
  'lesson-cse-is-00_01',
  'lesson-cse-is-00_02',
  'lesson-cse-is-00_03',
  'lesson-cse-is-00_05',
  'lesson-cse-is-00_07',
  'lesson-cse-is-00_quiz',
  'lesson-cse-cs-01_01',
  'lesson-cse-cs-01_02',
  'lesson-cse-cs-01_04',
  'lesson-cse-cs-01_03',
  'lesson-cse-cs-01_05',
  'lesson-cse-cs-01_quiz01',
  'lesson-cse-cs-01_06',
  'lesson-cse-cs-01_07',
  'lesson-cse-cs-01_08',
  'lesson-cse-cs-01_09',
  'lesson-cse-cs-01_10',
  'lesson-cse-cs-01_11',
  'lesson-cse-cs-01_12',
  'lesson-cse-cs-01_quiz02',
  'lesson-cse-cs-01_13',
  'lesson-cse-cs-01_14',
  'lesson-cse-cs-01_15',
  'lesson-cse-cs-01_16',
  'lesson-cse-cs-01_17',
  'lesson-cse-cs-01_18',
  'lesson-cse-cs-01_19',
  'lesson-cse-cs-01_20',
  'lesson-cse-cs-01_quiz03',
  'lesson-cse-nw-02_01',
  'lesson-cse-nw-02_02',
  'lesson-cse-nw-02_03',
  'lesson-cse-nw-02_04',
  'lesson-cse-nw-02_quiz01',
  'lesson-cse-nw-02_05',
  'lesson-cse-nw-02_06',
  'lesson-cse-nw-02_07',
  'lesson-cse-nw-02_08',
  'lesson-cse-nw-02_09',
  'lesson-cse-nw-02_10',
  'lesson-cse-nw-02_11',
  'lesson-cse-nw-02_12',
  'lesson-cse-nw-02_quiz02',
  'lesson-cse-nw-02_13',
  'lesson-cse-nw-02_14',
  'lesson-cse-nw-02_15',
  'lesson-cse-nw-02_16',
  'lesson-cse-nw-02_17',
  'lesson-cse-nw-02_quiz03',
]

const padWithZero = (num: number, targetLength: number) => {
  return String(num).padStart(targetLength, '0')
}

type UseCaseInput = Parameters<
  ConstructFreeTrialAccountsForSalesUsecase['run']
>['0']

export const createTeachers: (prefix: string) => UseCaseInput['teachers'] = (
  prefix,
) => {
  return [...Array(1000).keys()].map((i) => {
    const zeroPaddingNum = padWithZero(i + 1, 4)

    return {
      firstName: 'Trial',
      lastName: `${zeroPaddingNum}`,
      loginId: `${prefix}FT${zeroPaddingNum}`,
      password: `${prefix}FT${zeroPaddingNum}`,
    }
  })
}

export const createStudentGroups: (
  prefix: string,
) => UseCaseInput['studentGroups'] = (prefix) => {
  return [
    {
      name: 'Grade 4 - Class A',
      grade: '4',
      assignedPackages: [
        {
          curriculumPackageId: 'codeillusion-package-basic-full-standard',
          curriculumBrandId: 'codeillusion',
        },
      ],
      students: createStudents(prefix, 'grade4', 13),
    },
    {
      name: 'Grade 5 - Class B',
      grade: '5',
      assignedPackages: [
        {
          curriculumPackageId:
            'codeillusion-package-basic-and-advanced-full-standard',
          curriculumBrandId: 'codeillusion',
        },
      ],
      students: createStudents(prefix, 'grade5', 10),
    },
    {
      name: 'Grade 7 - Class C',
      grade: '7',
      assignedPackages: [
        {
          curriculumPackageId:
            'codeillusion-package-basic-full-premium-adventurous',
          curriculumBrandId: 'codeillusion',
        },
        {
          curriculumPackageId: 'cse-package-full-standard',
          curriculumBrandId: 'cse',
        },
      ],
      students: createStudents(prefix, 'grade7', 14),
    },
    {
      name: 'Grade 9 - Class D',
      grade: '9',
      assignedPackages: [
        {
          curriculumPackageId:
            'codeillusion-package-basic-and-advanced-full-premium-heroic',
          curriculumBrandId: 'codeillusion',
        },
        {
          curriculumPackageId: 'cse-package-full-standard',
          curriculumBrandId: 'cse',
        },
      ],
      students: createStudents(prefix, 'grade9', 8),
    },
  ]
}

const createStudents: (
  prefix: string,
  studentGroupPrefix: string,
  count: number,
) => UseCaseInput['studentGroups'][0]['students'] = (
  prefix,
  studentGroupPrefix,
  count,
) => {
  return [...Array(count).keys()].map((i) => {
    const zeroPaddingNum = padWithZero(i + 1, 2)

    return {
      nickName: faker.name.firstName(),
      loginId: `${prefix}-${studentGroupPrefix}-${zeroPaddingNum}`,
      password: `${prefix}-${studentGroupPrefix}-${zeroPaddingNum}`,
      userLessonStatuses: createUserLessonStatuses(i),
    }
  })
}

const createUserLessonStatuses: (
  index: number,
) => UseCaseInput['studentGroups'][0]['students'][0]['userLessonStatuses'] = (
  index: number,
) => {
  const pattern =
    userLessonStatusPatterns[
      index < userLessonStatusPatterns.length
        ? index
        : userLessonStatusPatterns.length - 1
    ]
  const now = dayjs('2023-08-12T09:00:00-05:00')
  const ret: UseCaseInput['studentGroups'][0]['students'][0]['userLessonStatuses'] =
    []

  for (const lessonIds of [
    codeillusionBasicLessonIds,
    codeillusionAdvancedLessonIds,
    cseLessonIds,
  ]) {
    for (const [index, lessonId] of lessonIds.entries()) {
      const progress = index / lessonIds.length
      const skipLessonRatio = Math.random()

      if (
        progress > pattern.progressRate ||
        skipLessonRatio < pattern.skipLessonRate
      ) {
        ret.push({
          lessonId,
          status: 'not_cleared',
          achievedStarCount: 0,
          stepIdSkippingDetected: false,
          correctAnsweredQuizCount: 0,
          usedHintCount: 0,
          startedAt: now.add(-2, 'hours').toDate(),
          finishedAt: null,
        })
      } else {
        const starRatio = Math.random()
        const achievedStarCount =
          starRatio < pattern.redRate
            ? 1
            : starRatio < pattern.yellowRate
            ? 2
            : 3
        const stepIdSkippingDetected = Math.random() < pattern.stepIdSkipRate
        const startedAt = now
          .add(index - lessonIds.length - 3 * Math.random(), 'days')
          .add(-60 + 120 * Math.random(), 'minutes')

        ret.push({
          lessonId,
          status: 'cleared',
          achievedStarCount,
          stepIdSkippingDetected,
          correctAnsweredQuizCount: 1,
          usedHintCount: 1,
          startedAt: startedAt.toDate(),
          finishedAt: startedAt.add(5 + 30 * Math.random(), 'minutes').toDate(),
        })
      }
    }
  }

  return ret
}
const userLessonStatusPatterns = [
  {
    progressRate: 0.95, // # of cleared / # of all lesson in package
    skipLessonRate: 0,
    yellowRate: 0.05,
    redRate: 0.01,
    stepIdSkipRate: 0,
  },
  {
    progressRate: 0.88, // # of cleared / # of all lesson in package
    skipLessonRate: 0.2,
    yellowRate: 0.05,
    redRate: 0.01,
    stepIdSkipRate: 0.4,
  },
  {
    progressRate: 0.81, // # of cleared / # of all lesson in package
    skipLessonRate: 0,
    yellowRate: 0.1,
    redRate: 0.05,
    stepIdSkipRate: 0,
  },
  {
    progressRate: 0.74, // # of cleared / # of all lesson in package
    skipLessonRate: 0,
    yellowRate: 0.4,
    redRate: 0.1,
    stepIdSkipRate: 0,
  },
  {
    progressRate: 0.55, // # of cleared / # of all lesson in package
    skipLessonRate: 0.1,
    yellowRate: 0.05,
    redRate: 0.01,
    stepIdSkipRate: 0,
  },
  {
    progressRate: 0.4, // # of cleared / # of all lesson in package
    skipLessonRate: 0.1,
    yellowRate: 0.1,
    redRate: 0.05,
    stepIdSkipRate: 0,
  },
  {
    progressRate: 0.3, // # of cleared / # of all lesson in package
    skipLessonRate: 0,
    yellowRate: 0.05,
    redRate: 0.01,
    stepIdSkipRate: 0,
  },
  {
    progressRate: 0.2, // # of cleared / # of all lesson in package
    skipLessonRate: 0,
    yellowRate: 0.1,
    redRate: 0.05,
    stepIdSkipRate: 0,
  },
  {
    progressRate: 0.1, // # of cleared / # of all lesson in package
    skipLessonRate: 0,
    yellowRate: 0.05,
    redRate: 0.01,
    stepIdSkipRate: 0,
  },
  {
    progressRate: 0.0, // # of cleared / # of all lesson in package
    skipLessonRate: 0,
    yellowRate: 0.1,
    redRate: 0.05,
    stepIdSkipRate: 0,
  },
  {
    progressRate: 0.0, // # of cleared / # of all lesson in package
    skipLessonRate: 0,
    yellowRate: 0.1,
    redRate: 0.05,
    stepIdSkipRate: 0,
  },
  {
    progressRate: 0.0, // # of cleared / # of all lesson in package
    skipLessonRate: 0,
    yellowRate: 0.1,
    redRate: 0.05,
    stepIdSkipRate: 0,
  },
  {
    progressRate: 0.0, // # of cleared / # of all lesson in package
    skipLessonRate: 0,
    yellowRate: 0.1,
    redRate: 0.05,
    stepIdSkipRate: 0,
  },
]
