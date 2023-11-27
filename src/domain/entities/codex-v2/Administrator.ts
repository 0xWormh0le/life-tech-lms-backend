export type Administrator = {
  id: string
  userId: string
  role: 'administrator'
  districtId: string
  firstName: string
  lastName: string
  externalLmsAdministratorId: string | null
  isDeactivated: boolean
  createdUserId: string
  createdAt: Date
}
