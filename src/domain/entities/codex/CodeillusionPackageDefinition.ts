import { Course } from './Lesson'

export type CodeillusionPackageChapterDefinition = {
  id: string
  name: string
  title: string
  lessonOverViewPdfUrl: string
  lessonNoteSheetsZipUrl: string
}

export type CodeillusionPackageCircleDefinition = {
  id: string
  codeillusionPackageChapterDefinitionId: string
  course: Course
  bookName: string
  characterImageUrl: string
  clearedCharacterImageUrl: string
  bookImageUrl: string
}

export type CodeillusionPackageLessonDefinition = {
  lessonId: string
  codeillusionPackageCircleDefinitionId: string
  uiType: string
}
