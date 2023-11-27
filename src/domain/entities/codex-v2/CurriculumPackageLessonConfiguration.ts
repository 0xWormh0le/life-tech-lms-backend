import { Lesson } from './Lesson'
import { CurriculumPackage } from './CurriculumPackage'

export type CurriculumPackageLessonConfiguration = {
  curriculumPackageId: CurriculumPackage['id']
  lessonId: Lesson['id']
}
