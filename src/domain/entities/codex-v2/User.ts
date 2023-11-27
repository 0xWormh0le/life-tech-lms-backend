export type UserRole = User['role']

export type User = {
  id: string
  role: 'student' | 'teacher' | 'administrator' | 'internalOperator'
  isDemo: boolean
  createdAt: Date
  updatedAt: Date
}
