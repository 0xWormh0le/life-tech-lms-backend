import { HardCordedLessonRepository } from './HardCordedLessonRepository'

describe('HardCordedLessonRepository', () => {
  let hardCordedLessonRepository: HardCordedLessonRepository

  beforeAll(async () => {
    hardCordedLessonRepository = new HardCordedLessonRepository('http://assets.lit.com', 'http://player.lit.com')
  })

  test('findById', async () => {
    const res = await hardCordedLessonRepository.findById('lesson-codeillusion-basic-principal-gem-2')

    if (res.hasError) {
      throw new Error(res.error.message)
    }
    expect(res.error).toBeNull()
    expect(res.value).toEqual<typeof res.value>({
      course: 'basic',
      description: 'Learn dragging and dropping, two basic functions of controlling a mouse.',
      hintCount: 0,
      id: 'lesson-codeillusion-basic-principal-gem-2',
      theme: '',
      skillsLearnedInThisLesson: '',
      lessonOverViewPdfUrl: 'http://assets.lit.com/teacher-resources/lesson-codeillusion-basic-principal-gems.pdf',
      lessonDuration: '3-5min',
      lessonEnvironment: 'litLessonPlayer',
      level: 'basic',
      maxStarCount: 3,
      name: 'Drag and Drop Magic',
      projectName: 'principal',
      quizCount: 0,
      scenarioName: 'g_principal_2',
      thumbnailImageUrl: 'http://assets.lit.com/images/g_principal_2.gif',
      url: 'http://player.lit.com/player/step?project_name=principal&scenario_path=lesson/g_principal_2',
    })
  })

  test('findByIds', async () => {
    const res = await hardCordedLessonRepository.findByIds(['lesson-codeillusion-basic-principal-gem-2', 'lesson-cse-is-00_02', 'invalid'])

    if (res.hasError) {
      throw new Error(res.error.message)
    }
    expect(res.error).toBeNull()
    expect(res.value).toEqual<typeof res.value>([
      {
        course: 'basic',
        description: 'Learn dragging and dropping, two basic functions of controlling a mouse.',
        hintCount: 0,
        id: 'lesson-codeillusion-basic-principal-gem-2',
        theme: '',
        skillsLearnedInThisLesson: '',
        lessonOverViewPdfUrl: 'http://assets.lit.com/teacher-resources/lesson-codeillusion-basic-principal-gems.pdf',
        lessonDuration: '3-5min',
        lessonEnvironment: 'litLessonPlayer',
        level: 'basic',
        maxStarCount: 3,
        name: 'Drag and Drop Magic',
        projectName: 'principal',
        quizCount: 0,
        scenarioName: 'g_principal_2',
        thumbnailImageUrl: 'http://assets.lit.com/images/g_principal_2.gif',
        url: 'http://player.lit.com/player/step?project_name=principal&scenario_path=lesson/g_principal_2',
      },
      {
        course: '',
        description: 'Learn the characteristics or the essence of information.',
        hintCount: 0,
        id: 'lesson-cse-is-00_02',
        theme: '',
        skillsLearnedInThisLesson: '',
        lessonOverViewPdfUrl: '',
        lessonDuration: '20 min',
        lessonEnvironment: 'litLessonPlayer',
        level: 'basic',
        maxStarCount: 0,
        name: 'Information Characteristics',
        projectName: 'information1',
        quizCount: 3,
        scenarioName: '00_02',
        thumbnailImageUrl: '',
        url: 'http://player.lit.com/player/step?project_name=information1&scenario_path=lesson/00_02',
      },
    ])
  })

  test('findAll', async () => {
    const res = await hardCordedLessonRepository.findAll()

    if (res.hasError) {
      throw new Error(res.error.message)
    }
    expect(res.error).toBeNull()
    expect(res.value).toContainValues<(typeof res.value)[0]>([
      {
        course: 'basic',
        description: 'Learn dragging and dropping, two basic functions of controlling a mouse.',
        hintCount: 0,
        id: 'lesson-codeillusion-basic-principal-gem-2',
        theme: '',
        skillsLearnedInThisLesson: '',
        lessonOverViewPdfUrl: 'http://assets.lit.com/teacher-resources/lesson-codeillusion-basic-principal-gems.pdf',
        lessonDuration: '3-5min',
        lessonEnvironment: 'litLessonPlayer',
        level: 'basic',
        maxStarCount: 3,
        name: 'Drag and Drop Magic',
        projectName: 'principal',
        quizCount: 0,
        scenarioName: 'g_principal_2',
        thumbnailImageUrl: 'http://assets.lit.com/images/g_principal_2.gif',
        url: 'http://player.lit.com/player/step?project_name=principal&scenario_path=lesson/g_principal_2',
      },
      {
        course: '',
        description: 'Learn the characteristics or the essence of information.',
        hintCount: 0,
        id: 'lesson-cse-is-00_02',
        theme: '',
        skillsLearnedInThisLesson: '',
        lessonOverViewPdfUrl: '',
        lessonDuration: '20 min',
        lessonEnvironment: 'litLessonPlayer',
        level: 'basic',
        maxStarCount: 0,
        name: 'Information Characteristics',
        projectName: 'information1',
        quizCount: 3,
        scenarioName: '00_02',
        thumbnailImageUrl: '',
        url: 'http://player.lit.com/player/step?project_name=information1&scenario_path=lesson/00_02',
      },
    ])
  })
})
