export type User = {
  id: string
  role:
    | 'internalOperator'
    | 'administrator'
    | 'teacher'
    | 'student'
    | 'anonymous'
  loginId?: string
  email?: string
  isDeactivated: boolean
}
