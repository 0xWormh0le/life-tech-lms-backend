export type Teacher = {
  id: string
  userId: string
  role: 'teacher'
  firstName: string
  lastName: string
  externalLmsTeacherId: string | null
  isDeactivated: boolean
  createdUserId: string | null
  createdAt: Date
}
