export type UserLessonStatus = {
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

export type StudentGroupLessonStatus = {
  userId: string
  lessonId: string
  status: 'not_cleared' | 'cleared'
  achievedStarCount: number
  correctAnsweredQuizCount: number | null
  usedHintCount: number | null
  stepIdskippingDetected: boolean
  startedAt?: string
  finishedAt?: string
  quizCount: number
}
