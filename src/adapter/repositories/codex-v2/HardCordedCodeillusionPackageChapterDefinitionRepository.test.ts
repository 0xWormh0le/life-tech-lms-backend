import { HardCordedCodeillusionPackageChapterDefinitionRepository } from './HardCordedCodeillusionPackageChapterDefinitionRepository'

describe('HardCordedCodeillusionPackageChapterDefinitionRepository', () => {
  let hardCordedCodeillusionPackageChapterDefinitionRepository: HardCordedCodeillusionPackageChapterDefinitionRepository

  beforeAll(async () => {
    hardCordedCodeillusionPackageChapterDefinitionRepository = new HardCordedCodeillusionPackageChapterDefinitionRepository('http://localhost:3000')
  })

  test('findById', async () => {
    const res = await hardCordedCodeillusionPackageChapterDefinitionRepository.findById('chapter-codeillusion-1')

    if (res.hasError) {
      throw new Error(res.error.message)
    }
    expect(res.error).toBeNull()
    expect(res.value).toEqual({
      id: 'chapter-codeillusion-1',
      lessonNoteSheetsZipUrl: 'http://localhost:3000/teacher-resources/chapter-codeillusion-1-lesson-note-sheets.zip',
      lessonOverViewPdfUrl: 'http://localhost:3000/teacher-resources/chapter-codeillusion-1-lesson-overview.pdf',
      name: 'Chapter 1',
      title: 'Welcome to Technologia',
    })
  })

  test('findAll', async () => {
    const res = await hardCordedCodeillusionPackageChapterDefinitionRepository.findAll()

    if (res.hasError) {
      throw new Error(res.error.message)
    }
    expect(res.error).toBeNull()
    expect(res.value).toIncludeAllMembers([
      {
        id: 'chapter-codeillusion-3',
        lessonNoteSheetsZipUrl: 'http://localhost:3000/teacher-resources/chapter-codeillusion-3-lesson-note-sheets.zip',
        lessonOverViewPdfUrl: 'http://localhost:3000/teacher-resources/chapter-codeillusion-3-lesson-overview.pdf',
        name: 'Chapter 3',
        title: 'Beyond the Darkness',
      },
      {
        id: 'chapter-codeillusion-5',
        lessonNoteSheetsZipUrl: 'http://localhost:3000/teacher-resources/chapter-codeillusion-5-lesson-note-sheets.zip',
        lessonOverViewPdfUrl: 'http://localhost:3000/teacher-resources/chapter-codeillusion-5-lesson-overview.pdf',
        name: 'Chapter 5',
        title: 'A Forecasted Journey',
      },
    ])
  })

  test('findByIds', async () => {
    const res = await hardCordedCodeillusionPackageChapterDefinitionRepository.findByIds(['chapter-codeillusion-3', 'chapter-codeillusion-5', 'invalid'])

    if (res.hasError) {
      throw new Error(res.error.message)
    }
    expect(res.error).toBeNull()
    expect(res.value).toEqual([
      {
        id: 'chapter-codeillusion-3',
        lessonNoteSheetsZipUrl: 'http://localhost:3000/teacher-resources/chapter-codeillusion-3-lesson-note-sheets.zip',
        lessonOverViewPdfUrl: 'http://localhost:3000/teacher-resources/chapter-codeillusion-3-lesson-overview.pdf',
        name: 'Chapter 3',
        title: 'Beyond the Darkness',
      },
      {
        id: 'chapter-codeillusion-5',
        lessonNoteSheetsZipUrl: 'http://localhost:3000/teacher-resources/chapter-codeillusion-5-lesson-note-sheets.zip',
        lessonOverViewPdfUrl: 'http://localhost:3000/teacher-resources/chapter-codeillusion-5-lesson-overview.pdf',
        name: 'Chapter 5',
        title: 'A Forecasted Journey',
      },
    ])
  })
})
