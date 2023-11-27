import { HardCordedCodeillusionPackageCircleDefinitionRepository } from './HardCordedCodeillusionPackageCircleDefinitionRepository'

describe('HardCordedCodeillusionPackageCircleDefinitionRepository', () => {
  let hardCordedCodeillusionPackageCircleDefinitionRepository: HardCordedCodeillusionPackageCircleDefinitionRepository

  beforeAll(async () => {
    hardCordedCodeillusionPackageCircleDefinitionRepository = new HardCordedCodeillusionPackageCircleDefinitionRepository('http://localhost:3000')
  })

  test('findById', async () => {
    const res = await hardCordedCodeillusionPackageCircleDefinitionRepository.findById('circle-codeillusion-basic-goofy-game_development')

    if (res.hasError) {
      throw new Error(res.error.message)
    }
    expect(res.error).toBeNull()
    expect(res.value).toEqual({
      bookImageUrl: 'http://localhost:3000/images/b_goofy_book.png',
      bookName: 'Sound Machine',
      characterImageUrl: 'http://localhost:3000/images/b_goofy_character1.png',
      clearedCharacterImageUrl: 'http://localhost:3000/images/b_goofy_character1_completed.png',
      codeillusionPackageChapterDefinitionId: 'chapter-codeillusion-1',
      course: 'gameDevelopment',
      id: 'circle-codeillusion-basic-goofy-game_development',
    })
  })

  test('findByIds', async () => {
    const res = await hardCordedCodeillusionPackageCircleDefinitionRepository.findByIds([
      'circle-codeillusion-basic-goofy-game_development',
      'circle-codeillusion-basic-zootopia-web_design',
      'invalid',
    ])

    if (res.hasError) {
      throw new Error(res.error.message)
    }
    expect(res.error).toBeNull()
    expect(res.value).toEqual([
      {
        bookImageUrl: 'http://localhost:3000/images/b_goofy_book.png',
        bookName: 'Sound Machine',
        characterImageUrl: 'http://localhost:3000/images/b_goofy_character1.png',
        clearedCharacterImageUrl: 'http://localhost:3000/images/b_goofy_character1_completed.png',
        codeillusionPackageChapterDefinitionId: 'chapter-codeillusion-1',
        course: 'gameDevelopment',
        id: 'circle-codeillusion-basic-goofy-game_development',
      },
      {
        bookImageUrl: 'http://localhost:3000/images/b_zootopia_book.png',
        bookName: 'Person Finder Site',
        characterImageUrl: 'http://localhost:3000/images/b_zootopia_character1.png',
        clearedCharacterImageUrl: 'http://localhost:3000/images/b_zootopia_character1_completed.png',
        codeillusionPackageChapterDefinitionId: 'chapter-codeillusion-2',
        course: 'webDesign',
        id: 'circle-codeillusion-basic-zootopia-web_design',
      },
    ])
  })

  test('findByCodeillusionPackageChapterDefinitionId', async () => {
    const res = await hardCordedCodeillusionPackageCircleDefinitionRepository.findByCodeillusionPackageChapterDefinitionId('chapter-codeillusion-3')

    if (res.hasError) {
      throw new Error(res.error.message)
    }
    expect(res.error).toBeNull()
    expect(res.value).toEqual([
      {
        bookImageUrl: 'http://localhost:3000/images/b_sugar1_book.png',
        bookName: 'Dungeon Escape',
        characterImageUrl: 'http://localhost:3000/images/b_sugar1_character1.png',
        clearedCharacterImageUrl: 'http://localhost:3000/images/b_sugar1_character1_completed.png',
        codeillusionPackageChapterDefinitionId: 'chapter-codeillusion-3',
        course: 'gameDevelopment',
        id: 'circle-codeillusion-basic-sugar1-game_development',
      },
      {
        bookImageUrl: 'http://localhost:3000/images/b_beauty_book.png',
        bookName: 'Mirror Magic',
        characterImageUrl: 'http://localhost:3000/images/b_beauty_character1.png',
        clearedCharacterImageUrl: 'http://localhost:3000/images/b_beauty_character1_completed.png',
        codeillusionPackageChapterDefinitionId: 'chapter-codeillusion-3',
        course: 'mediaArt',
        id: 'circle-codeillusion-basic-beauty-media_art',
      },
    ])
  })
})
