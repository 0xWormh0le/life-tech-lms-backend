export interface UserLessonStatus {
  id: string
  userId: string
  lessonId: string
  status: 'not_cleared' | 'cleared'
  startedAt: Date
  finishedAt: Date | null
  achievedStarCount: number
  correctAnsweredQuizCount: number | null
  usedHintCount: number | null
  stepIdSkippingDetected: boolean
}
