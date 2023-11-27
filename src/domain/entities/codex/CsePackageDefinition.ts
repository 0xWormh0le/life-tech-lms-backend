export type CsePackageUnitDefinition = {
  id: string
  name: string
  description: string
}

export type CsePackageLessonDefinition = {
  lessonId: string
  csePackageUnitDefinitionId: string
  isQuizLesson: boolean
}
