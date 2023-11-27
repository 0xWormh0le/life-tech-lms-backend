import { UserCodeIllusionPackage } from '../../src/domain/entities/codex/UserCodeIllusionPackage'
import chapter1Json from './chapter-jsons/codeillusion-basic-chapter-1.json'
import chapter2Json from './chapter-jsons/codeillusion-basic-chapter-2.json'
import chapter3Json from './chapter-jsons/codeillusion-basic-chapter-3.json'
import chapter4Json from './chapter-jsons/codeillusion-basic-chapter-4.json'
import chapter5Json from './chapter-jsons/codeillusion-basic-chapter-5.json'
import chapter6Json from './chapter-jsons/codeillusion-basic-chapter-6.json'
import chapter7Json from './chapter-jsons/codeillusion-basic-chapter-7.json'
import chapterBossJson from './chapter-jsons/codeillusion-basic-chapter-boss.json'

type Lesson = {
  id: string
  projectName: string
  scenarioPath: string
  level: 'basic' | 'advanced'
  course: 'basic' | 'mediaArt' | 'gameDevelopment' | 'webDesign'
  title: string
  description: string
  lessonDuration: string
}

const lessonIdPrefix = 'lesson-codeillusion-basic'
const circleIdPrefix = 'circle-codeillusion'
const chapterIdPrefix = 'chapter-codeillusion'

const convertCource = (source: string): Lesson['course'] => {
  switch (source) {
    case 'basic':
      return 'basic'
    case 'media_art':
      return 'mediaArt'
    case 'game':
      return 'gameDevelopment'
    case 'web_design':
      return 'webDesign'
    default:
      throw new Error(`unsupported course name detected ${source}`)
  }
}

const makeLessonList = async () => {
  const lessons: Lesson[] = []
  const pushLessonsFromCircle = (circle: (typeof chapter1Json.data)[0]) => {
    const course = convertCource(circle.course_name)

    for (const gemLesson of circle.jewels) {
      for (const gemLessonDetail of gemLesson.lessons) {
        lessons.push({
          id: `${lessonIdPrefix}-${gemLessonDetail.project_name}-gem-${gemLessonDetail.display_order}`,
          projectName: gemLessonDetail.project_name,
          scenarioPath: gemLessonDetail.scenario_path,
          level: 'basic',
          course,
          title: gemLesson.jewel_label,
          description: gemLesson.jewel_description,
          lessonDuration: gemLesson.estimated_time,
        })
      }
    }
    for (const bookLesson of circle.lessons) {
      lessons.push({
        id: `${lessonIdPrefix}-${bookLesson.project_name}-book-${bookLesson.display_order}`,
        projectName: bookLesson.project_name,
        scenarioPath: bookLesson.scenario_path,
        level: 'basic',
        course,
        title: circle.book_label,
        description: circle.book_label,
        lessonDuration: '',
      })
    }
  }

  for (const circle of chapter1Json.data) {
    pushLessonsFromCircle(circle)
  }
  for (const circle of chapter2Json.data) {
    pushLessonsFromCircle(circle)
  }
  for (const circle of chapter3Json.data) {
    pushLessonsFromCircle(circle)
  }
  for (const circle of chapter4Json.data) {
    pushLessonsFromCircle(circle)
  }
  for (const circle of chapter5Json.data) {
    pushLessonsFromCircle(circle)
  }
  for (const circle of chapter6Json.data) {
    pushLessonsFromCircle(circle)
  }
  for (const circle of chapter7Json.data) {
    pushLessonsFromCircle(circle)
  }

  for (const lesson of lessons) {
    // id	level	cource	project_name	scenario_path	title	description estimatedTime
    console.log(
      `${lesson.id}\t${lesson.level}\t${lesson.course}\t${lesson.projectName}\t${lesson.scenarioPath}\t${lesson.title}\t${lesson.description}\t${lesson.lessonDuration}`,
    )
  }
}

const circleId = (circle: (typeof chapter1Json.data)[0]) => {
  return `${circleIdPrefix}-${
    circle.magic_circle_name.split('_')[1]
  }-${circle.course_name.replace('game', 'game_development')}`
}

const makeCodeIllustionPackage = (): UserCodeIllusionPackage => {
  const circles: UserCodeIllusionPackage['chapters'][0]['circles'] = []

  const convertChapter = (
    srcChapter: typeof chapter1Json | typeof chapter6Json,
    num: string,
  ): UserCodeIllusionPackage['chapters'][0] => {
    return {
      id: `${chapterIdPrefix}-${num}`,
      name: srcChapter.chapter_label,
      title: `${chapterIdPrefix}-${num}`,
      circles: srcChapter.data.map((circle) => {
        const course = convertCource(circle.course_name)

        return {
          id: circleId(circle),
          course,
          gemLessonIds: circle.jewels.map((l) => {
            const gemLessonDetail = l.lessons[0]

            return `${lessonIdPrefix}-${gemLessonDetail.project_name}-gem-${gemLessonDetail.display_order}`
          }),
          bookName: circle.book_label,
          bookLessonIds: circle.lessons.map((l) => {
            return `${lessonIdPrefix}-${l.project_name}-book-${l.display_order}`
          }),
          characterImageUrl: '',
          clearedCharacterImageUrl: '',
          bookImageUrl: '',
          allLessonIds: [],
        }
      }),
    }
  }

  return {
    id: 'package-codeillusion-basic',
    level: 'basic',
    name: 'package-name',
    headerButtonLink: '',
    headerButtonText: '',
    redirectUrlWhenAllFinished: null,
    chapters: [
      convertChapter(chapter1Json, '1'),
      convertChapter(chapter2Json, '2'),
      convertChapter(chapter3Json, '3'),
      convertChapter(chapter4Json, '4'),
      convertChapter(chapter5Json, '5'),
      convertChapter(chapter6Json, '6'),
      convertChapter(chapter7Json, '7'),
    ],
  }
}

const main = () => {
  // makeLessonList()
  // makeCircleList()
  // makeChapterList()
  const codeIllusionPackage = makeCodeIllustionPackage()

  console.log(JSON.stringify(codeIllusionPackage))
}

main()
