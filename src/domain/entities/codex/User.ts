export type UserRole =
  | 'student'
  | 'teacher'
  | 'administrator'
  | 'internalOperator'
  | 'anonymous'

export type User = {
  id: string
  role: UserRole
  loginId?: string
  email?: string
  isDeactivated?: boolean
}

export type MeInfo = {
  user: {
    id: string
    email?: string | null
    loginId?: string | null
    role: UserRole
  }
  administrator?: {
    id: string
    userId: string
    firstName: string
    lastName: string
    administratorLMSId: string
    districtId: string | null
  }
  teacher?: {
    id: string
    userId: string
    firstName: string
    lastName: string
    teacherLMSId: string
    districtId: string | null
    organizationIds: string[]
  }
  student?: {
    id: string
    userId: string
    nickName: string
    studentLMSId: string
    districtId: string | null
    organizationIds: string[]
    studentGroupIds: string[]
  }
}
