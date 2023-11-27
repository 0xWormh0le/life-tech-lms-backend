export type Administrator = {
  id: string
  userId: string
  firstName: string
  lastName: string
  administratorLMSId: string | null
  classlinkTenantId: string | null
  isDeactivated: boolean
}
