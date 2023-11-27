export type UserLessonStepStatus = {
  userId: string
  lessonId: string
  stepId: string
  status: 'not_cleared' | 'cleared'
}
