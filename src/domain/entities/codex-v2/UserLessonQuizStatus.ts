export type UserLessonQuizStatus = {
  id: string
  userId: string
  lessonQuizId: string
  userLessonStatusId: string
  isCorrect: boolean
  selectedChoice: string
  createdAt: Date
}
