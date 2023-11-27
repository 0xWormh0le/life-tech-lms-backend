export type DistrictAdministrator = {
  administratorId: string
  userId: string
  districtId: string
  email: string
  firstName: string
  lastName: string
  administratorLMSId: string | null
  createdUserId: string
  createdDate: string
}

export type Administrator = {
  password?: string
  email: string
  firstName: string
  lastName: string
  administratorLMSId: string
}
