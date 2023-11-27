import { UserCodeIllusionPackage } from '../../entities/codex/UserCodeIllusionPackage'
import { GetCodeillusionPackagesByPackageIdUseCase, ICodeillusionPackagesRepository } from './GetCodeillusionPackagesByPackageIdUseCase'
import { E, Errorable } from '../shared/Errors'
import { UserRoles } from '../shared/Constants'

const VALID_PACKAGE_ID = 'codeillusion-package-basic-full-standard'
const VALID_PACKAGE_DATA: UserCodeIllusionPackage = {
  id: 'codeillusion-package-basic-full-standard',
  level: 'basic',
  name: 'Package Name',
  headerButtonLink: 'headerButtonLink',
  headerButtonText: 'headerButtonText',
  redirectUrlWhenAllFinished: null,
  chapters: [
    {
      id: 'chapter-codeillusion-1',
      title: 'Welcome to Technologia',
      name: 'Chapter1',
      circles: [
        {
          id: 'circle-codeillusion-principal-basic',
          course: 'basic',
          gemLessonIds: [
            'lesson-codeillusion-basic-principal-gem-1',
            'lesson-codeillusion-basic-principal-gem-2',
            'lesson-codeillusion-basic-principal-gem-4',
            'lesson-codeillusion-basic-principal-gem-5',
          ],
          bookName: "The Principal's Test",
          bookLessonIds: ['lesson-codeillusion-basic-principal-book-1'],
          characterImageUrl: 'http://localhost:3080/images/b_principal_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_principal_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_principal_book.png',
          allLessonIds: [],
        },
        {
          id: 'circle-codeillusion-mickey-media_art',
          course: 'mediaArt',
          gemLessonIds: ['lesson-codeillusion-basic-mickey-gem-1', 'lesson-codeillusion-basic-mickey-gem-2', 'lesson-codeillusion-basic-mickey-gem-3'],
          bookName: 'Circle Art',
          bookLessonIds: [],
          characterImageUrl: 'http://localhost:3080/images/b_mickey_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_mickey_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_mickey_book.png',
          allLessonIds: [],
        },
        {
          id: 'circle-codeillusion-donald-web_design',
          course: 'webDesign',
          gemLessonIds: [
            'lesson-codeillusion-basic-donald-gem-1',
            'lesson-codeillusion-basic-donald-gem-2',
            'lesson-codeillusion-basic-donald-gem-3',
            'lesson-codeillusion-basic-donald-gem-4',
          ],
          bookName: "The Hat Shop's Website",
          bookLessonIds: ['lesson-codeillusion-basic-donald-book-1'],
          characterImageUrl: 'http://localhost:3080/images/b_donald_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_donald_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_donald_book.png',
          allLessonIds: [],
        },
        {
          id: 'circle-codeillusion-goofy-game_development',
          course: 'gameDevelopment',
          gemLessonIds: [
            'lesson-codeillusion-basic-goofy-gem-1',
            'lesson-codeillusion-basic-goofy-gem-2',
            'lesson-codeillusion-basic-goofy-gem-3',
            'lesson-codeillusion-basic-goofy-gem-4',
          ],
          bookName: 'Sound Machine',
          bookLessonIds: ['lesson-codeillusion-basic-goofy-book-1'],
          characterImageUrl: 'http://localhost:3080/images/b_goofy_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_goofy_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_goofy_book.png',
          allLessonIds: [],
        },
      ],
    },
    {
      id: 'chapter-codeillusion-2',
      title: 'When You Wish Upon a Magic Festival',
      name: 'Chapter2',
      circles: [
        {
          id: 'circle-codeillusion-tangled-media_art',
          course: 'mediaArt',
          gemLessonIds: [
            'lesson-codeillusion-basic-tangled-gem-1',
            'lesson-codeillusion-basic-tangled-gem-2',
            'lesson-codeillusion-basic-tangled-gem-3',
            'lesson-codeillusion-basic-tangled-gem-4',
          ],
          bookName: 'Sky Lanterns',
          bookLessonIds: ['lesson-codeillusion-basic-tangled-book-1'],
          characterImageUrl: 'http://localhost:3080/images/b_tangled_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_tangled_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_tangled_book.png',
          allLessonIds: [],
        },
        {
          id: 'circle-codeillusion-zootopia-web_design',
          course: 'webDesign',
          gemLessonIds: [
            'lesson-codeillusion-basic-zootopia-gem-1',
            'lesson-codeillusion-basic-zootopia-gem-2',
            'lesson-codeillusion-basic-zootopia-gem-3',
            'lesson-codeillusion-basic-zootopia-gem-4',
            'lesson-codeillusion-basic-zootopia-gem-5',
            'lesson-codeillusion-basic-zootopia-gem-6',
          ],
          bookName: 'Person Finder Site',
          bookLessonIds: [
            'lesson-codeillusion-basic-zootopia-book-1',
            'lesson-codeillusion-basic-zootopia-book-2',
            'lesson-codeillusion-basic-zootopia-book-3',
          ],
          characterImageUrl: 'http://localhost:3080/images/b_zootopia_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_zootopia_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_zootopia_book.png',
          allLessonIds: [],
        },
        {
          id: 'circle-codeillusion-aladdin-game_development',
          course: 'gameDevelopment',
          gemLessonIds: [
            'lesson-codeillusion-basic-aladdin-gem-1',
            'lesson-codeillusion-basic-aladdin-gem-2',
            'lesson-codeillusion-basic-aladdin-gem-3',
            'lesson-codeillusion-basic-aladdin-gem-4',
            'lesson-codeillusion-basic-aladdin-gem-5',
          ],
          bookName: 'Flying Carpet',
          bookLessonIds: ['lesson-codeillusion-basic-aladdin-book-1'],
          characterImageUrl: 'http://localhost:3080/images/b_aladdin_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_aladdin_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_aladdin_book.png',
          allLessonIds: [],
        },
      ],
    },
    {
      id: 'chapter-codeillusion-3',
      title: 'Beyond the Darkness',
      name: 'Chapter3',
      circles: [
        {
          id: 'circle-codeillusion-sugar1-game_development',
          course: 'gameDevelopment',
          gemLessonIds: [
            'lesson-codeillusion-basic-sugar1-gem-1',
            'lesson-codeillusion-basic-sugar1-gem-2',
            'lesson-codeillusion-basic-sugar1-gem-3',
            'lesson-codeillusion-basic-sugar1-gem-4',
          ],
          bookName: 'Dungeon Escape',
          bookLessonIds: ['lesson-codeillusion-basic-sugar1-book-1', 'lesson-codeillusion-basic-sugar1-book-2'],
          characterImageUrl: 'http://localhost:3080/images/b_sugar1_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_sugar1_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_sugar1_book.png',
          allLessonIds: [],
        },
        {
          id: 'circle-codeillusion-beauty-media_art',
          course: 'mediaArt',
          gemLessonIds: [
            'lesson-codeillusion-basic-beauty-gem-1',
            'lesson-codeillusion-basic-beauty-gem-2',
            'lesson-codeillusion-basic-beauty-gem-3',
            'lesson-codeillusion-basic-beauty-gem-4',
          ],
          bookName: 'Mirror Magic',
          bookLessonIds: [
            'lesson-codeillusion-basic-beauty-book-1',
            'lesson-codeillusion-basic-beauty-book-2',
            'lesson-codeillusion-basic-beauty-book-3',
            'lesson-codeillusion-basic-beauty-book-4',
            'lesson-codeillusion-basic-beauty-book-5',
          ],
          characterImageUrl: 'http://localhost:3080/images/b_beauty_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_beauty_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_beauty_book.png',
          allLessonIds: [],
        },
      ],
    },
    {
      id: 'chapter-codeillusion-4',
      title: 'Within the Time of Repetition',
      name: 'Chapter1',
      circles: [
        {
          id: 'circle-codeillusion-stitch-web_design',
          course: 'webDesign',
          gemLessonIds: [
            'lesson-codeillusion-basic-stitch-gem-1',
            'lesson-codeillusion-basic-stitch-gem-2',
            'lesson-codeillusion-basic-stitch-gem-3',
            'lesson-codeillusion-basic-stitch-gem-4',
          ],
          bookName: 'Photo Gallery',
          bookLessonIds: [
            'lesson-codeillusion-basic-stitch-book-1',
            'lesson-codeillusion-basic-stitch-book-2',
            'lesson-codeillusion-basic-stitch-book-3',
            'lesson-codeillusion-basic-stitch-book-4',
          ],
          characterImageUrl: 'http://localhost:3080/images/b_stitch_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_stitch_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_stitch_book.png',
          allLessonIds: [],
        },
        {
          id: 'circle-codeillusion-alice-game_development',
          course: 'gameDevelopment',
          gemLessonIds: ['lesson-codeillusion-basic-alice-gem-1', 'lesson-codeillusion-basic-alice-gem-3'],
          bookName: "Queen's Card",
          bookLessonIds: [
            'lesson-codeillusion-basic-alice-book-1',
            'lesson-codeillusion-basic-alice-book-2',
            'lesson-codeillusion-basic-alice-book-3',
            'lesson-codeillusion-basic-alice-book-4',
            'lesson-codeillusion-basic-alice-book-5',
          ],
          characterImageUrl: 'http://localhost:3080/images/b_alice_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_alice_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_alice_book.png',
          allLessonIds: [],
        },
        {
          id: 'circle-codeillusion-mermaid-media_art',
          course: 'mediaArt',
          gemLessonIds: ['lesson-codeillusion-basic-mermaid-gem-1', 'lesson-codeillusion-basic-mermaid-gem-2', 'lesson-codeillusion-basic-mermaid-gem-3'],
          bookName: 'School of Fish',
          bookLessonIds: ['lesson-codeillusion-basic-mermaid-book-1', 'lesson-codeillusion-basic-mermaid-book-2', 'lesson-codeillusion-basic-mermaid-book-3'],
          characterImageUrl: 'http://localhost:3080/images/b_mermaid_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_mermaid_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_mermaid_book.png',
          allLessonIds: [],
        },
      ],
    },
    {
      id: 'chapter-codeillusion-5',
      title: 'A Forecasted Journey',
      name: 'Chapter2',
      circles: [
        {
          id: 'circle-codeillusion-pooh-game_development',
          course: 'gameDevelopment',
          gemLessonIds: ['lesson-codeillusion-basic-pooh-gem-1', 'lesson-codeillusion-basic-pooh-gem-2'],
          bookName: 'Honey Hunt',
          bookLessonIds: [
            'lesson-codeillusion-basic-pooh-book-1',
            'lesson-codeillusion-basic-pooh-book-2',
            'lesson-codeillusion-basic-pooh-book-3',
            'lesson-codeillusion-basic-pooh-book-4',
            'lesson-codeillusion-basic-pooh-book-5',
          ],
          characterImageUrl: 'http://localhost:3080/images/b_pooh_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_pooh_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_pooh_book.png',
          allLessonIds: [],
        },
        {
          id: 'circle-codeillusion-bighero6-game_development',
          course: 'gameDevelopment',
          gemLessonIds: ['lesson-codeillusion-basic-bighero6-gem-1', 'lesson-codeillusion-basic-bighero6-gem-2'],
          bookName: 'Breaking Tiles',
          bookLessonIds: [
            'lesson-codeillusion-basic-bighero6-book-1',
            'lesson-codeillusion-basic-bighero6-book-2',
            'lesson-codeillusion-basic-bighero6-book-3',
            'lesson-codeillusion-basic-bighero6-book-4',
            'lesson-codeillusion-basic-bighero6-book-5',
          ],
          characterImageUrl: 'http://localhost:3080/images/b_bighero6_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_bighero6_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_bighero6_book.png',
          allLessonIds: [],
        },
      ],
    },
    {
      id: 'chapter-codeillusion-6',
      title: 'The Great Misfortune',
      name: 'Chapter3',
      circles: [
        {
          id: 'circle-codeillusion-snowwhite-game_development',
          course: 'gameDevelopment',
          gemLessonIds: ['lesson-codeillusion-basic-snowwhite-gem-1', 'lesson-codeillusion-basic-snowwhite-gem-2'],
          bookName: 'Jewel Puzzle',
          bookLessonIds: [
            'lesson-codeillusion-basic-snowwhite-book-1',
            'lesson-codeillusion-basic-snowwhite-book-2',
            'lesson-codeillusion-basic-snowwhite-book-3',
            'lesson-codeillusion-basic-snowwhite-book-4',
            'lesson-codeillusion-basic-snowwhite-book-5',
            'lesson-codeillusion-basic-snowwhite-book-6',
            'lesson-codeillusion-basic-snowwhite-book-7',
            'lesson-codeillusion-basic-snowwhite-book-8',
            'lesson-codeillusion-basic-snowwhite-book-9',
          ],
          characterImageUrl: 'http://localhost:3080/images/b_snowwhite_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_snowwhite_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_snowwhite_book.png',
          allLessonIds: [],
        },
        {
          id: 'circle-codeillusion-sugar2-game_development',
          course: 'gameDevelopment',
          gemLessonIds: ['lesson-codeillusion-basic-sugar2-gem-1', 'lesson-codeillusion-basic-sugar2-gem-2'],
          bookName: 'Wreck-It Ralph',
          bookLessonIds: [
            'lesson-codeillusion-basic-sugar2-book-1',
            'lesson-codeillusion-basic-sugar2-book-2',
            'lesson-codeillusion-basic-sugar2-book-3',
            'lesson-codeillusion-basic-sugar2-book-4',
            'lesson-codeillusion-basic-sugar2-book-5',
          ],
          characterImageUrl: 'http://localhost:3080/images/b_sugar2_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_sugar2_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_sugar2_book.png',
          allLessonIds: [],
        },
      ],
    },
    {
      id: 'chapter-codeillusion-7',
      title: 'Technologia',
      name: 'Chapter4',
      circles: [
        {
          id: 'circle-codeillusion-frozen-media_art',
          course: 'mediaArt',
          gemLessonIds: [
            'lesson-codeillusion-basic-frozen-gem-1',
            'lesson-codeillusion-basic-frozen-gem-2',
            'lesson-codeillusion-basic-frozen-gem-3',
            'lesson-codeillusion-basic-frozen-gem-4',
          ],
          bookName: 'Snow Magic',
          bookLessonIds: ['lesson-codeillusion-basic-frozen-book-1', 'lesson-codeillusion-basic-frozen-book-2', 'lesson-codeillusion-basic-frozen-book-3'],
          characterImageUrl: 'http://localhost:3080/images/b_frozen_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_frozen_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_frozen_book.png',
          allLessonIds: [],
        },
        {
          id: 'circle-codeillusion-sleepingbeauty-game_development',
          course: 'gameDevelopment',
          gemLessonIds: ['lesson-codeillusion-basic-sleepingbeauty-gem-1', 'lesson-codeillusion-basic-sleepingbeauty-gem-2'],
          bookName: 'Dragon & Sword',
          bookLessonIds: [
            'lesson-codeillusion-basic-sleepingbeauty-book-1',
            'lesson-codeillusion-basic-sleepingbeauty-book-2',
            'lesson-codeillusion-basic-sleepingbeauty-book-3',
          ],
          characterImageUrl: 'http://localhost:3080/images/b_sleepingbeauty_character1.png',
          clearedCharacterImageUrl: 'http://localhost:3080/images/b_sleepingbeauty_character1_completed.png',
          bookImageUrl: 'http://localhost:3080/images/b_sleepingbeauty_book.png',
          allLessonIds: [],
        },
      ],
    },
  ],
}

describe('test GetCodeillusionPackagesByPackageIdUseCase', () => {
  test('test GetCodeillusionPackagesByPackageIdUseCase - success with teacher/administrator/internalOperator role', async () => {
    const codeillusionPackagesRepository: ICodeillusionPackagesRepository = {
      getById: jest.fn(async function (packageId: string): Promise<Errorable<UserCodeIllusionPackage | null, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: VALID_PACKAGE_DATA,
        }
      }),
    }

    const usecase = new GetCodeillusionPackagesByPackageIdUseCase(codeillusionPackagesRepository)
    const result = await usecase.run({ id: 'requested-user-id', loginId: 'login-id', role: UserRoles.teacher }, VALID_PACKAGE_ID)

    expect(result.hasError).toEqual(false)

    const getByIdSpy = codeillusionPackagesRepository.getById as jest.Mock

    expect(getByIdSpy.mock.calls).toEqual([[VALID_PACKAGE_ID]])
    expect(result.value).toEqual(VALID_PACKAGE_DATA)
  })

  test('When codeillusion repository returns runtime error', async () => {
    const codeillusionPackagesRepository: ICodeillusionPackagesRepository = {
      getById: jest.fn(async function (packageId: string): Promise<Errorable<UserCodeIllusionPackage | null, E<'UnknownRuntimeError'>>> {
        return {
          hasError: true,
          error: {
            type: 'UnknownRuntimeError',
            message: 'something went wrong',
          },
          value: null,
        }
      }),
    }

    const usecase = new GetCodeillusionPackagesByPackageIdUseCase(codeillusionPackagesRepository)
    const result = await usecase.run({ id: 'requested-user-id', loginId: 'login-id', role: UserRoles.teacher }, VALID_PACKAGE_ID)

    expect(result.hasError).toEqual(true)

    const getByIdSpy = codeillusionPackagesRepository.getById as jest.Mock

    expect(getByIdSpy.mock.calls).toEqual([[VALID_PACKAGE_ID]])
    expect(result.error?.type).toEqual('UnknownRuntimeError')
    expect(result.value).toEqual(null)
  })

  test('When specified package not found', async () => {
    const codeillusionPackagesRepository: ICodeillusionPackagesRepository = {
      getById: jest.fn(async function (packageId: string): Promise<Errorable<UserCodeIllusionPackage | null, E<'UnknownRuntimeError'>>> {
        return {
          hasError: false,
          error: null,
          value: null,
        }
      }),
    }

    const usecase = new GetCodeillusionPackagesByPackageIdUseCase(codeillusionPackagesRepository)
    const result = await usecase.run({ id: 'requested-user-id', loginId: 'login-id', role: UserRoles.teacher }, VALID_PACKAGE_ID)

    expect(result.hasError).toEqual(true)
    expect(result.error).toEqual({
      type: 'CodeIllusionPackageNotFoundError',
      message: `The specified package not found for package id ${VALID_PACKAGE_ID}`,
    })
    expect(result.value).toEqual(null)
  })
})
