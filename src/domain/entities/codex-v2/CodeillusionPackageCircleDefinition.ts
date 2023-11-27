import { Lesson } from './Lesson'

export type CodeillusionPackageCircleDefinition = {
  id: string
  codeillusionPackageChapterDefinitionId: string
  course: Lesson['course']
  bookName: string
  characterImageUrl: string
  clearedCharacterImageUrl: string
  bookImageUrl: string
}
