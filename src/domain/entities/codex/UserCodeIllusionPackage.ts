import { Course } from './Lesson'

export type UserCodeIllusionPackage = {
  id: string
  level: 'basic' | 'advanced'
  name: string
  headerButtonLink: string | null
  headerButtonText: string | null
  redirectUrlWhenAllFinished: string | null
  chapters: {
    id: string
    name: string
    title: string
    circles: {
      id: string
      course: Course
      characterImageUrl: string
      clearedCharacterImageUrl: string
      gemLessonIds: string[]
      bookLessonIds: string[]
      bookName: string
      bookImageUrl: string
      allLessonIds: string[]
    }[]
  }[]
}
