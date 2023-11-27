export type Student = {
  id: string
  userId: string
  role: 'student'
  nickName: string
  externalLmsStudentId: string | null
  classlinkTenantId: string | null
  isDeactivated: boolean
  createdUserId: string
  createdAt: Date
}
