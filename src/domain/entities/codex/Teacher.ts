export type TeacherOrganization = {
  teacherId: string
  userId: string
  organizationId: string
  districtId: string
  email: string
  firstName: string
  lastName: string
  teacherLMSId: string
  isPrimary: boolean
  createdUserId: string
  createdDate: string
  teacherOrganizations?: OrgnaizationsList[]
}

export type OrgnaizationsList = {
  id: string
  name: string
  stateId?: string
}

export type Teachers = {
  id: string
  email: string
  firstName: string
  lastName: string
  userId?: string
  teacherLMSId: string
  createdUserId: string
  createdUserFirstName?: string | null
  createdUserLastName?: string | null
  createdDate: string
}

export type UpdateTeacher = {
  email: string
  firstName?: string
  lastName?: string
  teacherLMSId?: string
  password?: string
}

export type Teacher = {
  teacherId: string
  userId: string
  firstName?: string
  lastName?: string
  teacherLMSId?: string
  email?: string
  password?: string
  createdUserId: string
  createdDate: string
  classLinkTenantId?: string
}
