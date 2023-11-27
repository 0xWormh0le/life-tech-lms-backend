export type UserLessonStepStatus = {
  id: string
  userId: string
  stepId: string
  userLessonStatusId: string
  lessonId: string
  status: 'not_cleared' | 'cleared'
  createdAt: Date
}
