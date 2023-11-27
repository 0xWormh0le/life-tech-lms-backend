export type Teacher = {
  id: string
  userId: string
  firstName: string
  lastName: string
  teacherLMSId: string | null
  classlinkTenantId: string | null
  schoolAdministratorsName?: string
  isDeactivated: boolean
}
