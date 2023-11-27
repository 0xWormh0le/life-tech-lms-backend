export type UserLessonStatusHistory = {
  id: string
  userId: string
  lessonId: string
  status: 'not_cleared' | 'cleared'
  achievedStarCount: number
  correctAnsweredQuizCount: number | null
  usedHintCount: number | null
  stepIdskippingDetected: boolean
  startedAt?: string
  finishedAt?: string
}
